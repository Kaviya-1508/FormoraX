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
                formAPI.getForm(id!),
                responseAPI.getResponses(id!),
            ]);

            setForm(formRes.data);

            const responseData = responsesRes.data;
            let responsesArray: any[] = [];

            if (responseData && typeof responseData === 'object') {
                if (Array.isArray(responseData)) {
                    responsesArray = responseData;
                } else if (responseData.data && Array.isArray(responseData.data)) {
                    responsesArray = responseData.data;
                } else if (responseData.responses && Array.isArray(responseData.responses)) {
                    responsesArray = responseData.responses;
                } else if (responseData.content && Array.isArray(responseData.content)) {
                    responsesArray = responseData.content;
                }
            }

            setResponses(responsesArray);
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
            return <span className="text-gray-500 italic font-normal">—</span>;
        }

        if (answer.length > 50) {
            return (
                <span title={answer} className="text-gray-200 font-medium">
                    {answer.substring(0, 47)}...
                </span>
            );
        }

        return <span className="text-gray-200 font-medium">{answer}</span>;
    };

    if (!user) return null;

    return (
        <div className="min-h-screen">
            <Navbar user={user} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="btn-secondary !px-4 !py-2 mb-3"
                        >
                            ← Back to Dashboard
                        </button>
                        <h1 className="text-4xl font-bold text-white mb-1">
                            {form?.title || 'Untitled Form'}
                        </h1>
                        <p className="text-gray-300 text-lg">
                            {responses.length} {responses.length === 1 ? 'response' : 'responses'} received
                        </p>
                    </div>

                    {responses.length > 0 && (
                        <button
                            onClick={exportCSV}
                            className="btn-primary flex items-center gap-2"
                        >
                            📥 Export to CSV
                        </button>
                    )}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="spinner"></div>
                    </div>
                ) : responses.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <div className="text-7xl mb-4">📭</div>
                        <h3 className="empty-state-title mb-2">No responses yet</h3>
                        <p className="empty-state-desc mb-6">Share your form to start collecting responses</p>
                        <button
                            onClick={() => {
                                const link = `${window.location.origin}/form/${id}`;
                                navigator.clipboard.writeText(link);
                                alert('📋 Form link copied to clipboard!');
                            }}
                            className="btn-primary"
                        >
                            📋 Copy Form Link
                        </button>

                        {/* Debug Info */}
                        <div className="mt-8 p-4 bg-white/5 rounded-xl text-left border border-white/10">
                            <p className="text-sm font-semibold text-gray-300 mb-2">Debug Info:</p>
                            <p className="text-xs text-gray-400">Form ID: {id}</p>
                            <p className="text-xs text-gray-400">Form has {form?.questions?.length || 0} questions</p>
                            <p className="text-xs text-gray-400">Form link: {window.location.origin}/form/{id}</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="glass-card overflow-hidden">
                            <div className="overflow-x-auto scrollbar-custom">
                                <table className="w-full">
                                    <thead className="bg-white/5 border-b border-white/10">
                                        <tr>
                                            <th className="px-4 py-4 text-left text-sm font-bold text-purple-300 uppercase tracking-wider w-12">#</th>
                                            {form?.questions?.map((q: any) => (
                                                <th key={q.id} className="px-4 py-4 text-left text-sm font-bold text-purple-300 uppercase tracking-wider min-w-[150px]">
                                                    <div className="flex items-center gap-1">
                                                        {q.label || 'Question'}
                                                        {q.required && <span className="text-pink-400 text-xs">*</span>}
                                                    </div>
                                                    <span className="text-xs font-normal text-gray-400 block normal-case tracking-normal">
                                                        {q.type === 'text' ? '📝 Text' : '☑️ Choice'}
                                                    </span>
                                                </th>
                                            ))}
                                            <th className="px-4 py-4 text-left text-sm font-bold text-purple-300 uppercase tracking-wider w-48">Submitted</th>
                                            <th className="px-4 py-4 text-left text-sm font-bold text-purple-300 uppercase tracking-wider w-20"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {responses.map((res, i) => (
                                            <tr key={res.id || i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-4 text-sm font-semibold text-gray-300">{i + 1}</td>

                                                {form?.questions?.map((q: any) => (
                                                    <td key={q.id} className="px-4 py-4 text-sm">
                                                        {getAnswerDisplay(res, q)}
                                                    </td>
                                                ))}

                                                <td className="px-4 py-4 text-sm text-gray-400 whitespace-nowrap font-medium">
                                                    {res.submittedAt ? new Date(res.submittedAt).toLocaleString(undefined, {
                                                        dateStyle: 'medium',
                                                        timeStyle: 'short'
                                                    }) : 'Unknown'}
                                                </td>

                                                <td className="px-4 py-4">
                                                    <button
                                                        onClick={() => deleteResponse(res.id)}
                                                        disabled={deleting === res.id}
                                                        className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                                        title="Delete response"
                                                    >
                                                        {deleting === res.id ? (
                                                            <span className="spinner !w-4 !h-4"></span>
                                                        ) : (
                                                            '🗑️'
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-4 text-gray-400 text-sm flex justify-between items-center">
                            <span className="font-medium">
                                Showing {responses.length} response{responses.length !== 1 ? 's' : ''}
                            </span>
                            <button
                                onClick={fetchData}
                                className="btn-secondary !px-4 !py-2 text-sm"
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
