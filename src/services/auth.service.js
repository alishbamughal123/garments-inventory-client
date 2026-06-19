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

export const updateProfile =
  async (data) => {
    const response =
      await api.put(
        "/auth/profile",
        data
      );

    return response.data;
  };

export const updateUser =
  async (id, data) => {
    const response =
      await api.put(
        `/auth/users/${id}`,
        data
      );

    return response.data;
  };

export const deleteUser =
  async (id) => {
    const response =
      await api.delete(
        `/auth/users/${id}`
      );

    return response.data;
  };
