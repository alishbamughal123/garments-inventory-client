
import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";

import {
  createSale,
} from "../../services/sales.service";

import {
  getProducts,
} from "../../services/products.service";

import {
  getCustomers,
} from "../../services/customer.service";

const CreateSalePage = () => {
  const navigate =
    useNavigate();

  const [products, setProducts] =
    useState([]);

  const [customers, setCustomers] =
    useState([]);

  const [cart, setCart] =
    useState([]);

  const [selectedProduct, setSelectedProduct] =
    useState("");

  const [selectedCustomer, setSelectedCustomer] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("CASH");

  const [discount, setDiscount] =
    useState(0);

  const [tax, setTax] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    fetchProducts();

    fetchCustomers();
  }, []);

 const fetchProducts =
  async () => {
    try {
      const response =
        await getProducts();

      console.log(
        "PRODUCTS:",
        response.data
      );

      setProducts(
        Array.isArray(
          response.data
        )
          ? response.data
          : response.data.data ||
              []
      );

    } catch (error) {
      console.log(error);

      toast.error(
        "Failed to fetch products"
      );
    }
  };

 const fetchCustomers =
  async () => {
    try {
      const response =
        await getCustomers();

      console.log(
        "CUSTOMERS:",
        response.data
      );

      setCustomers(
        Array.isArray(
          response.data
        )
          ? response.data
          : response.data.data ||
              []
      );

    } catch (error) {
      console.log(error);

      toast.error(
        "Failed to fetch customers"
      );
    }
  };

  const addToCart = () => {
    if (!selectedProduct) {
      return;
    }

    const product =
      products.find(
        (p) =>
          p.id ===
          selectedProduct
      );

    if (!product) {
      return;
    }

    const existingItem =
      cart.find(
        (item) =>
          item.productId ===
          product.id
      );

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId ===
          product.id
            ? {
                ...item,
                quantity:
                  item.quantity +
                  1,
                totalPrice:
                  (item.quantity +
                    1) *
                  item.unitPrice,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId:
            product.id,

          productName:
            product.productName,

          quantity: 1,

          unitPrice:
            Number(
              product.salePrice
            ),

          totalPrice:
            Number(
              product.salePrice
            ),
        },
      ]);
    }

    setSelectedProduct("");
  };

  const removeFromCart =
    (productId) => {
      setCart(
        cart.filter(
          (item) =>
            item.productId !==
            productId
        )
      );
    };

  const updateQuantity =
    (
      productId,
      quantity
    ) => {
      setCart(
        cart.map((item) => {
          if (
            item.productId ===
            productId
          ) {
            return {
              ...item,

              quantity:
                Number(quantity),

              totalPrice:
                Number(quantity) *
                item.unitPrice,
            };
          }

          return item;
        })
      );
    };

  const subtotal =
    cart.reduce(
      (acc, item) =>
        acc +
        item.totalPrice,
      0
    );

  const grandTotal =
    subtotal -
    Number(discount) +
    Number(tax);

  const handleSubmit =
    async () => {
      if (cart.length === 0) {
        toast.error(
          "Cart is empty"
        );

        return;
      }

      try {
        setLoading(true);

        await createSale({
          customerId:
            selectedCustomer ||
            null,

          subtotal,

          discount:
            Number(discount),

          tax: Number(tax),

          grandTotal,

          paymentMethod,

          items: cart,
        });

        toast.success(
          "Sale created successfully"
        );

        navigate("/sales");
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to create sale"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <MainLayout>

      <div className="space-y-6">

        <h1
          className="
            text-3xl
            font-bold
          "
        >
          Create Sale
        </h1>

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-3
            gap-6
          "
        >

          <div
            className="
              lg:col-span-2
              space-y-6
            "
          >

            <div
              className="
                bg-white
                border
                rounded-2xl
                p-6
              "
            >

              <label className="block mb-2 font-medium">
                Select Customer
              </label>

              <select
                value={
                  selectedCustomer
                }
                onChange={(e) =>
                  setSelectedCustomer(
                    e.target.value
                  )
                }
                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                "
              >

                <option value="">
                  Walk-in Customer
                </option>

                {customers.map(
                  (customer) => (
                    <option
                      key={
                        customer.id
                      }
                      value={
                        customer.id
                      }
                    >
                      {
                        customer.fullName
                      }
                    </option>
                  )
                )}

              </select>

            </div>

            <div
              className="
                bg-white
                border
                rounded-2xl
                p-6
              "
            >

              <div className="flex gap-4">

                <select
                  value={
                    selectedProduct
                  }
                  onChange={(e) =>
                    setSelectedProduct(
                      e.target.value
                    )
                  }
                  className="
                    flex-1
                    border
                    rounded-xl
                    px-4
                    py-3
                  "
                >

                  <option value="">
                    Select Product
                  </option>

                  {products.map(
                    (product) => (
                      <option
                        key={
                          product.id
                        }
                        value={
                          product.id
                        }
                      >
                        {
                          product.productName
                        }
                      </option>
                    )
                  )}

                </select>

                <button
                  onClick={
                    addToCart
                  }
                  className="
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    px-6
                    rounded-xl
                  "
                >
                  Add
                </button>

              </div>

            </div>

            <div
              className="
                bg-white
                border
                rounded-2xl
                overflow-hidden
              "
            >

              <table className="w-full">

                <thead
                  className="
                    bg-slate-100
                  "
                >

                  <tr>

                    <th className="p-4 text-left">
                      Product
                    </th>

                    <th className="p-4 text-left">
                      Qty
                    </th>

                    <th className="p-4 text-left">
                      Price
                    </th>

                    <th className="p-4 text-left">
                      Total
                    </th>

                    <th className="p-4 text-left">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {cart.map(
                    (item) => (
                      <tr
                        key={
                          item.productId
                        }
                        className="
                          border-t
                        "
                      >

                        <td className="p-4">
                          {
                            item.productName
                          }
                        </td>

                        <td className="p-4">

                          <input
                            type="number"
                            min="1"
                            value={
                              item.quantity
                            }
                            onChange={(e) =>
                              updateQuantity(
                                item.productId,
                                e.target
                                  .value
                              )
                            }
                            className="
                              w-20
                              border
                              rounded-lg
                              px-3
                              py-2
                            "
                          />

                        </td>

                        <td className="p-4">
                          Rs.{" "}
                          {
                            item.unitPrice
                          }
                        </td>

                        <td className="p-4">
                          Rs.{" "}
                          {
                            item.totalPrice
                          }
                        </td>

                        <td className="p-4">

                          <button
                            onClick={() =>
                              removeFromCart(
                                item.productId
                              )
                            }
                            className="
                              text-red-600
                            "
                          >
                            Remove
                          </button>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

          <div
            className="
              bg-white
              border
              rounded-2xl
              p-6
              h-fit
              space-y-5
            "
          >

            <h2
              className="
                text-2xl
                font-bold
              "
            >
              Order Summary
            </h2>

            <div className="flex justify-between">
              <span>
                Subtotal
              </span>

              <span>
                Rs. {subtotal}
              </span>
            </div>

            <div>

              <label className="block mb-2">
                Discount
              </label>

              <input
                type="number"
                value={discount}
                onChange={(e) =>
                  setDiscount(
                    e.target.value
                  )
                }
                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                "
              />

            </div>

            <div>

              <label className="block mb-2">
                Tax
              </label>

              <input
                type="number"
                value={tax}
                onChange={(e) =>
                  setTax(
                    e.target.value
                  )
                }
                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                "
              />

            </div>

            <div>

              <label className="block mb-2">
                Payment Method
              </label>

              <select
                value={
                  paymentMethod
                }
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                "
              >

                <option value="CASH">
                  Cash
                </option>

                <option value="CARD">
                  Card
                </option>

                <option value="BANK_TRANSFER">
                  Bank Transfer
                </option>

                <option value="JAZZCASH">
                  JazzCash
                </option>

                <option value="EASYPAISA">
                  EasyPaisa
                </option>

              </select>

            </div>

            <div
              className="
                flex
                justify-between
                text-2xl
                font-bold
              "
            >

              <span>
                Grand Total
              </span>

              <span>
                Rs. {grandTotal}
              </span>

            </div>

            <button
              onClick={
                handleSubmit
              }
              disabled={loading}
              className="
                w-full
                bg-green-600
                hover:bg-green-700
                text-white
                py-4
                rounded-xl
                font-semibold
              "
            >
              {loading
                ? "Processing..."
                : "Complete Sale"}
            </button>

          </div>

        </div>

      </div>

    </MainLayout>
  );
};

export default CreateSalePage;
