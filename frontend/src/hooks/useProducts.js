import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import productApi from '@/api/productApi';

// ---------------------------------------------------------------------------
// Query Key Factory
// Keeps cache keys consistent and composable across the entire app.
// ---------------------------------------------------------------------------
export const productKeys = {
  all: ['products'],
  list: (filters) => [...productKeys.all, 'list', filters],
  detail: (id) => [...productKeys.all, 'detail', id],
};

// ---------------------------------------------------------------------------
// READ — Queries
// ---------------------------------------------------------------------------

/**
 * Fetch all products, optionally filtered by search / category.
 * @param {Object} filters - { search?: string, category?: string }
 */
export const useProducts = (filters = {}) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productApi.getAll(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
    select: (res) => res.data ?? [],
  });
};

/**
 * Fetch a single product by ID.
 * @param {string} id
 */
export const useProduct = (id) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productApi.getById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (res) => res.data,
  });
};

// ---------------------------------------------------------------------------
// WRITE — Mutations
// ---------------------------------------------------------------------------

/**
 * Create a new product.
 * Automatically invalidates the product list cache on success.
 *
 * Usage:
 *   const { mutate: createProduct, isPending } = useCreateProduct();
 *   createProduct(formData, { onSuccess, onError });
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => productApi.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};

/**
 * Update an existing product by ID.
 * Invalidates both the list cache and the specific product's detail cache.
 *
 * Usage:
 *   const { mutate: updateProduct, isPending } = useUpdateProduct();
 *   updateProduct({ id, formData }, { onSuccess, onError });
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }) => productApi.update(id, formData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
    },
  });
};

/**
 * Delete a product by ID.
 * Invalidates the product list cache on success.
 *
 * Usage:
 *   const { mutate: deleteProduct, isPending } = useDeleteProduct();
 *   deleteProduct(id, { onSuccess, onError });
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => productApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};
