import axiosInstance from './axiosInstance';

const ENDPOINT = '/api/auth';

/**
 * Auth API — login and token management.
 */
const authApi = {
  /**
   * POST — login as admin.
   * On success, stores the JWT token in localStorage.
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<{ success: boolean, data: { id: string, email: string, token: string } }>}
   */
  login: async (credentials) => {
    const { data } = await axiosInstance.post(`${ENDPOINT}/login`, credentials);
    if (data.success && data.data?.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('admin_email', data.data.email);
    }
    return data;
  },

  /**
   * Logout — removes the token and email from localStorage.
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin_email');
  },

  /**
   * Get the current user email from localStorage.
   * @returns {string | null}
   */
  getEmail: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('admin_email');
  },

  /**
   * Get the current token from localStorage.
   * @returns {string | null}
   */
  getToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },

  /**
   * Check whether the user is currently authenticated.
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return Boolean(authApi.getToken());
  },
};

export default authApi;
