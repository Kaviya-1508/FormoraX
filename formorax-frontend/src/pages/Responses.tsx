import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { responseAPI, formAPI } from '../services/api';
import Navbar from '../components/Navbar';

export default function Responses() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [form, setForm] = useState<any>(null);
    const [responses, setResponses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));

        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [formRes, responsesRes] = await Promise.all([
                formAPI.getOne(id!),
                responseAPI.getResponses(id!),
            ]);

            setForm(formRes.data);

            // Handle different response formats
            const responseData = responsesRes.data;
            let responsesArray: any[] = [];

            if (responseData && typeof responseData === 'object') {
                if (Array.isArray(responseData)) {
                    // Direct array
                    responsesArray = responseData;
                } else if (responseData.data && Array.isArray(responseData.data)) {
                    // Wrapped in ApiResponse { data: [...] }
                    responsesArray = responseData.data;
                } else if (responseData.responses && Array.isArray(responseData.responses)) {
                    // Wrapped in { responses: [...] }
                    responsesArray = responseData.responses;
                } else if (responseData.content && Array.isArray(responseData.content)) {
                    // Spring Page format
                    responsesArray = responseData.content;
                } else {
                    console.warn('Unknown response format, using empty array');
                }
            }

            setResponses(responsesArray);
            console.log('📊 Form:', formRes.data);
            console.log('📊 Responses:', responsesArray);
        } catch (err) {
            console.error('Failed to load responses:', err);
            alert('Failed to load responses');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const deleteResponse = async (responseId: string) => {
        if (!confirm('Delete this response? This cannot be undone.')) return;

        setDeleting(responseId);
        try {
            // Remove from UI immediately
            setResponses(responses.filter(r => r.id !== responseId));
        } catch (err) {
            alert('Failed to delete response');
        } finally {
            setDeleting(null);
        }
    };

    const exportCSV = () => {
        if (!form || !responses.length) return;

        const headers = form.questions.map((q: any) => q.label || 'Question');
        const rows = responses.map((r: any) =>
            form.questions.map((q: any) => {
                const answer = extractAnswer(r, q);
                return `"${String(answer).replace(/"/g, '""')}"`;
            })
        );

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${form.title || 'form'}-responses.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const extractAnswer = (response: any, question: any): string => {
        if (!response || !response.answers) return '';

        let answer = response.answers[question.id] ||
            response.answers[question.label];

        if (answer === null || answer === undefined) return '';

        if (typeof answer === 'object') {
            const nested = answer.answer || answer.value || answer.text || answer.response;
            if (nested !== undefined) answer = nested;
        }

        return String(answer);
    };

    const getAnswerDisplay = (response: any, question: any) => {
        const answer = extractAnswer(response, question);

        if (!answer || answer.trim() === '') {
            return <span className="text-gray-400 italic">—</span>;
        }

        if (answer.length > 50) {
            return (
                <span title={answer}>
                    {answer.substring(0, 47)}...
                </span>
            );
        }

        return answer;
    };

    if (!user) return null;

    return (
        <div className="min-h-screen">
            <Navbar user={user} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="mb-3 px-4 py-2 rounded-xl text-sm font-medium bg-white/70 backdrop-blur-sm border border-white/40 text-gray-700 hover:bg-white hover:shadow-lg transition-all"
                        >
                            ← Back to Dashboard
                        </button>
                        <h1 className="text-3xl font-bold text-gray-800">
                            {form?.title || 'Untitled Form'}
                        </h1>
                        <p className="text-gray-600 mt-1 text-lg">
                            {responses.length} {responses.length === 1 ? 'response' : 'responses'} received
                        </p>
                    </div>

                    {responses.length > 0 && (
                        <button
                            onClick={exportCSV}
                            className="px-5 py-2.5 rounded-xl font-medium text-white transition-all duration-300 hover:scale-105 flex items-center gap-2"
                            style={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)'
                            }}
                        >
                            📥 Export to CSV
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="spinner"></div>
                    </div>
                ) : responses.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No responses yet</h3>
                        <p className="text-gray-600 mb-6">Share your form to start collecting responses</p>
                        <button
                            onClick={() => {
                                const link = `${window.location.origin}/form/${id}`;
                                navigator.clipboard.writeText(link);
                                alert('📋 Form link copied to clipboard!');
                            }}
                            className="px-6 py-3 rounded-xl font-medium text-white transition-all duration-300 hover:scale-105"
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                boxShadow: '0 10px 25px -5px rgba(102, 126, 234, 0.4)'
                            }}
                        >
                            📋 Copy Form Link
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="glass-card overflow-hidden">
                            <div className="overflow-x-auto scrollbar-custom">
                                <table className="w-full">
                                    <thead className="bg-white/30 border-b border-white/20">
                                        <tr>
                                            <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 w-12">#</th>
                                            {form?.questions?.map((q: any) => (
                                                <th key={q.id} className="px-4 py-4 text-left text-sm font-semibold text-gray-700 min-w-[150px]">
                                                    {q.label || 'Question'}
                                                    {q.required && <span className="text-red-500 ml-1">*</span>}
                                                </th>
                                            ))}
                                            <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 w-48">Submitted</th>
                                            <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 w-20"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {responses.map((res, i) => (
                                            <tr key={res.id || i} className="table-row-hover border-b border-white/10 last:border-0">
                                                <td className="px-4 py-4 text-sm font-medium text-gray-500">{i + 1}</td>

                                                {form?.questions?.map((q: any) => (
                                                    <td key={q.id} className="px-4 py-4 text-sm text-gray-800">
                                                        {getAnswerDisplay(res, q)}
                                                    </td>
                                                ))}

                                                <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                    {res.submittedAt ? new Date(res.submittedAt).toLocaleString() : 'Unknown'}
                                                </td>

                                                <td className="px-4 py-4">
                                                    <button
                                                        onClick={() => deleteResponse(res.id)}
                                                        disabled={deleting === res.id}
                                                        className="p-2 rounded-lg text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50"
                                                        title="Delete response"
                                                    >
                                                        {deleting === res.id ? '...' : '🗑️'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="mt-4 text-gray-600 text-sm flex justify-between items-center">
                            <span>
                                Showing {responses.length} response{responses.length !== 1 ? 's' : ''}
                            </span>
                            <button
                                onClick={fetchData}
                                className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                            >
                                🔄 Refresh
                            </button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}