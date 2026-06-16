import api, {
  buildQueryParams,
} from "./api";

const tasksEndpoint = "/tasks";

export const getTasks =
  async (filters = {}) => {
    const response =
      await api.get(
        tasksEndpoint,
        {
          params:
            buildQueryParams(
              filters
            ),
        }
      );

    return response.data;
  };

export const getTaskById =
  async (id) => {
    const response =
      await api.get(
        `${tasksEndpoint}/${id}`
      );

    return response.data;
  };

export const createTask =
  async (payload) => {
    const response =
      await api.post(
        tasksEndpoint,
        payload
      );

    return response.data;
  };

export const updateTask =
  async (
    id,
    payload
  ) => {
    const response =
      await api.patch(
        `${tasksEndpoint}/${id}`,
        payload
      );

    return response.data;
  };

export const deleteTask =
  async (id) => {
    const response =
      await api.delete(
        `${tasksEndpoint}/${id}`
      );

    return response.data;
  };

export const assignTask =
  async (
    id,
    payload
  ) => {
    const response =
      await api.post(
        `${tasksEndpoint}/${id}/assign`,
        payload
      );

    return response.data;
  };

export const addReminder =
  async (
    id,
    payload
  ) => {
    const response =
      await api.post(
        `${tasksEndpoint}/${id}/reminder`,
        payload
      );

    return response.data;
  };
