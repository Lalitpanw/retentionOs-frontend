import { useNavigate } from "react-router-dom";
import { BarChart3, Users, MessageCircle, FolderOpen } from "lucide-react"

import { useAppContext } from '../context/useContenxt';



export default function Home() {
    const { downloadCSV, handleFileUpload, loading, processedUsersData } = useAppContext()
    const navigate = useNavigate()

    const handleChurnAnalysisClick = () => {
        navigate('/churn-analysis')
    }

    return (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Data Upload Section */}
            <div className="text-center mb-16">
                <div className="flex justify-center mb-6">
                    <FolderOpen className="h-16 w-16 text-blue-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Data Upload</h1>
                <p className="text-xl text-gray-600 mb-8">Predict. Segment. Re-engage.</p>

                <div className="flex gap-10 w-full">

                    <input className="bg-blue-300 hover:bg-blue-500 cursor-pointer text-white px-12 py-4 text-lg font-medium rounded-lg" placeholder={loading ? 'Proccessing' : "Browse Files"} type="file" accept=".csv,.xlsx" onChange={handleFileUpload} />

                    {
                        processedUsersData &&
                        <div
                            onClick={() => downloadCSV(processedUsersData)}
                            className="bg-slate-500  hover:bg-slate-700 cursor-pointer text-white px-12 py-4 text-lg font-medium rounded-lg"
                        >
                            Download File
                        </div>
                    }
                </div>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 justify-center">
                {/* Churn Overview */}
                <div className="text-center p-6 border-0 shadow-sm cursor-pointer" onClick={() => navigate('/churn-analysis')}>
                    <div className="pt-6">
                        <div className="flex justify-center mb-4">
                            <BarChart3 className="h-12 w-12 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Churn Analysis</h3>
                        <p className="text-gray-600">Track churn trends and spot patterns over time</p>
                    </div>
                </div>

                {/* User Segments */}
                <div className="text-center p-6 border-0 shadow-sm" onClick={() => navigate('/user-segment')}>
                    <div className="pt-6">
                        <div className="flex justify-center mb-4">
                            <Users className="h-12 w-12 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">User Segments</h3>
                        <p className="text-gray-600">Discover key customer groups and their behaviors</p>
                    </div>
                </div>

                {/* Nudge Suggestions */}
                <div className="text-center p-6 border-0 shadow-sm" onClick={() => navigate('/nudge-suggestion')}>
                    <div className="pt-6">
                        <div className="flex justify-center mb-4">
                            <MessageCircle className="h-12 w-12 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Nudge Suggestions</h3>
                        <p className="text-gray-600">Get tailored engagement ideas to win users back</p>
                    </div>
                </div>

                <div className="text-center p-6 border-0 shadow-sm" onClick={() => navigate('/nudge-suggestion')}>
                    <div className="pt-6">
                        <div className="flex justify-center mb-4">
                            <MessageCircle className="h-12 w-12 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Cohort Analysis</h3>
                        <p className="text-gray-600">Compare retention across different customer cohorts</p>
                    </div>
                </div>

                <div className="text-center p-6 border-0 shadow-sm" onClick={() => navigate('/nudge-suggestion')}>
                    <div className="pt-6">
                        <div className="flex justify-center mb-4">
                            <Users className="h-12 w-12 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">RAG Insights</h3>
                        <p className="text-gray-600">See Red-Amber-Green risk levels for targeted action</p>
                    </div>
                </div>

                <div className="text-center p-6 border-0 shadow-sm" onClick={() => navigate('/nudge-suggestion')}>
                    <div className="pt-6">
                        <div className="flex justify-center mb-4">
                            <BarChart3 className="h-12 w-12 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2"> Export Data</h3>
                        <p className="text-gray-600">Download insights to share with your team or tools</p>
                    </div>
                </div>

            </div>
        </main>
    );
}
