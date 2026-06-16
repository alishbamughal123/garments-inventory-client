import api, {
  buildQueryParams,
} from "./api";

const reportsEndpoint = "/reports";

export const getCrmOverview = async (
  filters = {}
) => {
  const response = await api.get(
    `${reportsEndpoint}/crm-overview`,
    {
      params: buildQueryParams(filters),
    }
  );

  return response.data;
};

export const getLeadAnalytics =
  async (filters = {}) => {
    const response = await api.get(
      `${reportsEndpoint}/lead-analytics`,
      {
        params:
          buildQueryParams(filters),
      }
    );

    return response.data;
  };

export const getCustomerAnalytics =
  async (filters = {}) => {
    const response = await api.get(
      `${reportsEndpoint}/customer-analytics`,
      {
        params:
          buildQueryParams(filters),
      }
    );

    return response.data;
  };

export const getRevenueAnalytics =
  async (filters = {}) => {
    const response = await api.get(
      `${reportsEndpoint}/revenue-analytics`,
      {
        params:
          buildQueryParams(filters),
      }
    );

    return response.data;
  };

export const getSalesAnalytics =
  async (filters = {}) => {
    const response = await api.get(
      `${reportsEndpoint}/sales-analytics`,
      {
        params:
          buildQueryParams(filters),
      }
    );

    return response.data;
  };
