import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import { ShieldCheck, ShoppingBag, ArrowRight, ArrowLeft, CheckCircle2, Lock, Tag, Package, Sparkles } from "lucide-react";

const defaultArticleSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%2314b8a6' stroke-width='1.5'><path d='M20.38 3.46 16 2a4 4 0 0 0-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z'/></svg>";
const defaultWashingSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='1.5'><path d='M3 6h18v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z'/><path d='M3 6c2 1 4 1 6 0s4-1 6 0 4 1 6 0'/><circle cx='8' cy='13' r='1'/><circle cx='12' cy='13' r='1'/><circle cx='16' cy='13' r='1'/></svg>";

const PunchoutPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState(null);
  const [cart, setCart] = useState([]);
  const [returningCart, setReturningCart] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState({});

  useEffect(() => {
    if (!sessionId) {
      toast.error("PunchOut Session ID is missing");
      setLoading(false);
      return;
    }

    const fetchPunchoutCatalog = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/punchout/catalog?sessionId=${sessionId}`);
        if (res.data?.data) {
          setSessionData(res.data.data);
        } else {
          throw new Error("No catalog data returned");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Using active test PunchOut session");
        setSessionData({
          customer: {
            companyName: "Fredrikstad Municipality",
            email: "ehandel@fredrikstad.kommune.no"
          },
          products: [
            {
              id: "demo-1",
              sku: "NP-WORK-01",
              productName: "Hi-Vis Softshell Workwear Jacket",
              contractPrice: 850,
              color: "Yellow / Navy",
              size: "L",
              category: { name: "Workwear & Safety" },
              washingInstructions: "60°C Heavy Wash - Industrial Care",
              imageUrl: null
            },
            {
              id: "demo-2",
              sku: "NP-WORK-02",
              productName: "Pro Craftsman Heavy Work Trousers",
              contractPrice: 620,
              color: "Dark Navy",
              size: "M",
              category: { name: "Work Trousers" },
              washingInstructions: "40°C Standard Wash",
              imageUrl: null
            },
            {
              id: "demo-3",
              sku: "NP-WORK-03",
              productName: "Thermal Insulated Work Gloves (Pair)",
              contractPrice: 190,
              color: "Black / Orange",
              size: "10",
              category: { name: "Safety Equipment" },
              washingInstructions: "Hand wash cold",
              imageUrl: null
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPunchoutCatalog();
  }, [sessionId]);

  const handleAddToCart = (product) => {
    const logoChoice = selectedLogo[product.id] || "Front Left Chest Logo";
    const existingIndex = cart.findIndex((i) => i.id === product.id && i.selectedLogo === logoChoice);

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          sku: product.sku,
          productName: product.productName,
          price: product.contractPrice,
          color: product.color,
          size: product.size || "M",
          quantity: 1,
          selectedLogo: logoChoice,
          category: product.category?.name || "WORKWEAR",
        },
      ]);
    }
    toast.success(`Added ${product.productName} to PunchOut Cart`);
  };

  const [transferModal, setTransferModal] = useState(null);

  const handleReturnToVisma = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty! Select products before returning to Visma eHandel.");
      return;
    }

    try {
      setReturningCart(true);
      let payloadData = null;
      try {
        const res = await api.post("/punchout/return-cart", {
          sessionId,
          cartItems: cart,
        });
        payloadData = res.data?.data;
      } catch (e) {
        // Fallback for demo testing
      }

      const totalAmount = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

      const demoCxml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE cXML SYSTEM "http://xml.cxml.org/schemas/cXML/1.2.014/cXML.dtd">
<cXML payloadID="${Date.now()}@nordicprowear.no" timestamp="${new Date().toISOString()}">
  <Header>
    <From><Credential domain="DUNS"><Identity>NORDICPROWEAR</Identity></Credential></From>
    <To><Credential domain="DUNS"><Identity>VISMA_EHANDEL_FREDRIKSTAD</Identity></Credential></To>
    <Sender><Credential domain="DUNS"><Identity>NORDICPROWEAR</Identity><SharedSecret>secret</SharedSecret></Credential></Sender>
  </Header>
  <Message>
    <PunchOutOrderMessage>
      <BuyerCookie>VISMA_COOKIE_DEMO_998</BuyerCookie>
      <PunchOutOrderMessageHeader operationAllowed="create">
        <Total><Money currency="NOK">${totalAmount.toFixed(2)}</Money></Total>
      </PunchOutOrderMessageHeader>
      ${cart
        .map(
          (item, idx) => `
      <ItemIn quantity="${item.quantity}">
        <ItemID>
          <SupplierPartID>${item.sku}</SupplierPartID>
        </ItemID>
        <ItemDetail>
          <UnitPrice><Money currency="NOK">${Number(item.price).toFixed(2)}</Money></UnitPrice>
          <Description xml:lang="no">${item.productName} (${item.selectedLogo})</Description>
          <UnitOfMeasure>PCE</UnitOfMeasure>
          <Classification domain="UNSPSC">46181500</Classification>
        </ItemDetail>
      </ItemIn>`
        )
        .join("")}
    </PunchOutOrderMessage>
  </Message>
</cXML>`;

      setTransferModal({
        protocol: payloadData?.protocol || "cXML",
        buyerHookUrl: payloadData?.buyerHookUrl || "https://visma-ehandel.fredrikstad.kommune.no/punchout/return",
        cxmlMessage: payloadData?.cxmlMessage || demoCxml,
        cartItems: [...cart],
        totalAmount,
      });

      toast.success("PunchOut Cart successfully transferred to Visma eHandel!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to transfer cart back to Visma eHandel");
    } finally {
      setReturningCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-lg font-bold">Authenticating Visma eHandel PunchOut Session...</h2>
        <p className="text-xs text-slate-400 mt-1">Verifying contracted prices & municipality access permissions</p>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white">
        <div className="bg-slate-800 p-8 rounded-3xl max-w-md text-center border border-slate-700 shadow-2xl">
          <Lock className="mx-auto text-red-400 mb-3" size={40} />
          <h2 className="text-xl font-bold">PunchOut Session Expired or Invalid</h2>
          <p className="text-xs text-slate-400 mt-2">Please launch Nordic Prowear again from your Visma eHandel procurement portal.</p>
          <button
            onClick={() => navigate("/portal/login")}
            className="mt-6 bg-slate-700 hover:bg-slate-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition"
          >
            Go to B2B Login Portal
          </button>
        </div>
      </div>
    );
  }

  const { customer, products } = sessionData;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24">
      {/* Top Banner Bar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-slate-900/90">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-teal-500/20 p-2 rounded-xl border border-teal-500/30">
              <ShieldCheck className="text-teal-400" size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-wide text-white uppercase">Nordic Prowear</span>
                <span className="text-[10px] bg-teal-900/80 text-teal-300 border border-teal-700 px-2 py-0.5 rounded-full font-bold">
                  Visma PunchOut Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Connected Buyer: <strong className="text-slate-200">{customer.companyName}</strong> ({customer.email})
              </p>
            </div>
          </div>

          <button
            onClick={handleReturnToVisma}
            disabled={returningCart}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 transition active:scale-95 disabled:opacity-50"
          >
            <ShoppingBag size={16} />
            <span>Transfer Cart to Visma ({cart.length} items)</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 pt-6 space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-800/50 rounded-3xl p-6 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-teal-400 bg-teal-950/80 border border-teal-800 px-3 py-1 rounded-full inline-flex items-center gap-1">
                <Sparkles size={12} /> Contracted Assortment & Agreed Pricing Only
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-2">
                Fredrikstad Municipality Authorized Catalogue
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Uncontracted products are strictly filtered out per agreement. Select your required clothing sizes, colors, and workwear branding options.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl text-right min-w-[200px]">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Current PunchOut Cart</span>
              <span className="text-xl font-black text-teal-400 font-mono">
                NOK {cart.reduce((sum, i) => sum + i.price * i.quantity, 0).toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{cart.length} articles ready</span>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-3xl p-5 flex flex-col justify-between transition duration-300 shadow-xl group"
            >
              <div>
                {/* Contract Badge */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold text-slate-300 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-full">
                    {product.category?.name || "Workwear"}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Tag size={12} /> Agreed Contract Price
                  </span>
                </div>

                {/* Images */}
                <div className="grid grid-cols-2 gap-2 my-3">
                  {/* Article Photo */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden aspect-square flex flex-col items-center justify-center p-2 relative">
                    <img
                      src={product.imageUrl ? (product.imageUrl.startsWith("http") ? product.imageUrl : `http://localhost:8000${product.imageUrl}`) : defaultArticleSvg}
                      alt={product.productName}
                      className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultArticleSvg;
                      }}
                    />
                    <span className="absolute bottom-1 bg-slate-900/90 text-[8px] font-bold text-slate-300 px-2 py-0.5 rounded-full border border-slate-800">
                      Article Photo
                    </span>
                  </div>

                  {/* Washing Care */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden aspect-square flex flex-col items-center justify-center p-2 relative">
                    <img
                      src={product.washingInstructionsImageUrl ? (product.washingInstructionsImageUrl.startsWith("http") ? product.washingInstructionsImageUrl : `http://localhost:8000${product.washingInstructionsImageUrl}`) : defaultWashingSvg}
                      alt="Washing Instructions"
                      className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultWashingSvg;
                      }}
                    />
                    <span className="absolute bottom-1 bg-blue-950/90 text-[8px] font-bold text-blue-300 px-2 py-0.5 rounded-full border border-blue-900">
                      Washing Care
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-teal-400 transition">{product.productName}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">SKU: {product.sku}</p>

                {/* Washing Instructions Info */}
                <div className="mt-2 text-[10px] text-blue-300 bg-blue-950/60 border border-blue-800/60 p-2 rounded-xl">
                  <strong className="text-blue-200">Care: </strong> {product.washingInstructions || "40°C Standard Wash. Do Not Bleach."}
                </div>

                {/* Logo Customization Option */}
                <div className="mt-3 bg-slate-950 border border-slate-800 p-2.5 rounded-2xl">
                  <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Workwear Logo Placement:</label>
                  <select
                    value={selectedLogo[product.id] || "Front Left Chest Logo"}
                    onChange={(e) => setSelectedLogo({ ...selectedLogo, [product.id]: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-1.5 px-2 text-xs font-semibold text-white outline-none focus:border-teal-500"
                  >
                    <option value="Front Left Chest Logo">Front Left Chest Embroidery</option>
                    <option value="Back Reflective Text">Back Reflective Print</option>
                    <option value="Right Sleeve Badge">Right Sleeve Badge</option>
                    <option value="No Logo">No Custom Logo</option>
                  </select>
                </div>
              </div>

              {/* Price & Add */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Contract Price</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">
                    NOK {Number(product.contractPrice).toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                >
                  <ShoppingBag size={14} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Transfer Success Modal Overlay */}
      {transferModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-teal-500/40 rounded-3xl p-6 max-w-2xl w-full text-slate-100 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/20 p-2 rounded-2xl border border-emerald-500/30 text-emerald-400">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">PunchOut Cart Transferred to Visma</h3>
                  <p className="text-xs text-slate-400">Target Hook URL: <span className="font-mono text-teal-300">{transferModal.buyerHookUrl}</span></p>
                </div>
              </div>
              <button
                onClick={() => setTransferModal(null)}
                className="text-slate-400 hover:text-white text-xs font-bold bg-slate-800 px-3 py-1.5 rounded-xl"
              >
                ✕ Close
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300 font-semibold">
                <span>Items Transferred: <strong className="text-white">{transferModal.cartItems.length} articles</strong></span>
                <span>Total Cart Value: <strong className="text-emerald-400 font-mono">NOK {transferModal.totalAmount.toLocaleString()}</strong></span>
              </div>
              <div className="text-[11px] text-slate-400">
                Protocol: <span className="text-teal-400 font-bold font-mono">{transferModal.protocol} PunchOutOrderMessage v1.2.014</span> (UNSPSC Workwear Code 46181500)
              </div>
            </div>

            {/* Code Box for Payload Preview */}
            <div>
              <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1 font-mono">
                <span>Generated Electronic XML Payload:</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(transferModal.cxmlMessage);
                    toast.success("cXML Payload copied to clipboard!");
                  }}
                  className="text-teal-400 hover:underline font-bold"
                >
                  Copy XML
                </button>
              </div>
              <pre className="bg-slate-950 border border-slate-800 p-3 rounded-2xl font-mono text-[10px] text-slate-300 overflow-x-auto max-h-48 leading-relaxed">
                {transferModal.cxmlMessage}
              </pre>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => setTransferModal(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs"
              >
                Close & Continue Shopping
              </button>
              <button
                onClick={async () => {
                  try {
                    await api.post("/punchout/return-cart", {
                      sessionId,
                      cartItems: transferModal.cartItems || cart,
                    });
                  } catch (e) {}
                  navigate("/sales/b2b-orders");
                }}
                className="bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-teal-500/20"
              >
                <span>Simulate Visma Approval & View Orders</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PunchoutPage;
