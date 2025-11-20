import axios from 'axios';

const API_BASE = '/api';

const apiClient = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        let errorMessage = 'An unexpected error occurred';

        if (error.response) {
            const { data, status } = error.response;

            if (data?.message) {
                errorMessage = data.message;
            } else if (data?.error) {
                errorMessage = data.error;
            } else if (typeof data === 'string') {
                errorMessage = data;
            } else {
                // Fallback based on status code
                switch (status) {
                    case 400:
                        errorMessage = 'Invalid request. Please check your input.';
                        break;
                    case 404:
                        errorMessage = 'Resource not found.';
                        break;
                    case 409:
                        errorMessage = 'This resource already exists.';
                        break;
                    case 429:
                        errorMessage = 'Too many requests. Please try again later.';
                        break;
                    case 500:
                        errorMessage = 'Server error. Please try again later.';
                        break;
                    default:
                        errorMessage = `Request failed with status ${status}`;
                }
            }
        } else if (error.request) {
            errorMessage = 'Cannot connect to server. Please check your connection.';
        } else {
            errorMessage = error.message || errorMessage;
        }

        const enhancedError = new Error(errorMessage);
        enhancedError.originalError = error;
        enhancedError.status = error.response?.status;

        return Promise.reject(enhancedError);
    }
);

export const api = {
    async fetchLinks(search = '') {
        const params = search ? { search } : {};
        const { data } = await apiClient.get('/links', { params });
        return data;
    },

    async createLink(targetUrl, customCode = '') {
        const { data } = await apiClient.post('/links', {
            targetUrl,
            customCode: customCode || undefined
        });
        return data;
    },

    async getLinkStats(code) {
        const { data } = await apiClient.get(`/links/${code}`);
        return data;
    },

    async deleteLink(code) {
        const { data } = await apiClient.delete(`/links/${code}`);
        return data;
    }
};
