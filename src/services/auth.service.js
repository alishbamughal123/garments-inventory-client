import api from "./api";

export const loginUser =
  async (data) => {
    const response =
      await api.post(
        "/auth/login",
        data
      );

    return response.data;
  };

export const createUser =
  async (data) => {
    const response =
      await api.post(
        "/auth/register",
        data
      );

    return response.data;
  };

export const getMe =
  async () => {
    const response =
      await api.get(
        "/auth/me"
      );

    return response.data;
  };

export const getUsers =
  async () => {
    const response =
      await api.get(
        "/auth/users"
      );

    return response.data;
  };
