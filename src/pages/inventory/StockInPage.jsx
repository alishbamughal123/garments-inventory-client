import InventoryMovementPage from "../../components/inventory/InventoryMovementPage";
import { stockIn } from "../../services/inventory.service";
import { useLanguage } from "../../context/LanguageContext";

const StockInPage = () => {
  const { isNo } = useLanguage();

  return (
    <InventoryMovementPage
      title={isNo ? "Varemottak (Stock In)" : "Stock In"}
      description={
        isNo
          ? "Registrer innkommende varer og produksjon på lager med strekkodeskanning."
          : "Receive incoming inventory with a clean, reusable workflow and barcode scanning."
      }
      submitLabel={isNo ? "Registrer varemottak" : "Add Stock"}
      loadingLabel={isNo ? "Registrerer..." : "Adding..."}
      successMessage={isNo ? "Varemottak registrert på lager!" : "Stock added successfully"}
      action={stockIn}
    />
  );
};

export default StockInPage;
