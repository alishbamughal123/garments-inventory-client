
import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  FiPrinter,
} from "react-icons/fi";

import toast from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import SurfaceCard from "../../components/ui/SurfaceCard";
import {
  getSaleById,
} from "../../services/sales.service";

const SaleDetailsPage = () => {
  const { id } =
    useParams();
  const [sale, setSale] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const response =
          await getSaleById(id);

        if (isMounted) {
          setSale(
            response.data
          );
        }
      } catch {
        toast.error(
          "Failed to fetch sale"
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        Loading sale...
      </MainLayout>
    );
  }

  if (!sale) {
    return (
      <MainLayout>
        Sale not found
      </MainLayout>
    );
  }

  return (
    <MainLayout>

      <div className="space-y-6">

        <PageHeader
          title="Invoice Details"
          description={sale.invoiceNumber}
          action={
            <Button
            onClick={() =>
              window.print()
            }
            size="lg"
          >
            <FiPrinter />
            Print Invoice
            </Button>
          }
        />

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
          "
        >

          <SurfaceCard className="p-6">

            <h2
              className="
                text-xl
                font-bold
                mb-5
              "
            >
              Customer Info
            </h2>

            <div className="space-y-3">

              <div>

                <p className="text-slate-500">
                  Customer
                </p>

                <p className="font-medium">
                  {sale.customer
                    ?.fullName ||
                    "Walk-in Customer"}
                </p>

              </div>

              <div>

                <p className="text-slate-500">
                  Payment Method
                </p>

                <p className="font-medium">
                  {
                    sale.paymentMethod
                  }
                </p>

              </div>

              <div>

                <p className="text-slate-500">
                  Sale Date
                </p>

                <p className="font-medium">
                  {new Date(
                    sale.createdAt
                  ).toLocaleString()}
                </p>

              </div>

            </div>

          </SurfaceCard>

          <SurfaceCard className="p-6">

            <h2
              className="
                text-xl
                font-bold
                mb-5
              "
            >
              Payment Summary
            </h2>

            <div className="space-y-3">

              <div className="flex justify-between">
                <span>
                  Subtotal
                </span>

                <span>
                  Rs.{" "}
                  {
                    sale.subtotal
                  }
                </span>
              </div>

              <div className="flex justify-between">
                <span>
                  Discount
                </span>

                <span>
                  Rs.{" "}
                  {
                    sale.discount
                  }
                </span>
              </div>

              <div className="flex justify-between">
                <span>
                  Tax
                </span>

                <span>
                  Rs.{" "}
                  {
                    sale.tax
                  }
                </span>
              </div>

              <div
                className="
                  flex
                  justify-between
                  text-2xl
                  font-bold
                  pt-4
                  border-t
                "
              >

                <span>
                  Grand Total
                </span>

                <span>
                  Rs.{" "}
                  {
                    sale.grandTotal
                  }
                </span>

              </div>

            </div>

          </SurfaceCard>

        </div>

        <SurfaceCard className="overflow-hidden">

          <div className="p-6 border-b">

            <h2
              className="
                text-2xl
                font-bold
              "
            >
              Products
            </h2>

          </div>

          <table className="w-full">

            <thead
              className="
                bg-slate-100
              "
            >

              <tr>

                <th className="p-5 text-left">
                  Product
                </th>

                <th className="p-5 text-left">
                  Quantity
                </th>

                <th className="p-5 text-left">
                  Unit Price
                </th>

                <th className="p-5 text-left">
                  Total
                </th>

              </tr>

            </thead>

            <tbody>

              {sale.saleItems.map(
                (item) => (
                  <tr
                    key={item.id}
                    className="
                      border-t
                    "
                  >

                    <td className="p-5">
                      {
                        item.product
                          .productName
                      }
                    </td>

                    <td className="p-5">
                      {
                        item.quantity
                      }
                    </td>

                    <td className="p-5">
                      Rs. {item.price}
                    </td>

                    <td className="p-5">
                     Rs. {item.total}
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </SurfaceCard>

      </div>

    </MainLayout>
  );
};

export default SaleDetailsPage;
