
import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  Link,
} from "react-router-dom";

import toast from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";

import {
  getCustomerById,
} from "../../services/customers.service";

const CustomerDetailsPage =
  () => {
    const { id } =
      useParams();

    const [
      customer,
      setCustomer,
    ] = useState(null);

    const [
      loading,
      setLoading,
    ] = useState(true);

    useEffect(() => {
      fetchCustomer();
    }, []);

    const fetchCustomer =
      async () => {
        try {
          const response =
            await getCustomerById(
              id
            );

          setCustomer(
            response.data
          );
        } catch (error) {
          toast.error(
            "Failed to fetch customer"
          );
        } finally {
          setLoading(false);
        }
      };

    if (loading) {
      return (
        <MainLayout>
          Loading customer...
        </MainLayout>
      );
    }

    if (!customer) {
      return (
        <MainLayout>
          Customer not found
        </MainLayout>
      );
    }

    return (
      <MainLayout>

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            p-8
          "
        >

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

            <div>

              <h1 className="text-3xl font-bold">
                {
                  customer.fullName
                }
              </h1>

              <p className="text-slate-500 mt-2">
                Customer Details
              </p>

            </div>

            <Link
              to={`/customers/edit/${customer.id}`}
              className="
                bg-blue-500
                hover:bg-blue-600
                text-white
                px-5
                py-3
                rounded-xl
                text-center
              "
            >
              Edit Customer
            </Link>

          </div>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-6
            "
          >

            <div
              className="
                border
                border-slate-200
                rounded-xl
                p-5
              "
            >

              <p className="text-slate-500 mb-1">
                Full Name
              </p>

              <h2 className="font-semibold text-lg">
                {
                  customer.fullName
                }
              </h2>

            </div>

            <div
              className="
                border
                border-slate-200
                rounded-xl
                p-5
              "
            >

              <p className="text-slate-500 mb-1">
                Phone Number
              </p>

              <h2 className="font-semibold text-lg">
                {
                  customer.phoneNumber
                }
              </h2>

            </div>

            <div
              className="
                border
                border-slate-200
                rounded-xl
                p-5
              "
            >

              <p className="text-slate-500 mb-1">
                Email
              </p>

              <h2 className="font-semibold text-lg">
                {customer.email ||
                  "N/A"}
              </h2>

            </div>

            <div
              className="
                border
                border-slate-200
                rounded-xl
                p-5
              "
            >

              <p className="text-slate-500 mb-1">
                City
              </p>

              <h2 className="font-semibold text-lg">
                {customer.city ||
                  "N/A"}
              </h2>

            </div>

            <div
              className="
                border
                border-slate-200
                rounded-xl
                p-5
              "
            >

              <p className="text-slate-500 mb-1">
                Customer Type
              </p>

              <h2 className="font-semibold text-lg">
                {
                  customer.customerType
                }
              </h2>

            </div>

            <div
              className="
                border
                border-slate-200
                rounded-xl
                p-5
              "
            >

              <p className="text-slate-500 mb-1">
                Total Orders
              </p>

              <h2 className="font-semibold text-lg">
                {
                  customer.totalOrders
                }
              </h2>

            </div>

            <div
              className="
                border
                border-slate-200
                rounded-xl
                p-5
              "
            >

              <p className="text-slate-500 mb-1">
                Total Spent
              </p>

              <h2 className="font-semibold text-lg">
                Rs.{" "}
                {
                  customer.totalSpent
                }
              </h2>

            </div>

            <div
              className="
                border
                border-slate-200
                rounded-xl
                p-5
              "
            >

              <p className="text-slate-500 mb-1">
                Address
              </p>

              <h2 className="font-semibold text-lg">
                {customer.address ||
                  "N/A"}
              </h2>

            </div>

          </div>

          <div
            className="
              border
              border-slate-200
              rounded-xl
              p-5
              mt-6
            "
          >

            <p className="text-slate-500 mb-2">
              Notes
            </p>

            <p>
              {customer.notes ||
                "No notes available"}
            </p>

          </div>

        </div>

      </MainLayout>
    );
  };

export default CustomerDetailsPage;
