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
        <nav className="sticky top-0 z-40 bg-[#1a1a2e]/80 backdrop-blur-xl border-b border-[#8b5cf6]/20 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-8">
                        <h1
                            onClick={() => navigate('/dashboard')}
                            className="text-2xl font-extrabold bg-gradient-to-r from-[#a78bfa] to-[#ec4899] bg-clip-text text-transparent cursor-pointer"
                        >
                            FormoraX
                        </h1>

                        <div className="hidden md:flex items-center gap-1">
                            <button onClick={() => navigate('/dashboard')} className="nav-link">
                                Dashboard
                            </button>
                            <button onClick={() => navigate('/forms/new')} className="nav-link">
                                Create Form
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#6366f1] to-[#ec4899] flex items-center justify-center text-white font-bold text-sm">
                                {user?.name?.slice(0, 2).toUpperCase() || 'U'}
                            </div>
                            <span className="hidden sm:block text-[#e2e8f0] font-medium">
                                {user?.name}
                            </span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-medium text-[#94a3b8] hover:text-[#ec4899] transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}