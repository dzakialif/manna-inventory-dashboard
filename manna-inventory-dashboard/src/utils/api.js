import router from '@/router';

const baseURL = import.meta.env.VITE_API_URL;

function logoutAndRedirect() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    router.push('/login');
}

async function request(endpoint, options = {}, isRetry = false) {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    const url = `${baseURL}${endpoint}`;

    try {
        let response = await fetch(url, config);
        
        // Menangani sesi kadaluarsa / tidak sah
        if (response.status === 401 && !isRetry && endpoint !== '/auth/login' && endpoint !== '/auth/refresh') {
            if (!window.refreshPromise) {
                window.refreshPromise = (async () => {
                    const refreshToken = localStorage.getItem('refreshToken');
                    if (!refreshToken) {
                        logoutAndRedirect();
                        throw new Error('Sesi telah berakhir, silakan login kembali.');
                    }
                    
                    try {
                        const refreshResponse = await fetch(`${baseURL}/auth/refresh`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ refreshToken })
                        });

                        if (refreshResponse.ok) {
                            const refreshData = await refreshResponse.json();
                            if (refreshData && refreshData.data && refreshData.data.accessToken) {
                                localStorage.setItem('token', refreshData.data.accessToken);
                                if (refreshData.data.refreshToken) {
                                    localStorage.setItem('refreshToken', refreshData.data.refreshToken);
                                }
                                return refreshData.data.accessToken;
                            }
                        }
                        
                        logoutAndRedirect();
                        throw new Error('Sesi telah berakhir, silakan login kembali.');
                    } catch (error) {
                        logoutAndRedirect();
                        throw error;
                    } finally {
                        window.refreshPromise = null;
                    }
                })();
            }

            try {
                await window.refreshPromise;
                return await request(endpoint, options, true);
            } catch (error) {
                throw error;
            }
        }

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const error = new Error(data.message || 'Terjadi kesalahan pada server');
            error.response = { status: response.status, data };
            throw error;
        }

        // Return object yang mirip struktur Axios (response.data)
        return { data, status: response.status };
    } catch (error) {
        throw error;
    }
}

export const api = {
    get: (endpoint, options) => request(endpoint, { method: 'GET', ...options }),
    post: (endpoint, body, options) => request(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }),
    put: (endpoint, body, options) => request(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options }),
    delete: (endpoint, options) => request(endpoint, { method: 'DELETE', ...options }),
};
