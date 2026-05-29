import axios from "axios";

const API_URL =
  `${import.meta.env.VITE_API_URL}/leads`;

const getAuthConfig = () => {
  const token =
    localStorage.getItem("token");

  return {
    headers: {
      Authorization:
        `Bearer ${token}`,
    },
  };
};

export const getLeads =
  async () => {
    return await axios.get(
      API_URL,
      getAuthConfig()
    );
  };

export const getLeadById =
  async (id) => {
    return await axios.get(
      `${API_URL}/${id}`,
      getAuthConfig()
    );
  };

export const createLead =
  async (payload) => {
    return await axios.post(
      API_URL,
      payload,
      getAuthConfig()
    );
  };

export const updateLead =
  async (
    id,
    payload
  ) => {
    return await axios.patch(
      `${API_URL}/${id}`,
      payload,
      getAuthConfig()
    );
  };

export const deleteLead =
  async (id) => {
    return await axios.delete(
      `${API_URL}/${id}`,
      getAuthConfig()
    );
  };

export const updateLeadStage =
  async (
    id,
    status
  ) => {
    return await axios.patch(
      `${API_URL}/${id}/stage`,
      { status },
      getAuthConfig()
    );
  };

export const convertLead =
  async (id) => {
    return await axios.post(
      `${API_URL}/${id}/convert`,
      {},
      getAuthConfig()
    );
  };