
import api from "./api";

/*
|--------------------------------------------------------------------------
| CUSTOMERS
|--------------------------------------------------------------------------
*/

export const getCustomers = async (
  search = "",
  customerType = "",
  status = ""
) => {
  const response = await api.get(
    `/customers?search=${search}&customerType=${customerType}&status=${status}`
  );

  return response.data;
};

export const getCustomerById =
  async (id) => {
    const response =
      await api.get(
        `/customers/${id}`
      );

    return response.data;
  };

export const createCustomer =
  async (payload) => {
    const response =
      await api.post(
        "/customers",
        payload
      );

    return response.data;
  };

export const updateCustomer =
  async (id, payload) => {
    const response =
      await api.patch(
        `/customers/${id}`,
        payload
      );

    return response.data;
  };

export const deleteCustomer =
  async (id) => {
    const response =
      await api.delete(
        `/customers/${id}`
      );

    return response.data;
  };

/*
|--------------------------------------------------------------------------
| INTERACTIONS
|--------------------------------------------------------------------------
*/

export const getInteractions =
  async (customerId) => {
    const response =
      await api.get(
        `/customers/${customerId}/interactions`
      );

    return response.data;
  };

export const addInteraction =
  async (
    customerId,
    payload
  ) => {
    const response =
      await api.post(
        `/customers/${customerId}/interactions`,
        payload
      );

    return response.data;
  };
