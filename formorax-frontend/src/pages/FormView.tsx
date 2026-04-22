import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formAPI, responseAPI } from '../services/api';

export default function FormView() {
    const { slug } = useParams();
    const [form, setForm] = useState<any>(null);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const res = await formAPI.getOne(slug!);
                setForm(res.data);
            } catch (err) {
                alert('Form not found');
            } finally {
                setLoading(false);
            }
        };
        fetchForm();
    }, [slug]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        form?.questions?.forEach((q: any) => {
            if (q.required) {
                const answer = answers[q.id];
                if (!answer || (typeof answer === 'string' && answer.trim() === '')) {
                    newErrors[q.id] = 'This field is required';
                }
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        // Check if at least one question is answered
        const hasAnswers = Object.values(answers).some(v =>
            v && (typeof v === 'string' ? v.trim() !== '' : true)
        );

        if (!hasAnswers) {
            alert('Please answer at least one question');
            return;
        }

        setSubmitting(true);

        // Build formatted answers
        const formattedAnswers: Record<string, any> = {};

        form?.questions?.forEach((q: any) => {
            const answer = answers[q.id];
            if (answer !== undefined && answer !== null && answer.toString().trim() !== '') {
                formattedAnswers[q.id] = answer;
                formattedAnswers[q.label] = answer; // Backup by label
            }
        });

        console.log('📤 Submitting answers:', formattedAnswers);

        try {
            const res = await responseAPI.submit(slug!, formattedAnswers);
            console.log('✅ Response saved:', res.data);
            setSubmitted(true);
        } catch (err: any) {
            console.error('❌ Submit error:', err);
            alert(err.response?.data?.message || 'Failed to submit response');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="form-card text-center py-12">
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="text-2xl font-bold text-gradient mb-2">Response Submitted!</h2>
                    <p className="text-slate-600">Thank you for your response.</p>
                    <button
                        onClick={() => {
                            setSubmitted(false);
                            setAnswers({});
                        }}
                        className="mt-6 btn-gradient"
                    >
                        Submit Another Response
                    </button>
                </div>
            </div>
        );
    }

    if (!form) return null;

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="glass-card p-8">
                    <h1 className="text-3xl mb-2">{form.title || 'Untitled Form'}</h1>
                    {form.description && (
                        <p className="text-slate-600 mb-6">{form.description}</p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {form.questions?.map((q: any, index: number) => (
                            <div key={q.id || index} className="space-y-2">
                                <label className="block font-medium text-slate-700">
                                    {q.label || `Question ${index + 1}`}
                                    {q.required && <span className="text-red-500 ml-1">*</span>}
                                </label>

                                {q.type === 'text' && (
                                    <input
                                        type="text"
                                        placeholder="Your answer"
                                        value={answers[q.id] || ''}
                                        onChange={(e) => {
                                            setAnswers({ ...answers, [q.id]: e.target.value });
                                            setErrors({ ...errors, [q.id]: '' });
                                        }}
                                        className={`input-modern ${errors[q.id] ? '!border-red-300' : ''}`}
                                        disabled={submitting}
                                    />
                                )}

                                {q.type === 'multiple' && (
                                    <select
                                        value={answers[q.id] || ''}
                                        onChange={(e) => {
                                            setAnswers({ ...answers, [q.id]: e.target.value });
                                            setErrors({ ...errors, [q.id]: '' });
                                        }}
                                        className={`input-modern ${errors[q.id] ? '!border-red-300' : ''}`}
                                        disabled={submitting}
                                    >
                                        <option value="">Select an option</option>
                                        {q.options?.map((opt: string, i: number) => (
                                            <option key={i} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                )}

                                {errors[q.id] && (
                                    <p className="text-red-500 text-sm">{errors[q.id]}</p>
                                )}
                            </div>
                        ))}

                        <button
                            type="submit"
                            className="btn-gradient w-full"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="spinner !w-4 !h-4"></span>
                                    Submitting...
                                </span>
                            ) : (
                                'Submit Response'
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-white/60 text-sm mt-4">
                    Powered by FormoraX
                </p>
            </div>
        </div>
    );
}