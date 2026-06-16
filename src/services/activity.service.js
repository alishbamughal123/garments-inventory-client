import api, {
  buildQueryParams,
} from "./api";

export const createActivity =
  async (payload) => {
    const response =
      await api.post(
        "/activities",
        payload
      );

    return response.data;
  };

export const getActivities =
  async (filters = {}) => {
    const response =
      await api.get(
        "/activities",
        {
          params:
            buildQueryParams(
              filters
            ),
        }
      );

    return response.data;
  };
