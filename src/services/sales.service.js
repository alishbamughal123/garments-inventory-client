import api from "./api";

const salesEndpoint = "/sales";

export const createSale =
  async (payload) => {
    const response =
      await api.post(
        salesEndpoint,
        payload
      );

    return response.data;
  };

export const getSales =
  async () => {
    const response =
      await api.get(
        salesEndpoint
      );

    return response.data;
  };

export const getSaleById =
  async (id) => {
    const response =
      await api.get(
        `${salesEndpoint}/${id}`
      );

    return response.data;
  };

export const deleteSale = async (id) => {
  const response = await api.delete(`${salesEndpoint}/${id}`);
  return response.data;
};

export const updateSale = async (id, payload) => {
  const response = await api.put(`${salesEndpoint}/${id}`, payload);
  return response.data;
};
