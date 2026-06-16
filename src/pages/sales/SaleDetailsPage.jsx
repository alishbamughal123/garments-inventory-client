import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiPrinter, FiEdit, FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import SurfaceCard from "../../components/ui/SurfaceCard";
import { getSaleById } from "../../services/sales.service";
import { appRoutes } from "../../config/routes";

const SaleDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const response = await getSaleById(id);
        if (isMounted) {
          setSale(response.data);
        }
      } catch {
        toast.error("Failed to fetch sale");
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
        <div className="flex h-[60vh] items-center justify-center">
          <p className="animate-pulse text-slate-500">Loading invoice details...</p>
        </div>
      </MainLayout>
    );
  }

  if (!sale) {
    return (
      <MainLayout>
        <div className="p-10 text-center">
          <h2 className="text-xl font-bold">Sale not found</h2>
          <Button onClick={() => navigate(appRoutes.sales)} className="mt-4">
            Back to Sales
          </Button>
        </div>
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
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => navigate(`/sales/edit/${id}`)}
                variant="secondary"
              >
                <FiPencil />
                Edit Remarks
              </Button>
              <Button
                onClick={() => window.print()}
                variant="secondary"
              >
                <FiPrinter />
                Print
              </Button>
              <Button
                onClick={() => navigate(appRoutes.sales)}
                variant="secondary"
              >
                <FiArrowLeft />
                Back
              </Button>
            </div>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SurfaceCard className="p-6">
            <h2 className="text-xl font-bold mb-5 border-b pb-3">Customer Info</h2>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Customer</p>
                <p className="font-bold text-slate-900">{sale.customer?.fullName || "Walk-in Customer"}</p>
                {sale.customer?.companyName && <p className="text-sm text-slate-500">{sale.customer.companyName}</p>}
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Payment Method</p>
                <p className="font-semibold text-slate-700">{sale.paymentMethod}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sale Date</p>
                <p className="font-medium text-slate-700">{new Date(sale.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <h2 className="text-xl font-bold mb-5 border-b pb-3">Payment Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Subtotal</span>
                <span className="font-bold text-slate-900">Rs. {sale.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Discount</span>
                <span className="font-bold text-emerald-600">- Rs. {sale.discount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Tax</span>
                <span className="font-bold text-slate-900">Rs. {sale.tax}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold pt-4 border-t border-slate-100">
                <span className="text-slate-900">Grand Total</span>
                <span className="text-blue-600">Rs. {sale.grandTotal}</span>
              </div>
            </div>
          </SurfaceCard>
        </div>

        {sale.notes && (
          <SurfaceCard className="p-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Internal Remarks</h2>
            <p className="text-slate-700 leading-relaxed italic">"{sale.notes}"</p>
          </SurfaceCard>
        )}

        <SurfaceCard className="overflow-hidden">
          <div className="p-6 border-b bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-900">Items Ordered</h2>
          </div>

          <div className="grid gap-4 p-4 lg:hidden">
            {sale.saleItems.map((item) => (
              <article key={item.id} className="rounded-2xl border border-slate-200 p-4 bg-white">
                <h3 className="font-bold text-slate-900">{item.product.productName}</h3>
                <p className="text-xs text-slate-500 mb-3">SKU: {item.product.sku}</p>
                <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-slate-400 font-medium">Qty</dt>
                    <dd className="mt-1 font-bold text-slate-700">{item.quantity}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400 font-medium">Unit Price</dt>
                    <dd className="mt-1 font-bold text-slate-700">Rs. {item.price}</dd>
                  </div>
                  <div className="col-span-2 border-t pt-2">
                    <dt className="text-slate-400 font-medium text-xs uppercase">Total</dt>
                    <dd className="mt-1 font-extrabold text-slate-900 text-lg">Rs. {item.total}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/80 text-xs font-bold text-slate-400 uppercase tracking-widest border-b">
                  <th className="p-5 text-left">Product</th>
                  <th className="p-5 text-center">Quantity</th>
                  <th className="p-5 text-right">Unit Price</th>
                  <th className="p-5 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody>
                {sale.saleItems.map((item) => (
                  <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition">
                    <td className="p-5">
                      <div className="font-bold text-slate-900">{item.product.productName}</div>
                      <div className="text-xs text-slate-500">SKU: {item.product.sku}</div>
                    </td>
                    <td className="p-5 text-center font-bold text-slate-700">{item.quantity}</td>
                    <td className="p-5 text-right font-semibold text-slate-600">Rs. {item.price}</td>
                    <td className="p-5 text-right font-extrabold text-slate-900">Rs. {item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SurfaceCard>
      </div>
    </MainLayout>
  );
};

export default SaleDetailsPage;
