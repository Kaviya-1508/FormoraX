import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formAPI } from '../services/api';

export default function Dashboard() {
    const [forms, setForms] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));

        fetchForms();
    }, []);

    const fetchForms = async () => {
        try {
            const res = await formAPI.getAll();
            setForms(res.data);
        } catch (err) {
            console.error('Failed to fetch forms');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const copyLink = (formId: string) => {
        const link = `${window.location.origin}/form/${formId}`;
        navigator.clipboard.writeText(link);
        alert('Link copied!');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow p-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">FormoraX</h1>
                    <div className="flex items-center gap-4">
                        <span>Welcome, {user?.name}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">My Forms</h2>
                    <button
                        onClick={() => navigate('/forms/new')}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        + Create Form
                    </button>
                </div>

                {forms.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg">
                        <p className="text-gray-500">No forms yet. Create your first form!</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {forms.map((form) => (
                            <div key={form.id} className="bg-white p-6 rounded-lg shadow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-semibold">{form.title}</h3>
                                        <p className="text-gray-500 text-sm mt-1">
                                            Created: {new Date(form.createdAt).toLocaleDateString()}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            Questions: {form.questions?.length || 0}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => copyLink(form.id)}
                                            className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
                                        >
                                            📋 Copy Link
                                        </button>
                                        <button
                                            onClick={() => navigate(`/forms/${form.id}/responses`)}
                                            className="bg-green-100 px-3 py-1 rounded hover:bg-green-200"
                                        >
                                            📊 Responses
                                        </button>
                                        <button
                                            onClick={() => navigate(`/forms/${form.id}/edit`)}
                                            className="bg-blue-100 px-3 py-1 rounded hover:bg-blue-200"
                                        >
                                            ✏️ Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}