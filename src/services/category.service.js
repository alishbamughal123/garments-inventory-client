import api, { buildQueryParams } from "./api";

export const getCategories =
  async (searchOrParams = "") => {
    const params =
      typeof searchOrParams === "object" && searchOrParams !== null
        ? searchOrParams
        : { search: searchOrParams };

    const response =
      await api.get(
        "/categories",
        {
          params: buildQueryParams(params),
        }
      );

    return response.data;
  };

export const createCategory =
  async (data) => {
    const response =
      await api.post(
        "/categories",
        data
      );

    return response.data;
  };

export const updateCategory =
  async (id, data) => {
    const response =
      await api.put(
        `/categories/${id}`,
        data
      );

    return response.data;
  };

export const deleteCategory =
  async (id) => {
    const response =
      await api.delete(
        `/categories/${id}`
      );

    return response.data;
  };