import api, { buildQueryParams } from "./api";

export const getProducts = async (params = {}) => {
  const response = await api.get("/products", {
    params: buildQueryParams(params),
  });
  return response.data;
};

export const getBaseStyles = async () => {
  const response = await api.get("/products/base-styles");
  return response.data;
};

export const getLowStockProducts = async (params = {}) => {
  const response = await api.get("/products/low-stock", {
    params: buildQueryParams(params),
  });
  return response.data;
};

export const searchProducts = async (query, params = {}) => {
  const response = await api.get("/products/search", {
    params: buildQueryParams({ query, ...params }),
  });
  return response.data;
};

export const getProductByBarcode = async (barcode) => {
  const response = await api.get(`/products/barcode/${barcode}`);
  return response.data;
};

export const createProduct = async (data) => {
  const response = await api.post("/products", data);
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const updateProduct = async (id, data) => {
  const response = await api.put(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const getPriceHistory = async (id) => {
  const response = await api.get(`/products/${id}/price-history`);
  return response.data;
};

export const uploadProductImages = async (id, formData) => {
  const response = await api.post(`/products/${id}/images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const bulkUpdateCostPrice = async (data) => {
  const response = await api.post("/products/bulk-cost-price", data);
  return response.data;
};

