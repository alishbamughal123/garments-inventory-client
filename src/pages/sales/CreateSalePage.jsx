import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import SurfaceCard from "../../components/ui/SurfaceCard";
import { formControlClass, formLabelClass } from "../../components/ui/formStyles";
import { createSale } from "../../services/sales.service";
import { getProducts } from "../../services/products.service";
import { getCustomers } from "../../services/customer.service";
import { useLanguage } from "../../context/LanguageContext";
import logo from "../../assets/logo.png";
import {
  ShoppingCart,
  Search,
  ScanLine,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  Printer,
  User,
  CreditCard,
  Tag,
  DollarSign
} from "lucide-react";
import BarcodeScannerModal from "../../components/common/BarcodeScannerModal";

const CreateSalePage = () => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cart, setCart] = useState([]);

  const [productSearch, setProductSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  // Completed Invoice Modal State
  const [completedInvoice, setCompletedInvoice] = useState(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [prodRes, custRes] = await Promise.all([
          getProducts(),
          getCustomers(),
        ]);

        if (!isMounted) return;

        setProducts(
          Array.isArray(prodRes.data)
            ? prodRes.data
            : prodRes.data?.data || []
        );

        setCustomers(
          Array.isArray(custRes.data)
            ? custRes.data
            : custRes.data?.data || []
        );
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch sale setup data");
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter products by search term or SKU barcode
  const filteredProducts = products.filter((p) => {
    if (!productSearch) return true;
    const query = productSearch.toLowerCase();
    return (
      p.productName?.toLowerCase().includes(query) ||
      p.sku?.toLowerCase().includes(query) ||
      p.styleNumber?.toLowerCase().includes(query) ||
      p.color?.toLowerCase().includes(query)
    );
  });

  const handleAddProductToCart = (product) => {
    if (!product) return;

    if (product.stockQuantity <= 0) {
      toast.error(`Out of stock: ${product.productName}`);
      return;
    }

    const existingIndex = cart.findIndex((i) => i.productId === product.id);

    if (existingIndex > -1) {
      const existingItem = cart[existingIndex];
      if (existingItem.quantity >= product.stockQuantity) {
        toast.error(`Stock limit reached (${product.stockQuantity})`);
        return;
      }

      const updated = [...cart];
      updated[existingIndex] = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
        totalPrice: (existingItem.quantity + 1) * existingItem.unitPrice,
      };
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          productName: product.productName,
          sku: product.sku,
          color: product.color,
          size: product.size || "OS",
          quantity: 1,
          unitPrice: Number(product.salePrice),
          totalPrice: Number(product.salePrice),
          stockQuantity: product.stockQuantity,
        },
      ]);
    }

    setProductSearch("");
    toast.success(`Added ${product.productName} to cart`);
  };

  // Handle scanned barcode input
  const handleBarcodeScan = (scannedCode) => {
    const matched = products.find(
      (p) =>
        p.sku?.toLowerCase() === scannedCode.toLowerCase() ||
        p.styleNumber?.toLowerCase() === scannedCode.toLowerCase()
    );

    if (matched) {
      handleAddProductToCart(matched);
      setShowScanner(false);
    } else {
      toast.error(`No product found for barcode: ${scannedCode}`);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    const qty = Math.max(1, parseInt(newQuantity) || 1);
    setCart(
      cart.map((item) => {
        if (item.productId === productId) {
          if (qty > item.stockQuantity) {
            toast.error(`Max stock available: ${item.stockQuantity}`);
            return item;
          }
          return {
            ...item,
            quantity: qty,
            totalPrice: qty * item.unitPrice,
          };
        }
        return item;
      })
    );
  };

  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const grandTotal = Math.max(0, subtotal - Number(discount) + Number(tax));

  const handleSubmit = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    try {
      setLoading(true);

      const customerObj = customers.find((c) => c.id === selectedCustomer);

      const payload = {
        customerId: selectedCustomer || null,
        subtotal,
        discount: Number(discount),
        tax: Number(tax),
        grandTotal,
        paymentMethod,
        items: cart,
      };

      const res = await createSale(payload);
      const invoiceData = res.data || {
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        customer: customerObj,
        items: cart,
        subtotal,
        discount: Number(discount),
        tax: Number(tax),
        grandTotal,
        paymentMethod,
        createdAt: new Date().toISOString(),
      };

      toast.success("Sale completed successfully!");

      // Show Invoice PDF Modal
      setCompletedInvoice(invoiceData);
      setCart([]);
      setSelectedCustomer("");
      setDiscount(0);
      setTax(0);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to create sale"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="POS & Sales Counter"
          description="Process in-store sales, select customer, scan barcodes, and generate instant receipt invoices."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT 2 COLUMNS: CUSTOMER, PRODUCT SEARCH & CART TABLE */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Customer Selection & Barcode Scanner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SurfaceCard className="p-4 sm:p-5 flex flex-col justify-between space-y-2">
                <label className={formLabelClass}>
                  <User size={15} className="inline mr-1 text-teal-600" />
                  Select Customer
                </label>
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className={formControlClass}
                >
                  <option value="">Walk-in Customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.companyName
                        ? `${customer.companyName} (${customer.fullName})`
                        : customer.fullName}
                    </option>
                  ))}
                </select>
              </SurfaceCard>

              <SurfaceCard className="p-4 sm:p-5 flex flex-col justify-between space-y-2">
                <label className={formLabelClass}>
                  <ScanLine size={15} className="inline mr-1 text-teal-600" />
                  Barcode Camera Scanner
                </label>
                <Button
                  onClick={() => setShowScanner(true)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded-xl shadow-sm"
                >
                  <ScanLine size={16} />
                  <span>Scan Garment Tag Barcode</span>
                </Button>
              </SurfaceCard>
            </div>

            {/* Live Product Search & Direct Selection */}
            <SurfaceCard className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search product by name, SKU barcode or style..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-900 outline-none focus:border-teal-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Product Match List */}
              {productSearch && (
                <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-2xl divide-y divide-slate-100 bg-white shadow-lg">
                  {filteredProducts.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">No matching products found</div>
                  ) : (
                    filteredProducts.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => handleAddProductToCart(prod)}
                        className="p-3 flex items-center justify-between hover:bg-teal-50 cursor-pointer transition text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-900 block">{prod.productName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">SKU: {prod.sku} • Stock: {prod.stockQuantity}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-emerald-600 text-sm">NOK {Number(prod.salePrice).toLocaleString()}</span>
                          <span className="block text-[10px] font-bold text-teal-600">+ Add to Cart</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </SurfaceCard>

            {/* Cart Items Table */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm overflow-hidden space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingCart size={18} className="text-teal-600" />
                  <span>Cart Items</span>
                </h3>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {cart.length} Articles
                </span>
              </div>

              {cart.length === 0 ? (
                <div className="p-10 text-center text-xs font-semibold text-slate-400">
                  No items in cart yet. Select a product or scan a barcode above.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                      <tr>
                        <th className="p-3">Article Product</th>
                        <th className="p-3 text-center">Quantity</th>
                        <th className="p-3 text-right">Unit Price</th>
                        <th className="p-3 text-right">Total</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {cart.map((item) => (
                        <tr key={item.productId} className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-slate-900">
                            {item.productName}
                            <span className="block text-[10px] text-slate-400 font-mono font-medium">
                              {item.sku} ({item.color} / {item.size})
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="p-1 text-slate-500 hover:bg-slate-200 rounded-lg"
                              >
                                <Minus size={13} />
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.productId, e.target.value)}
                                className="w-14 bg-slate-50 border border-slate-200 rounded-lg p-1 text-center font-bold text-slate-900 outline-none"
                              />
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="p-1 text-slate-500 hover:bg-slate-200 rounded-lg"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                          </td>
                          <td className="p-3 text-right text-slate-600 font-semibold">
                            NOK {item.unitPrice.toLocaleString()}
                          </td>
                          <td className="p-3 text-right font-black text-emerald-600">
                            NOK {item.totalPrice.toLocaleString()}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="text-red-500 hover:text-red-700 transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY & PAYMENT */}
          <SurfaceCard className="h-fit space-y-5 p-6 shadow-md border border-slate-200">
            <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3">
              Order Summary
            </h2>

            <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono text-sm font-bold text-slate-900">
                NOK {subtotal.toLocaleString()}
              </span>
            </div>

            <div>
              <label className={formLabelClass}>Discount (NOK)</label>
              <input
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className={formControlClass}
              />
            </div>

            <div>
              <label className={formLabelClass}>Tax / MVA (NOK)</label>
              <input
                type="number"
                min="0"
                value={tax}
                onChange={(e) => setTax(e.target.value)}
                className={formControlClass}
              />
            </div>

            <div>
              <label className={formLabelClass}>Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className={formControlClass}
              >
                <option value="CASH">Cash</option>
                <option value="CARD">Card / POS Terminal</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="INVOICE">Corporate B2B Invoice</option>
              </select>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-700">Grand Total</span>
              <span className="text-2xl font-black text-emerald-600 font-mono">
                NOK {grandTotal.toLocaleString()}
              </span>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading || cart.length === 0}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md transition disabled:opacity-50"
              size="lg"
            >
              {loading ? "Processing..." : "Complete Sale & Print Receipt"}
            </Button>
          </SurfaceCard>

        </div>

        {/* BARCODE CAMERA SCANNER MODAL */}
        {showScanner && (
          <BarcodeScannerModal
            onScan={handleBarcodeScan}
            onClose={() => setShowScanner(false)}
          />
        )}

        {/* COMPLETED INVOICE RECEIPT MODAL */}
        {completedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
            <div className="bg-white text-slate-900 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto font-sans">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                  <CheckCircle size={20} />
                  <span>Sales Receipt Invoice Ready</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 bg-teal-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-teal-700 transition"
                  >
                    <Printer size={15} />
                    <span>Print Receipt</span>
                  </button>
                  <button
                    onClick={() => setCompletedInvoice(null)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Printable Receipt */}
              <div className="p-6 border border-slate-200 rounded-xl space-y-5 bg-white print:border-none print:p-0">
                <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <img src={logo} alt="Logo" className="h-7 w-7 object-contain" />
                      <span className="text-base font-black tracking-tight uppercase text-slate-900">Nordic Prowear AS</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Oslo, Norway • POS Counter</p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-lg font-black text-teal-700 uppercase tracking-tight">Sales Receipt</h2>
                    <p className="text-xs font-mono font-bold text-slate-800">{completedInvoice.invoiceNumber || "INV-2026-0001"}</p>
                    <p className="text-[11px] text-slate-500">Date: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                {completedInvoice.customer && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">CUSTOMER:</span>
                    <p className="font-bold text-slate-900">{completedInvoice.customer.companyName || completedInvoice.customer.fullName}</p>
                  </div>
                )}

                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-2 text-left">Item</th>
                      <th className="p-2 text-center">Qty</th>
                      <th className="p-2 text-right">Price</th>
                      <th className="p-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {completedInvoice.items?.map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-semibold text-slate-900">{it.productName}</td>
                        <td className="p-2 text-center font-bold">{it.quantity}</td>
                        <td className="p-2 text-right">NOK {Number(it.unitPrice).toLocaleString()}</td>
                        <td className="p-2 text-right font-bold">NOK {Number(it.totalPrice).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="pt-3 border-t border-slate-200 text-right text-xs space-y-1">
                  <p className="text-slate-500">Subtotal: <span className="font-mono font-bold text-slate-900">NOK {Number(completedInvoice.subtotal || subtotal).toLocaleString()}</span></p>
                  {Number(completedInvoice.discount) > 0 && <p className="text-slate-500">Discount: <span className="font-mono font-bold text-red-600">- NOK {Number(completedInvoice.discount).toLocaleString()}</span></p>}
                  {Number(completedInvoice.tax) > 0 && <p className="text-slate-500">Tax: <span className="font-mono font-bold text-slate-900">+ NOK {Number(completedInvoice.tax).toLocaleString()}</span></p>}
                  <p className="text-base font-black text-slate-900 pt-2 border-t border-slate-100">Total: <span className="font-mono text-teal-700">NOK {Number(completedInvoice.grandTotal || grandTotal).toLocaleString()}</span></p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CreateSalePage;
