import router from '@/router';

const baseURL = import.meta.env.VITE_API_URL;

function logoutAndRedirect() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
}

async function request(endpoint, options = {}, isRetry = false) {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
        credentials: 'include',  // selalu sertakan cookie pada setiap request
    };

    let url = `${baseURL}${endpoint}`;

    if (options.params) {
        const cleanParams = Object.fromEntries(
            Object.entries(options.params).filter(([_, v]) => v != null && v !== '')
        );
        const query = new URLSearchParams(cleanParams).toString();
        if (query) {
            url += `?${query}`;
        }
        delete config.params;
    }

    try {
        let response = await fetch(url, config);
        
        // Menangani sesi kadaluarsa / tidak sah
        if (response.status === 401 && !isRetry && endpoint !== '/auth/login' && endpoint !== '/auth/refresh') {
            if (!window.refreshPromise) {
                window.refreshPromise = (async () => {
                    try {
                        // Refresh token dikirim otomatis via HttpOnly cookie
                        const refreshResponse = await fetch(`${baseURL}/auth/refresh`, {
                            method: 'POST',
                            credentials: 'include',  // sertakan cookie
                        });

                        if (refreshResponse.ok) {
                            const refreshData = await refreshResponse.json();
                            if (refreshData && refreshData.data && refreshData.data.accessToken) {
                                localStorage.setItem('token', refreshData.data.accessToken);
                                return refreshData.data.accessToken;
                            }
                        }
                        
                        // Refresh gagal (token tidak valid/expired)
                        logoutAndRedirect();
                        throw new Error('Sesi telah berakhir, silakan login kembali.');
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
    post: (endpoint, body, options) => request(endpoint, { method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body), ...options }),
    put: (endpoint, body, options) => request(endpoint, { method: 'PUT', body: body instanceof FormData ? body : JSON.stringify(body), ...options }),
    delete: (endpoint, options) => request(endpoint, { method: 'DELETE', ...options }),
};
