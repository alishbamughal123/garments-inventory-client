import { Scanner } from "@yudiel/react-qr-scanner";

const BarcodeScannerModal = ({
  onClose,
  onScan,
}) => {
  return (
    <div
      className="
        fixed
        inset-0
        bg-black/60
        z-50
        flex
        items-center
        justify-center
        p-4
      "
    >

      <div
        className="
          bg-white
          rounded-2xl
          w-full
          max-w-lg
          p-6
        "
      >

        <div className="flex items-center justify-between mb-4">

          <h2 className="text-2xl font-bold">
            Scan Barcode
          </h2>

          <button
            onClick={onClose}
            className="
              text-slate-500
              hover:text-red-500
              text-xl
            "
          >
            ✕
          </button>

        </div>

        <div className="overflow-hidden rounded-xl">

          <Scanner
            onScan={(result) => {
              if (
                result?.[0]
                  ?.rawValue
              ) {
                onScan(
                  result[0]
                    .rawValue
                );
              }
            }}
            onError={(error) => {
              console.log(
                error
              );
            }}
            constraints={{
              facingMode:
                "environment",
            }}
          />

        </div>

        <p className="text-center text-sm text-slate-500 mt-4">
          Point camera toward barcode
        </p>

      </div>

    </div>
  );
};

export default BarcodeScannerModal;