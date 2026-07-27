import axiosInstance from './axiosInstance';

const ENDPOINT = '/api/auth';

/**
 * Auth API — login and token management.
 */
const authApi = {
  /**
   * POST — login as admin.
   * On success, stores the JWT token in sessionStorage.
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<{ success: boolean, data: { id: string, email: string, token: string } }>}
   */
  login: async (credentials) => {
    const { data } = await axiosInstance.post(`${ENDPOINT}/login`, credentials);
    if (data.success && data.data?.token) {
      sessionStorage.setItem('token', data.data.token);
      sessionStorage.setItem('admin_email', data.data.email);
      sessionStorage.setItem('admin_name', data.data.name || 'Admin');
    }
    return data;
  },

  /**
   * POST — register a new admin.
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  register: async (credentials) => {
    const { data } = await axiosInstance.post(`${ENDPOINT}/register`, credentials);
    return data;
  },

  /**
   * Logout — removes token and email and name from sessionStorage.
   */
  logout: () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('admin_email');
    sessionStorage.removeItem('admin_name');
  },

  /**
   * Get the current user email from sessionStorage.
   * @returns {string | null}
   */
  getEmail: () => {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('admin_email');
  },

  /**
   * Get the current user name from sessionStorage.
   * @returns {string | null}
   */
  getName: () => {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('admin_name') || 'Admin';
  },

  /**
   * Get the current token from sessionStorage.
   * @returns {string | null}
   */
  getToken: () => {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('token');
  },

  /**
   * Check whether the user is currently authenticated.
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return Boolean(authApi.getToken());
  },

  /**
   * GET — fetch current admin profile details.
   */
  getProfile: async () => {
    // consume API untuk endpoint /profile
    const { data } = await axiosInstance.get(`${ENDPOINT}/profile`);
    return data;
  },

  /**
   * PUT — update current admin profile details.
   */
  updateProfile: async (profileData) => {
    // consum API untuk edit (PUT) pada endpoint /profile
    const { data } = await axiosInstance.put(`${ENDPOINT}/profile`, profileData);
    if (data.success && data.data) {
      if (data.data.email) sessionStorage.setItem('admin_email', data.data.email);
      if (data.data.name) sessionStorage.setItem('admin_name', data.data.name);
    }
    return data;
  },

  /**
   * GET — fetch public admin contact details.
   */
  getContact: async () => {
    const { data } = await axiosInstance.get(`${ENDPOINT}/contact`);
    return data;
  },
};

export default authApi;
