import api from "./api";

const supportEndpoint = "/support";

export const getTickets = async (filters = {}) => {
  const response = await api.get(supportEndpoint, {
    params: filters,
  });
  return response.data;
};

export const getTicketById = async (id) => {
  const response = await api.get(`${supportEndpoint}/${id}`);
  return response.data;
};

export const createTicket = async (data) => {
  const response = await api.post(supportEndpoint, data);
  return response.data;
};

export const updateTicket = async (id, data) => {
  const response = await api.put(`${supportEndpoint}/${id}`, data);
  return response.data;
};

export const deleteTicket = async (id) => {
  const response = await api.delete(`${supportEndpoint}/${id}`);
  return response.data;
};
