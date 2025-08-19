import { useNavigate } from "react-router-dom";
import { BarChart3, Users, MessageCircle, FolderOpen } from "lucide-react";
import { useAppContext } from "../context/useContenxt";
import { useState } from "react";

export default function Home() {
    const { downloadCSV, handleFileUpload, loading, processedUsersData } =
        useAppContext();
    const navigate = useNavigate();
    const [fileName, setFileName] = useState("");

    console.log(processedUsersData)

    const onFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        } else {
            setFileName("");
        }
        handleFileUpload(e);
    };

    return (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Data Upload Section */}
            <div className="text-center mb-16">
                <div className="flex justify-center mb-6">
                    <FolderOpen className="h-16 w-16 text-blue-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Data Upload</h1>
                <p className="text-xl text-gray-600 mb-8">Predict. Segment. Re-engage.</p>

                <div className="flex gap-10 w-full justify-center items-start">
                    <div className="flex flex-col">
                        <label className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white px-12 py-4 text-lg font-medium rounded-lg">
                            Choose file
                            <input
                                type="file"
                                accept=".csv,.xlsx"
                                onChange={onFileChange}
                                disabled={loading}
                                className="hidden"
                            />
                        </label>
                        {
                            fileName && <span className="text-gray-700 text-sm">{fileName}</span>
                        }
                    </div>




                    {processedUsersData.length ? (
                        <button
                            onClick={() => downloadCSV(processedUsersData)}
                            className="bg-slate-500 hover:bg-slate-700 cursor-pointer text-white px-12 py-4 text-lg font-medium rounded-lg"
                        >
                            Download File
                        </button>
                    ) : null}
                </div>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 justify-center">
                {[
                    {
                        icon: <BarChart3 className="h-12 w-12 text-blue-600" />,
                        title: "Churn Analysis",
                        description: "Track churn trends and spot patterns over time",
                        route: "/churn-analysis",
                    },
                    {
                        icon: <Users className="h-12 w-12 text-blue-600" />,
                        title: "User Segments",
                        description: "Discover key customer groups and their behaviors",
                        route: "/user-segment",
                    },
                    {
                        icon: <MessageCircle className="h-12 w-12 text-blue-600" />,
                        title: "Nudge Suggestions",
                        description: "Get tailored engagement ideas to win users back",
                        route: "/nudge-suggestion",
                    },
                    {
                        icon: <MessageCircle className="h-12 w-12 text-blue-600" />,
                        title: "Cohort Analysis",
                        description:
                            "Compare retention across different customer cohorts",
                        route: "/cohort-analysis",
                    },
                    {
                        icon: <Users className="h-12 w-12 text-blue-600" />,
                        title: "RAG Insights",
                        description:
                            "See Red-Amber-Green risk levels for targeted action",
                        route: "/rag-insights",
                    },
                    {
                        icon: <BarChart3 className="h-12 w-12 text-blue-600" />,
                        title: "Export Data",
                        description:
                            "Download insights to share with your team or tools",
                        route: "/export-data",
                    },
                ].map((item, index) => (
                    <div
                        key={index}
                        className="text-center p-6 border-0 shadow-sm cursor-pointer hover:shadow-md transition"
                        onClick={() => navigate(item.route)}
                    >
                        <div className="flex justify-center mb-4">{item.icon}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {item.title}
                        </h3>
                        <p className="text-gray-600">{item.description}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}
