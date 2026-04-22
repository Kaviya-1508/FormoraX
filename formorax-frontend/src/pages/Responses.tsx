import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { responseAPI, formAPI } from '../services/api';

export default function Responses() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState<any>(null);
    const [responses, setResponses] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [formRes, responsesRes] = await Promise.all([
                    formAPI.getOne(id!),
                    responseAPI.getResponses(id!),
                ]);
                setForm(formRes.data);
                setResponses(responsesRes.data);
            } catch (err) {
                alert('Failed to load responses');
            }
        };
        fetchData();
    }, [id]);

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow p-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">{form?.title}</h1>
                        <p className="text-gray-600">{responses.length} responses</p>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-2 border rounded"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto p-6">
                {responses.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow text-center">
                        <p className="text-gray-500">No responses yet.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-4 text-left">#</th>
                                    {form?.questions?.map((q: any) => (
                                        <th key={q.id} className="p-4 text-left">{q.label}</th>
                                    ))}
                                    <th className="p-4 text-left">Submitted</th>
                                </tr>
                            </thead>
                            <tbody>
                                {responses.map((res, i) => (
                                    <tr key={res.id} className="border-b">
                                        <td className="p-4">{i + 1}</td>
                                        {form?.questions?.map((q: any) => (
                                            <td key={q.id} className="p-4">
                                                {res.answers?.[q.id] || '-'}
                                            </td>
                                        ))}
                                        <td className="p-4 text-gray-500">
                                            {new Date(res.submittedAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}