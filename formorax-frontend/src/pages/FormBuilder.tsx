import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { formAPI } from '../services/api';
import Navbar from '../components/Navbar';

interface Question {
    id: string;
    label: string;
    type: 'text' | 'multiple';
    options?: string[];
    required: boolean;
}

export default function FormBuilder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [title, setTitle] = useState('Untitled Form');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));

        if (id) {
            fetchForm();
        }
    }, [id]);

    const fetchForm = async () => {
        try {
            const res = await formAPI.getOne(id!);
            setTitle(res.data.title);
            setQuestions(res.data.questions || []);
        } catch (err) {
            alert('Failed to load form');
            navigate('/dashboard');
        }
    };

    const addQuestion = (type: 'text' | 'multiple') => {
        const newQuestion: Question = {
            id: crypto.randomUUID(),
            label: '',
            type,
            options: type === 'multiple' ? ['Option 1'] : undefined,
            required: false,
        };
        setQuestions([...questions, newQuestion]);
    };

    const updateQuestion = (index: number, field: string, value: any) => {
        const updated = [...questions];
        updated[index] = { ...updated[index], [field]: value };
        setQuestions(updated);
    };

    const addOption = (index: number) => {
        const updated = [...questions];
        const options = updated[index].options || [];
        options.push(`Option ${options.length + 1}`);
        updated[index].options = options;
        setQuestions(updated);
    };

    const updateOption = (qIndex: number, optIndex: number, value: string) => {
        const updated = [...questions];
        if (updated[qIndex].options) {
            updated[qIndex].options![optIndex] = value;
        }
        setQuestions(updated);
    };

    const removeOption = (qIndex: number, optIndex: number) => {
        const updated = [...questions];
        if (updated[qIndex].options) {
            updated[qIndex].options = updated[qIndex].options!.filter((_, i) => i !== optIndex);
        }
        setQuestions(updated);
    };

    const removeQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const moveQuestion = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === questions.length - 1) return;

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        const updated = [...questions];
        [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
        setQuestions(updated);
    };

    const handleSave = async () => {
        if (!title.trim()) {
            alert('Please enter a form title');
            return;
        }

        setSaving(true);
        try {
            if (id) {
                await formAPI.update(id, { title, questions });
            } else {
                await formAPI.create({ title, questions });
            }
            navigate('/dashboard');
        } catch (err) {
            alert('Failed to save form');
        } finally {
            setSaving(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen">
            <Navbar user={user} />

            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="btn-outline !px-4 !py-2"
                    >
                        ← Back
                    </button>
                    <button
                        onClick={handleSave}
                        className="btn-gradient"
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Form'}
                    </button>
                </div>

                <div className="glass-card p-6 mb-6">
                    <input
                        type="text"
                        placeholder="Form Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-2xl font-semibold border-none bg-transparent p-0 focus:ring-0"
                    />
                </div>
                <div className="glass-card p-6 mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        📝 Form Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Customer Feedback Survey"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-2xl font-semibold w-full input-modern"
                    />
                    {!title.trim() && (
                        <p className="text-amber-600 text-sm mt-2 flex items-center gap-1">
                            ⚠️ Don't forget to name your form!
                        </p>
                    )}
                </div>

                {questions.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">Start building your form</h3>
                        <p className="text-slate-500 mb-6">Add questions to collect responses</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {questions.map((q, index) => (
                            <div key={q.id} className="glass-card p-6 animate-fade-in">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="flex flex-col gap-1">
                                        <button
                                            onClick={() => moveQuestion(index, 'up')}
                                            className="p-1 hover:bg-slate-100 rounded"
                                            disabled={index === 0}
                                        >
                                            ↑
                                        </button>
                                        <button
                                            onClick={() => moveQuestion(index, 'down')}
                                            className="p-1 hover:bg-slate-100 rounded"
                                            disabled={index === questions.length - 1}
                                        >
                                            ↓
                                        </button>
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                placeholder="Question"
                                                value={q.label}
                                                onChange={(e) => updateQuestion(index, 'label', e.target.value)}
                                                className="flex-1 input-modern"
                                            />
                                            <select
                                                value={q.type}
                                                onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                                                className="w-40 input-modern"
                                            >
                                                <option value="text">📝 Text</option>
                                                <option value="multiple">☑️ Multiple Choice</option>
                                            </select>
                                        </div>

                                        {q.type === 'multiple' && (
                                            <div className="ml-0 space-y-2">
                                                <label className="text-sm font-medium text-slate-600">Options</label>
                                                {q.options?.map((opt, optIndex) => (
                                                    <div key={optIndex} className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={opt}
                                                            onChange={(e) => updateOption(index, optIndex, e.target.value)}
                                                            className="flex-1 input-modern !py-2"
                                                        />
                                                        {q.options!.length > 1 && (
                                                            <button
                                                                onClick={() => removeOption(index, optIndex)}
                                                                className="px-3 text-red-500 hover:bg-red-50 rounded-lg"
                                                            >
                                                                ✕
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => addOption(index)}
                                                    className="text-sm text-blue-600 hover:underline"
                                                >
                                                    + Add Option
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={q.required}
                                            onChange={(e) => updateQuestion(index, 'required', e.target.checked)}
                                            className="w-4 h-4 rounded border-slate-300"
                                        />
                                        <span className="text-sm text-slate-600">Required</span>
                                    </label>
                                    <button
                                        onClick={() => removeQuestion(index)}
                                        className="text-red-500 text-sm hover:underline"
                                    >
                                        Remove Question
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex gap-3 justify-center mt-6">
                    <button
                        onClick={() => addQuestion('text')}
                        className="btn-outline !px-6 !py-3"
                    >
                        + Add Text Question
                    </button>
                    <button
                        onClick={() => addQuestion('multiple')}
                        className="btn-outline !px-6 !py-3"
                    >
                        + Add Multiple Choice
                    </button>
                </div>
            </main>
        </div>
    );
}