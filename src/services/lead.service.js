import api from "./api";

const leadsEndpoint = "/leads";

export const getLeads =
  async (search = "") => {
    const response =
      await api.get(
        leadsEndpoint,
        {
          params: { search },
        }
      );

    return response.data;
  };

export const getLeadById =
  async (id) => {
    const response =
      await api.get(
        `${leadsEndpoint}/${id}`
      );

    return response.data;
  };

export const createLead =
  async (payload) => {
    const response =
      await api.post(
        leadsEndpoint,
        payload
      );

    return response.data;
  };

export const updateLead =
  async (
    id,
    payload
  ) => {
    const response =
      await api.patch(
        `${leadsEndpoint}/${id}`,
        payload
      );

    return response.data;
  };

export const deleteLead =
  async (id) => {
    const response =
      await api.delete(
        `${leadsEndpoint}/${id}`
      );

    return response.data;
  };

export const updateLeadStage =
  async (
    id,
    status
  ) => {
    const response =
      await api.patch(
        `${leadsEndpoint}/${id}/stage`,
        { status }
      );

    return response.data;
  };

export const convertLead =
  async (id) => {
    const response =
      await api.post(
        `${leadsEndpoint}/${id}/convert`
      );

    return response.data;
  };
