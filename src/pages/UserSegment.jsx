import { PieChart, Pie, Cell, Tooltip, BarChart, XAxis, YAxis, Bar, ResponsiveContainer } from "recharts";
import { useAppContext } from "../context/useContenxt";
import { useState } from "react";

export default function UserSegment() {
    const [selectedRiskLevel, setSelectedRiskLevel] = useState('all')

    const { processedUsersData = [], dataSummary, downloadCSV } = useAppContext();

    const processDataWithSelectedFilter = selectedRiskLevel === 'all' ? processedUsersData : processedUsersData.filter(data => data.risk_level.toLocaleLowerCase() === selectedRiskLevel.toLocaleLowerCase())

    // Chart data
    const genderSplitData = [
        { name: "Male", value: processDataWithSelectedFilter.filter(u => u.gender === "Male").length },
        { name: "Female", value: processDataWithSelectedFilter.filter(u => u.gender === "Female").length },
        { name: "Other", value: processDataWithSelectedFilter.filter(u => u.gender === "Other").length },
    ];

    const cartValueByPriceRange = ["Low", "Mid", "High"].map(range => ({
        range,
        value: processDataWithSelectedFilter
            .filter(u => u.price_range === range)
            .reduce((acc, u) => acc + Number(u.cart_value ?? 0), 0) /
            (processDataWithSelectedFilter.filter(u => u.price_range === range).length || 1),
    }));


    const handleRiskChange = (event) => {
        setSelectedRiskLevel(event.target.value)
    }

    const totalCartValue = processDataWithSelectedFilter.reduce((acc, curr) => {
        const cartValue = curr?.cart_value || 0
        acc += cartValue
        return acc;
    }, 0)

    const averageCartValue = selectedRiskLevel === 'all' ? dataSummary?.avgCartValue?.toFixed(2) ?? 0 : Math.ceil(totalCartValue / processDataWithSelectedFilter.length)

    const upliftRevenue = processDataWithSelectedFilter.length * averageCartValue;


    console.log({ dataSummary, processDataWithSelectedFilter })

    if (!processDataWithSelectedFilter || processDataWithSelectedFilter.length === 0) {
        return <p style={{ color: '#d97706' }}>⚠️ Please upload data first.</p>;
    }


    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">User Segments Dashboard</h1>

            {/* Filter Bar */}
            <div className="flex flex-wrap gap-4">
                <select name="risk-level" value={selectedRiskLevel} onChange={handleRiskChange} className="border rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none">
                    <option value="all">All Risk Level</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
                {["Gender", "Price Range", "Activity", "Purchase Recency"].map((f, idx) => (
                    <select key={idx} className="border rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none">
                        <option value="all">All {f}</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                ))}
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white shadow rounded-xl p-4">
                    <h3 className="text-gray-500 text-sm">Total Users</h3>
                    <p className="text-xl font-semibold">{selectedRiskLevel === 'all' ? dataSummary?.totalUsers : processDataWithSelectedFilter.length}</p>
                </div>
                <div className="bg-white shadow rounded-xl p-4">
                    <h3 className="text-gray-500 text-sm">Avg. Cart Value</h3>
                    <p className="text-xl font-semibold">₹{averageCartValue}</p>
                </div>
                <div className="bg-white shadow rounded-xl p-4">
                    <h3 className="text-gray-500 text-sm">Est. Uplift Revenue</h3>
                    <p className="text-xl font-semibold">₹{upliftRevenue?.toFixed(2)}</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white shadow rounded-xl p-4">
                    <h3 className="text-gray-500 text-sm mb-2">Gender Split per Risk Level</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={genderSplitData} dataKey="value" nameKey="name" outerRadius={80} label>
                                <Cell fill="#4f46e5" />
                                <Cell fill="#ec4899" />
                                <Cell fill="#9ca3af" />
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white shadow rounded-xl p-4">
                    <h3 className="text-gray-500 text-sm mb-2">Avg. Cart Value by Price Range</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={cartValueByPriceRange}>
                            <XAxis dataKey="range" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#4f46e5" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* AI Nudges + Table */}
            <div className="bg-white shadow rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-gray-500 text-sm">AI-Powered Nudges</h3>
                    <button
                        onClick={() => downloadCSV(processDataWithSelectedFilter)}
                        className="px-4 py-2 border rounded-lg text-sm bg-gray-50 hover:bg-gray-100"
                    >
                        Export CSV
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border">User ID</th>
                                <th className="p-2 border">Risk</th>
                                <th className="p-2 border">Segment</th>
                                <th className="p-2 border">Churn Score</th>
                                <th className="p-2 border">Nudge</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processDataWithSelectedFilter.map((u, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="p-2 border">{u.user_id}</td>
                                    <td className="p-2 border">{u.risk_level}</td>
                                    <td className="p-2 border">{u.segment}</td>
                                    <td className="p-2 border">{u.churn_score}</td>
                                    <td className="p-2 border">{u.nudge_recommendation}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
