import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formAPI } from '../services/api';
import Navbar from '../components/Navbar';

export default function Dashboard() {
    const [forms, setForms] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
        fetchForms();

        // ✅ Auto-refresh when window gets focus
        const handleFocus = () => fetchForms();
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    const fetchForms = async () => {
        try {
            const res = await formAPI.getAll();
            setForms(res.data);
        } catch (err) {
            showToast('Failed to load forms');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message: string) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const copyLink = (formId: string, formTitle: string) => {
        const link = `${window.location.origin}/form/${formId}`;
        navigator.clipboard.writeText(link);
        showToast(`📋 Link for "${formTitle}" copied! Share this URL with anyone.`);
    };

    const deleteForm = async (formId: string, title: string) => {
        if (!confirm(`Delete "${title}"?`)) return;

        try {
            await formAPI.delete(formId);
            setForms(forms.filter(f => f.id !== formId));
            showToast('✅ Form deleted');
        } catch (err) {
            showToast('❌ Failed to delete form');
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen">
            <Navbar user={user} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    {/* Total Forms Card */}
                    <div
                        className="relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            boxShadow: '0 20px 40px -10px rgba(102, 126, 234, 0.4)'
                        }}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-10 -mb-10"></div>
                        <div className="relative p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white/80 text-sm font-medium mb-1">Total Forms</p>
                                    <p className="text-white text-4xl font-bold">{forms.length}</p>
                                </div>
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-3xl border border-white/30">
                                    📝
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Forms Card */}
                    <div
                        className="relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                        style={{
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            boxShadow: '0 20px 40px -10px rgba(245, 87, 108, 0.4)'
                        }}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-10 -mb-10"></div>
                        <div className="relative p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white/80 text-sm font-medium mb-1">Active Forms</p>
                                    <p className="text-white text-4xl font-bold">
                                        {forms.filter(f => f.isActive !== false).length}
                                    </p>
                                </div>
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-3xl border border-white/30">
                                    ✨
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Total Responses Card */}
                    <div
                        className="relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                        style={{
                            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                            boxShadow: '0 20px 40px -10px rgba(79, 172, 254, 0.4)'
                        }}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-10 -mb-10"></div>
                        <div className="relative p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white/80 text-sm font-medium mb-1">Total Responses</p>
                                    <p className="text-white text-4xl font-bold">
                                        {forms.reduce((sum, f) => sum + (f.stats?.responseCount || 0), 0)}
                                    </p>
                                </div>
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-3xl border border-white/30">
                                    📊
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Header with Refresh Button */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-white drop-shadow-md">My Forms</h2>
                    <div className="flex gap-3">
                        <button
                            onClick={fetchForms}
                            className="px-4 py-2 rounded-xl font-medium text-white/80 hover:text-white transition-all"
                            style={{ background: 'rgba(255,255,255,0.1)' }}
                        >
                            🔄 Refresh
                        </button>
                        <button
                            onClick={() => navigate('/forms/new')}
                            className="px-5 py-2.5 rounded-xl font-medium text-white transition-all duration-300 hover:scale-105"
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                boxShadow: '0 10px 25px -5px rgba(102, 126, 234, 0.4)'
                            }}
                        >
                            + Create New Form
                        </button>
                    </div>
                </div>

                {/* Forms List - rest unchanged */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="glass-card p-6 animate-pulse">
                                <div className="h-6 w-48 bg-white/30 rounded mb-2"></div>
                                <div className="h-4 w-32 bg-white/20 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : forms.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No forms yet</h3>
                        <p className="text-gray-600 mb-6">Create your first form to start collecting responses</p>
                        <button
                            onClick={() => navigate('/forms/new')}
                            className="px-6 py-3 rounded-xl font-medium text-white transition-all duration-300 hover:scale-105"
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                boxShadow: '0 10px 25px -5px rgba(102, 126, 234, 0.4)'
                            }}
                        >
                            Create Form
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {forms.map((form) => (
                            <div key={form.id} className="glass-card p-6 animate-fade-in">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-semibold text-gray-800">{form.title || 'Untitled Form'}</h3>
                                            {form.isActive === false && (
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200/80 text-gray-700">
                                                    Draft
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 text-sm mb-2">
                                            Created {new Date(form.createdAt).toLocaleDateString()}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="flex items-center gap-1 text-gray-600">
                                                <span>📊</span> {form.stats?.responseCount || 0} responses
                                            </span>
                                            <span className="flex items-center gap-1 text-gray-600">
                                                <span>❓</span> {form.questions?.length || 0} questions
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => copyLink(form.id, form.title || 'Untitled Form')}
                                            className="px-4 py-2 rounded-xl text-sm font-medium bg-white/70 backdrop-blur-sm border border-white/40 text-gray-700 hover:bg-white hover:shadow-lg transition-all"
                                        >
                                            📋 Copy Link
                                        </button>
                                        <button
                                            onClick={() => navigate(`/forms/${form.id}/responses`)}
                                            className="px-4 py-2 rounded-xl text-sm font-medium bg-white/70 backdrop-blur-sm border border-white/40 text-gray-700 hover:bg-white hover:shadow-lg transition-all"
                                        >
                                            📊 View
                                        </button>
                                        <button
                                            onClick={() => navigate(`/forms/${form.id}/edit`)}
                                            className="px-4 py-2 rounded-xl text-sm font-medium bg-white/70 backdrop-blur-sm border border-white/40 text-gray-700 hover:bg-white hover:shadow-lg transition-all"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => deleteForm(form.id, form.title)}
                                            className="px-4 py-2 rounded-xl text-sm font-medium bg-red-100/70 backdrop-blur-sm border border-red-200/40 text-red-600 hover:bg-red-200 hover:shadow-lg transition-all"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {toast && (
                <div className="fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-2xl bg-white/95 backdrop-blur-xl border border-white/50 z-50 font-medium text-gray-800 animate-slide-up">
                    {toast}
                </div>
            )}
        </div>
    );
}