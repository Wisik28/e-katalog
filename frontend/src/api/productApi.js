import axiosInstance from './axiosInstance';

const ENDPOINT = '/api/products';

/**
 * Product API — all CRUD operations.
 */
const productApi = {
  /**
   * GET all products.
   * Supports optional query params: search, category.
   * @param {Object} params - { search?: string, category?: string }
   * @returns {Promise<{ success: boolean, count: number, data: Product[] }>}
   */
  getAll: async (params = {}) => {
    const { data } = await axiosInstance.get(ENDPOINT, { params });
    return data;
  },

  /**
   * GET a single product by its ID.
   * @param {string} id
   * @returns {Promise<{ success: boolean, data: Product }>}
   */
  getById: async (id) => {
    const { data } = await axiosInstance.get(`${ENDPOINT}/${id}`);
    return data;
  },

  /**
   * POST — create a new product.
   * Sends as multipart/form-data to support image upload.
   * @param {FormData} formData
   * @returns {Promise<{ success: boolean, data: Product }>}
   */
  create: async (formData) => {
    const { data } = await axiosInstance.post(ENDPOINT, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * PUT — update an existing product by ID.
   * Sends as multipart/form-data to support image replacement.
   * @param {string} id
   * @param {FormData} formData
   * @returns {Promise<{ success: boolean, data: Product }>}
   */
  update: async (id, formData) => {
    const { data } = await axiosInstance.put(`${ENDPOINT}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * DELETE — remove a product by ID.
   * @param {string} id
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  remove: async (id) => {
    const { data } = await axiosInstance.delete(`${ENDPOINT}/${id}`);
    return data;
  },
};

export default productApi;
