import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formAPI, responseAPI } from '../services/api';

export default function FormView() {
    const { slug } = useParams();
    const [form, setForm] = useState<any>(null);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const res = await formAPI.getOne(slug!);
                setForm(res.data);
            } catch (err) {
                alert('Form not found');
            }
        };
        fetchForm();
    }, [slug]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await responseAPI.submit(slug!, answers);
            setSubmitted(true);
        } catch (err) {
            alert('Failed to submit');
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow text-center">
                    <h2 className="text-2xl font-bold text-green-600 mb-4">✓ Response Submitted!</h2>
                    <p className="text-gray-600">Thank you for your response.</p>
                </div>
            </div>
        );
    }

    if (!form) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
                <h1 className="text-3xl font-bold mb-6">{form.title}</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {form.questions?.map((q: any) => (
                        <div key={q.id} className="space-y-2">
                            <label className="block font-medium">
                                {q.label}
                                {q.required && <span className="text-red-500 ml-1">*</span>}
                            </label>

                            {q.type === 'text' && (
                                <input
                                    type="text"
                                    required={q.required}
                                    onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                                    className="w-full p-3 border rounded"
                                />
                            )}

                            {q.type === 'multiple' && (
                                <select
                                    required={q.required}
                                    onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                                    className="w-full p-3 border rounded"
                                >
                                    <option value="">Select an option</option>
                                    {q.options?.map((opt: string, i: number) => (
                                        <option key={i} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}