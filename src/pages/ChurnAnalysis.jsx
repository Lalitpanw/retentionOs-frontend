import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAppContext } from '../context/useContenxt';

export default function ChurnAnalysis() {
    const { processedUsersData, downloadCSV } = useAppContext()

    if (!processedUsersData || processedUsersData.length === 0) {
        return <p style={{ color: '#d97706' }}>⚠️ Please upload data first.</p>;
    }

    // Compute metrics
    const totalUsers = processedUsersData.length;
    const highRisk = processedUsersData.filter(row => row.risk_level === 'High');
    const mediumRisk = processedUsersData.filter(row => row.risk_level === 'Medium');
    const lowRisk = processedUsersData.filter(row => row.risk_level === 'Low');

    const highRiskCount = highRisk.length;
    const mediumRiskCount = mediumRisk.length;
    const lowRiskCount = lowRisk.length

    console.log({ processedUsersData, highRisk, mediumRisk, lowRisk })

    // Prepare chart data
    const chartData = [
        { risk: '🔴 High', count: highRiskCount },
        { risk: '🟠 Medium', count: mediumRiskCount },
        { risk: '🟢 Low', count: lowRiskCount }
    ];

    const handleDownloadCsv = (data, fileName) =>{
        downloadCSV(data, fileName)
    }

    return (
        <div className='max-w-[1200px] m-auto py-5'>
            <h1 className='text-2xl pb-10'>📊 Churn Risk Overview</h1>

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                <MetricCard onClick={() => handleDownloadCsv(processedUsersData)} label="Total Users" value={totalUsers} />
                <MetricCard onClick={() => handleDownloadCsv(highRisk, 'high_risk_churn_anlysis')} label="🔴 High Risk" value={highRiskCount} />
                <MetricCard onClick={() => handleDownloadCsv(mediumRisk, 'medium_risk_churn_anlysis')} label="🟠 Medium Risk" value={mediumRiskCount} />
                <MetricCard onClick={() => handleDownloadCsv(lowRisk, 'low_risk_churn_anlysis')} label="🟢 Low Risk" value={lowRiskCount} />
            </div>

            <ResponsiveContainer width="100%" height={500}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="risk" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

// Simple metric card component
function MetricCard({ label, value, onClick }) {
    return (
        <div
            onClick={onClick}
            style={{
                padding: '1rem 2rem',
                border: '1px solid #ddd',
                borderRadius: '12px',
                background: '#f9f9f9',
                textAlign: 'center',
                minWidth: '150px',
                cursor: 'pointer'
            }}>
            <h3 style={{ marginBottom: '0.5rem' }}>{label}</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</p>
        </div>
    );
}
