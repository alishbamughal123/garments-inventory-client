import InventoryMovementPage from "../../components/inventory/InventoryMovementPage";
import { stockIn } from "../../services/inventory.service";

const StockInPage = () => {
  return (
    <InventoryMovementPage
      title="Stock In"
      description="Receive incoming inventory with a clean, reusable workflow and consistent form styling."
      submitLabel="Add Stock"
      loadingLabel="Adding..."
      successMessage="Stock added successfully"
      action={stockIn}
    />
  );
};

export default StockInPage;
