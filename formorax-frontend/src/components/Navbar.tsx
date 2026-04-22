import { useNavigate } from 'react-router-dom';

interface NavbarProps {
    user: any;
}

export default function Navbar({ user }: NavbarProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-8">
                        <h1
                            onClick={() => navigate('/dashboard')}
                            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
                        >
                            FormoraX
                        </h1>

                        <div className="hidden md:flex items-center gap-1">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="relative px-3 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors"
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => navigate('/forms/new')}
                                className="relative px-3 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors"
                            >
                                Create Form
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                {user?.name?.slice(0, 2).toUpperCase() || 'U'}
                            </div>
                            <span className="hidden sm:block text-sm font-medium text-gray-700">
                                {user?.name}
                            </span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}