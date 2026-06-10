import InventoryMovementPage from "../../components/inventory/InventoryMovementPage";
import { stockOut } from "../../services/inventory.service";

const StockOutPage = () => {
  return (
    <InventoryMovementPage
      title="Stock Out"
      description="Record outgoing inventory through the same reusable movement form used across the inventory module."
      submitLabel="Deduct Stock"
      loadingLabel="Deducting..."
      successMessage="Stock deducted successfully"
      action={stockOut}
    />
  );
};

export default StockOutPage;
