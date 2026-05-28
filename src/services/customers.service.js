import axios from "axios";

const API_URL =
  "http://localhost:8000/api/v1/customers";

const getAuthConfig = () => {
  const token =
    localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getCustomers =
  async (search = "") => {
    return await axios.get(
      `${API_URL}?search=${search}`,
      getAuthConfig()
    );
  };

export const getCustomerById =
  async (id) => {
    return await axios.get(
      `${API_URL}/${id}`,
      getAuthConfig()
    );
  };

export const createCustomer =
  async (data) => {
    return await axios.post(
      API_URL,
      data,
      getAuthConfig()
    );
  };

export const updateCustomer =
  async (id, data) => {
    return await axios.patch(
      `${API_URL}/${id}`,
      data,
      getAuthConfig()
    );
  };

export const deleteCustomer =
  async (id) => {
    return await axios.delete(
      `${API_URL}/${id}`,
      getAuthConfig()
    );
  };