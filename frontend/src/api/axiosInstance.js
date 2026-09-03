import axios from 'axios';

/**
 * Shared Axios instance for all API requests.
 * Base URL is set from the NEXT_PUBLIC_API_URL environment variable.
 */
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// hanya dijalankan ketika forward, ketika tdk disable saja dan enable yang atas
// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
// });


// Request interceptor: attach JWT token from sessionStorage if available
// otentiikasi token menggunakan session storage agar token hilang saat tab ditutup
// sehingga admin harus selalu melakukan login ketika mengakses page /admin
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default axiosInstance;
