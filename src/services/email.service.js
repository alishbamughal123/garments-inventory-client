import api, {
  buildQueryParams,
} from "./api";

export const sendEmail =
  async (payload) => {
    const response =
      await api.post(
        "/emails",
        payload
      );

    return response.data;
  };

export const getEmails =
  async (filters = {}) => {
    const response =
      await api.get(
        "/emails",
        {
          params:
            buildQueryParams(
              filters
            ),
        }
      );

    return response.data;
  };
