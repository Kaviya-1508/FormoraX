import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formAPI } from '../services/api';

interface Question {
    id: string;
    label: string;
    type: 'text' | 'multiple';
    options?: string[];
    required: boolean;
}

export default function FormBuilder() {
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const navigate = useNavigate();

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

    const removeQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        try {
            await formAPI.create({ title, questions });
            navigate('/dashboard');
        } catch (err) {
            alert('Failed to create form');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow p-4">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Create Form</h1>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-4 py-2 border rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="bg-blue-600 text-white px-6 py-2 rounded"
                        >
                            Save Form
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto p-6">
                <input
                    type="text"
                    placeholder="Form Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-2xl p-4 border rounded mb-6"
                />

                {questions.map((q, index) => (
                    <div key={q.id} className="bg-white p-6 rounded-lg shadow mb-4">
                        <div className="flex gap-3 mb-3">
                            <input
                                type="text"
                                placeholder="Question"
                                value={q.label}
                                onChange={(e) => updateQuestion(index, 'label', e.target.value)}
                                className="flex-1 p-2 border rounded"
                            />
                            <select
                                value={q.type}
                                onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                                className="p-2 border rounded"
                            >
                                <option value="text">Text</option>
                                <option value="multiple">Multiple Choice</option>
                            </select>
                        </div>

                        {q.type === 'multiple' && (
                            <div className="ml-4 space-y-2">
                                {q.options?.map((opt, optIndex) => (
                                    <input
                                        key={optIndex}
                                        type="text"
                                        value={opt}
                                        onChange={(e) => {
                                            const newOptions = [...(q.options || [])];
                                            newOptions[optIndex] = e.target.value;
                                            updateQuestion(index, 'options', newOptions);
                                        }}
                                        className="block w-full p-2 border rounded"
                                    />
                                ))}
                                <button
                                    onClick={() => addOption(index)}
                                    className="text-blue-600 text-sm"
                                >
                                    + Add Option
                                </button>
                            </div>
                        )}

                        <div className="flex justify-between mt-3">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={q.required}
                                    onChange={(e) => updateQuestion(index, 'required', e.target.checked)}
                                />
                                Required
                            </label>
                            <button
                                onClick={() => removeQuestion(index)}
                                className="text-red-500"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}

                <div className="flex gap-3 justify-center mt-6">
                    <button
                        onClick={() => addQuestion('text')}
                        className="bg-gray-100 px-6 py-3 rounded hover:bg-gray-200"
                    >
                        + Add Text Question
                    </button>
                    <button
                        onClick={() => addQuestion('multiple')}
                        className="bg-gray-100 px-6 py-3 rounded hover:bg-gray-200"
                    >
                        + Add Multiple Choice
                    </button>
                </div>
            </main>
        </div>
    );
}