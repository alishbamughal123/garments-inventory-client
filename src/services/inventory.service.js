import api from "./api";

/*
|--------------------------------------------------------------------------
| STOCK IN
|--------------------------------------------------------------------------
*/

export const stockIn = async (data) => {
  const response = await api.post(
    "/inventory/stock-in",
    data
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| STOCK OUT
|--------------------------------------------------------------------------
*/

export const stockOut = async (data) => {
  const response = await api.post(
    "/inventory/stock-out",
    data
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| GET TRANSACTIONS
|--------------------------------------------------------------------------
*/

export const getTransactions =
  async (params = {}) => {
    const response =
      await api.get(
        "/inventory/transactions",
        {
          params: typeof params === "object" ? params : { transactionType: params },
        }
      );

    return response.data;
  };