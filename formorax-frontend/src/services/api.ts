import axios from 'axios';
// Force redeploy - v1

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    signup: (data: { email: string; password: string; name: string }) =>
        api.post('/auth/signup', data),
    login: (data: { email: string; password: string }) =>
        api.post('/auth/login', data),
};

export const formAPI = {
    create: (data: any) => api.post('/forms', data),
    getAll: () => api.get('/forms'),
    getOne: (id: string) => api.get(`/public/forms/${id}`),  // ✅ FIXED
    update: (id: string, data: any) => api.put(`/forms/${id}`, data),
    delete: (id: string) => api.delete(`/forms/${id}`),
};

export const responseAPI = {
    submit: (formId: string, answers: any) =>
        api.post(`/public/forms/${formId}/submit`, { answers }),
    getResponses: (formId: string) => api.get(`/forms/${formId}/responses`),
};

export default api;
