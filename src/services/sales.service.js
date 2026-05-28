
import axios from "axios";

const API_URL =
  "http://localhost:8000/api/v1/sales";

const getAuthConfig = () => {
  const token =
    localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/*
|--------------------------------------------------------------------------
| CREATE SALE
|--------------------------------------------------------------------------
*/

export const createSale =
  async (payload) => {
    return await axios.post(
      API_URL,
      payload,
      getAuthConfig()
    );
  };

/*
|--------------------------------------------------------------------------
| GET ALL SALES
|--------------------------------------------------------------------------
*/

export const getSales =
  async () => {
    return await axios.get(
      API_URL,
      getAuthConfig()
    );
  };

/*
|--------------------------------------------------------------------------
| GET SINGLE SALE
|--------------------------------------------------------------------------
*/

export const getSaleById =
  async (id) => {
    return await axios.get(
      `${API_URL}/${id}`,
      getAuthConfig()
    );
  };