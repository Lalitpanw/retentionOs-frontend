import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { createContext, useContext, useState } from "react";

const AppContext = createContext(null)

export const AppContextProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [dataSummary, setDataSummary] = useState({})
    const [processedUsersData, setProcessedUsersData] = useState([]);

    const wait = async () => {
        return new Promise((resolve) => {
            setTimeout(resolve, 2000)
        })
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true)

        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                let data;
                if (file.name.endsWith('.csv')) {
                    Papa.parse(event.target.result, {
                        header: true,
                        complete: async function (results) {
                            await processData(results.data);
                        },
                    });
                } else if (file.name.endsWith('.xlsx')) {
                    const workbook = XLSX.read(event.target.result, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    data = XLSX.utils.sheet_to_json(worksheet);
                    console.log("data", { data })
                    await processData(data);
                }
            } catch (err) {
                setError(`❌ Error: ${err.message}`);
            }
        };

        if (file.name.endsWith('.xlsx')) {
            reader.readAsBinaryString(file);
        } else {
            reader.readAsText(file);
        }
    };

    const processData = async (data) => {
        if (loading) return;

        await wait()

        const { rows = [], summary = {} } = processUsers(data)
        setProcessedUsersData(rows)
        setDataSummary(summary)
        setLoading(false)
    };

    const downloadCSV = (data = [], fileName = 'churn_prediction_output') => {

        console.log(`${fileName}: `, data)

        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.csv`;
        a.click();
    };

    /**
 * RetentionOS decision engine
 * Input: array of user objects (rows). Each row expected to have fields like:
 *  - user_id, product_views, cart_items, sessions_last_7_days, last_seen_days,
 *    number_of_purchases, cart_value, churn_score (optional), risk_level (optional)
 *
 * Output: new array with computed churn_score, risk_level, segment, nudge_recommendation
 *         plus a summary object with growth/retention insights.
 */

    /* Configurable thresholds (tweak for your business) */
    const DEFAULT_CONFIG = {
        daysDormantHigh: 14,
        daysDormantMedium: 7,
        sessionsLowThreshold: 1,
        productViewsLow: 3,
        highMonthlyValue: 100, // example threshold for high spend
        scoreBuckets: { high: 6, medium: 3 }, // score >=6 => High, >=3 => Medium, else Low
    };

    /* Compute rule-based churn score for a single row */
    function computeChurnScore(row, cfg = DEFAULT_CONFIG) {
        // Parse numeric fields defensively
        const lastSeenDays = Number(row.last_seen_days ?? row.lastSeenDays ?? NaN);
        const sessions7 = Number(row.sessions_last_7_days ?? row.sessionsLast7Days ?? NaN);
        const cartItems = Number(row.cart_items ?? row.cartItems ?? 0);
        const productViews = Number(row.product_views ?? row.productViews ?? 0);
        const numPurchases = Number(row.number_of_purchases ?? row.numberOfPurchases ?? 0);
        const cartValue = Number(row.cart_value ?? row.cartValue ?? 0);

        let score = 0;

        // Recency
        if (!Number.isNaN(lastSeenDays)) {
            if (lastSeenDays > cfg.daysDormantHigh) score += 3;
            else if (lastSeenDays > cfg.daysDormantMedium) score += 2;
        }

        // Activity
        if (!Number.isNaN(sessions7)) {
            if (sessions7 <= cfg.sessionsLowThreshold) score += 2;
            else if (sessions7 <= 3) score += 1;
        }

        // Browsing vs adding to cart
        if (cartItems === 0 && productViews < cfg.productViewsLow) score += 1;
        if (cartItems === 0 && productViews >= cfg.productViewsLow) score += 2; // browsing but no cart

        // Purchase history & value
        if (!Number.isNaN(numPurchases)) {
            if (numPurchases <= 0) score += 2; // never purchased
            else if (numPurchases === 1) score += 1;
        }
        if (!Number.isNaN(cartValue) && cartValue === 0) score += 1;

        // Price sensitivity / high spend cushion
        if (!Number.isNaN(cartValue) && cartValue >= cfg.highMonthlyValue) {
            // higher spend -> slightly lower churn propensity
            score = Math.max(0, score - 1);
        }

        return score;
    }

    /* Convert score to risk level string */
    function scoreToRiskLevel(score, cfg = DEFAULT_CONFIG) {
        if (score >= cfg.scoreBuckets.high) return "High";
        if (score >= cfg.scoreBuckets.medium) return "Medium";
        return "Low";
    }

    /* Simple segmentation logic using risk & behaviour */
    function segmentUser(row, risk) {
        const productViews = Number(row.product_views ?? 0);
        const cartItems = Number(row.cart_items ?? 0);
        const numPurchases = Number(row.number_of_purchases ?? 0);
        const cartValue = Number(row.cart_value ?? 0);
        const lastSeenDays = Number(row.last_seen_days ?? 0);

        // Priority-first segmentation
        if (risk === "High" && lastSeenDays > 14) return "Dormant Users";
        if (risk === "High" && productViews >= 3 && cartItems === 0) return "Window Shoppers";
        if (risk === "Medium" && cartValue < 500 && numPurchases > 0) return "Low Spend Actives";
        if (risk === "Medium" && productViews > 10 && cartValue < 200) return "Value Seekers";
        if (risk === "Low" && numPurchases >= 3) return "Loyal Customers";

        // Fallback segments
        if (risk === "High") return "At-Risk — Generic";
        if (risk === "Medium") return "At-Risk — Engaged";
        return "Other / Healthy";
    }

    /* Map segment to recommended nudge(s) */
    function recommendNudge(segment, row) {
        switch (segment) {
            case "Dormant Users":
                return "We miss you! 20% off your next order + personalized hero product.";
            case "Window Shoppers":
                return "Limited-time coupon for items you viewed. Free shipping for 48 hours.";
            case "Low Spend Actives":
                return "Bundle deals at a discounted price to increase AOV (avg order value).";
            case "Value Seekers":
                return "Early access to sales and loyalty points on purchase — upgrade to Tier X.";
            case "Loyal Customers":
                return "Exclusive VIP reward + referral code to invite friends.";
            case "At-Risk — Generic":
                return "Personal outreach + small discount; follow-up push notification.";
            case "At-Risk — Engaged":
                return "Cart abandonment reminder + tailored product recommendation.";
            default:
                return "No nudge recommended.";
        }
    }

    /* Process array of users: compute churn_score, risk_level, segment, nudge_recommendation */
    function processUsers(rows, cfg = DEFAULT_CONFIG) {
        const enriched = rows.map((r) => {
            // If churn_score is present and numeric, keep it; otherwise compute
            let churnScore = r.churn_score !== undefined && !Number.isNaN(Number(r.churn_score))
                ? Number(r.churn_score)
                : computeChurnScore(r, cfg);

            // Normalize a possible existing risk_level, otherwise compute from score
            let risk = r.risk_level ?? r.riskLevel ?? null;
            if (!risk) risk = scoreToRiskLevel(churnScore, cfg);

            const segment = segmentUser(r, risk);
            const nudge = recommendNudge(segment, r);

            return {
                ...r,
                churn_score: churnScore,
                risk_level: risk,
                segment,
                nudge_recommendation: nudge,
            };
        });

        const summary = generateInsights(enriched);
        return { rows: enriched, summary };
    }

    /* Generate simple growth/retention insights */
    function generateInsights(enrichedRows) {
        const total = enrichedRows.length;
        const counts = enrichedRows.reduce(
            (acc, r) => {
                acc[r.risk_level] = (acc[r.risk_level] || 0) + 1;
                acc.bySegment[r.segment] = (acc.bySegment[r.segment] || 0) + 1;
                acc.potentialRevenue += Number(r.cart_value ?? 0);
                return acc;
            },
            { High: 0, Medium: 0, Low: 0, bySegment: {}, potentialRevenue: 0 }
        );

        // % at-risk
        const pctHigh = total ? (counts.High / total) * 100 : 0;
        const pctMedium = total ? (counts.Medium / total) * 100 : 0;
        const pctLow = total ? (counts.Low / total) * 100 : 0;

        // Heuristic uplift estimates (you can replace with historical campaign lift)
        // assume nudges convert 5% of High, 10% of Medium -> with avg order value = avg cart_value
        const avgCartValue = total ? counts.potentialRevenue / total : 0;
        const estUpliftRevenue =
            (counts.High * 0.05 + counts.Medium * 0.10) * avgCartValue;

        // Top segments to target: sort segments by size and show top 3
        const segmentsArr = Object.entries(counts.bySegment).map(([k, v]) => ({ segment: k, count: v }));
        segmentsArr.sort((a, b) => b.count - a.count);
        const topSegments = segmentsArr.slice(0, 3);

        return {
            totalUsers: total,
            counts: { high: counts.High, medium: counts.Medium, low: counts.Low },
            percentages: { high: pctHigh, medium: pctMedium, low: pctLow },
            avgCartValue,
            estimatedPotentialUpliftRevenue: estUpliftRevenue,
            topSegments,
        };
    }


    return <AppContext.Provider value={{
        downloadCSV, 
        handleFileUpload, 
        loading, 
        computeChurnScore,
        dataSummary,
        scoreToRiskLevel,
        processedUsersData,
        segmentUser,
        recommendNudge,
        processUsers,
        generateInsights
    }}>
        {children}
    </AppContext.Provider>
}


export const useAppContext = () => {
    const appContext = useContext(AppContext)

    if (!appContext) {
        throw new Error('Please wrap in context')
    }

    return appContext
}