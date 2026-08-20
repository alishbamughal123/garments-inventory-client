import api, { buildQueryParams } from "./api";

const returnsEndpoint = "/returns";

export const getReturns = async (params = {}) => {
  const response = await api.get(returnsEndpoint, {
    params: buildQueryParams(typeof params === "object" ? params : { status: params }),
  });
  return response.data;
};

export const createReturn = async (payload) => {
  const response = await api.post(returnsEndpoint, payload);
  return response.data;
};

export const getReturnById = async (id) => {
  const response = await api.get(`${returnsEndpoint}/${id}`);
  return response.data;
};

export const deleteReturn = async (id) => {
  const response = await api.delete(`${returnsEndpoint}/${id}`);
  return response.data;
};

export const updateReturn = async (id, payload) => {
  const response = await api.put(`${returnsEndpoint}/${id}`, payload);
  return response.data;
};
