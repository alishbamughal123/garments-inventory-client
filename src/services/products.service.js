import api from "./api";

export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const searchProducts = async (query) => {
  const response = await api.get(
    `/products/search?q=${query}`
  );

  return response.data;
};

export const getProductByBarcode = async (
  barcode
) => {
  const response = await api.get(
    `/products/barcode/${barcode}`
  );

  return response.data;
};
export const createProduct = async (
  data
) => {
  const response =
    await api.post(
      "/products",
      data
    );

  return response.data;
};
export const getProductById = async (
  id
) => {
  const response =
    await api.get(
      `/products/${id}`
    );

  return response.data;
};

export const updateProduct = async (
  id,
  data
) => {
  const response =
    await api.put(
      `/products/${id}`,
      data
    );

  return response.data;
};

export const deleteProduct = async (
  id
) => {
  const response =
    await api.delete(
      `/products/${id}`
    );

  return response.data;
};
