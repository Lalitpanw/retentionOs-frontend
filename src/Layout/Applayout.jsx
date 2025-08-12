import { Rocket } from "lucide-react"
import { Link, Outlet } from "react-router-dom"


const AppLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <Rocket className="h-8 w-8 text-orange-500" />
                            <Link to={'/'} className="text-xl font-bold text-gray-900 cursor-pointer">RetentionOS</Link>
                        </div>

                        <div className="flex gap-5 items-center justify-center">
                            {/* Navigation */}
                            <nav className="hidden md:flex items-end space-x-8">
                                <Link to={'/'} className="text-gray-700 hover:text-gray-900 font-medium">
                                    Home
                                </Link>
                                <Link to={'/about'} className="text-gray-700 hover:text-gray-900 font-medium">
                                    About
                                </Link>
                            </nav>

                            {/* CTA Button */}
                            <div className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                                Impact Snapshot
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <Outlet />
        </div>
    )
}

export default AppLayout