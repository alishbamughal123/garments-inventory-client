import api, { buildQueryParams } from "./api";

/*
|--------------------------------------------------------------------------
| CUSTOMERS SERVICE
|--------------------------------------------------------------------------
*/

export const getCustomers = async (
  search = "",
  customerType = "",
  status = ""
) => {
  const response = await api.get(
    "/customers",
    {
      params: buildQueryParams({
        search,
        customerType,
        status,
      }),
    }
  );

  return response.data;
};

export const getCustomerById = async (id) => {
  const response = await api.get(`/customers/${id}`);
  return response.data;
};

export const createCustomer = async (payload) => {
  const response = await api.post("/customers", payload);
  return response.data;
};

export const updateCustomer = async (id, payload) => {
  const response = await api.patch(`/customers/${id}`, payload);
  return response.data;
};

export const deleteCustomer = async (id) => {
  const response = await api.delete(`/customers/${id}`);
  return response.data;
};

/*
|--------------------------------------------------------------------------
| CONTACTS
|--------------------------------------------------------------------------
*/
export const addContact = async (id, payload) => {
  const response = await api.post(`/customers/${id}/contacts`, payload);
  return response.data;
};

export const deleteContact = async (id, contactId) => {
  const response = await api.delete(`/customers/${id}/contacts/${contactId}`);
  return response.data;
};

/*
|--------------------------------------------------------------------------
| CUSTOM PRICING & CATALOG ACCESS
|--------------------------------------------------------------------------
*/
export const setCustomPricing = async (id, prices) => {
  const response = await api.post(`/customers/${id}/pricing`, { prices });
  return response.data;
};

export const setProductAccess = async (id, accessList) => {
  const response = await api.post(`/customers/${id}/product-access`, { accessList });
  return response.data;
};

export const setPortalAccess = async (id, password, isPortalActive = true) => {
  const response = await api.post(`/customers/${id}/portal-access`, { password, isPortalActive });
  return response.data;
};

/*
|--------------------------------------------------------------------------
| GDPR COMPLIANCE
|--------------------------------------------------------------------------
*/
export const exportGDPRData = async (id) => {
  const response = await api.get(`/customers/${id}/gdpr-export`);
  return response.data;
};

export const anonymizeGDPRData = async (id) => {
  const response = await api.post(`/customers/${id}/gdpr-anonymize`);
  return response.data;
};

/*
|--------------------------------------------------------------------------
| INTERACTIONS
|--------------------------------------------------------------------------
*/
export const getInteractions = async (customerId) => {
  const response = await api.get(`/customers/${customerId}/interactions`);
  return response.data;
};

export const addInteraction = async (customerId, payload) => {
  const response = await api.post(`/customers/${customerId}/interactions`, payload);
  return response.data;
};
