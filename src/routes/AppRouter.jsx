import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AddProductPage from "../pages/products/AddProductPage";
import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import ProtectedRoute from "../components/common/ProtectedRoute";
import BarcodePage from "../pages/products/BarcodePage";
import EditProductPage from "../pages/products/EditProductPage";
import ProductsPage from "../pages/products/ProductsPage";
import CategoriesPage from "../pages/categories/CategoriesPage";
import ProductDetailsPage from "../pages/products/ProductDetailsPage";
import AddCategoryPage from "../pages/categories/AddCategoryPage";
import EditCategoryPage from "../pages/categories/EditCategoryPage";
import StockInPage from "../pages/inventory/StockInPage";
import StockOutPage from "../pages/inventory/StockOutPage";
import TransactionsPage from "../pages/inventory/TransactionsPage";
import CustomersPage from "../pages/customers/CustomersPage"; 
import CreateCustomerPage from "../pages/customers/CreateCustomerPage"; 
import EditCustomerPage from "../pages/customers/EditCustomerPage";
 import CustomerDetailsPage from "../pages/customers/CustomerDetailsPage";
import SalesPage from "../pages/sales/SalesPage"; 
import CreateSalePage from "../pages/sales/CreateSalePage";
 import SaleDetailsPage from "../pages/sales/SaleDetailsPage";
 import LeadsPage from "../pages/leads/LeadsPage";
import CreateLeadPage from "../pages/leads/CreateLeadPage";
import EditLeadPage from "../pages/leads/EditLeadPage";
import LeadDetailsPage from "../pages/leads/LeadDetailsPage";
import LeadPipelinePage from "../pages/leads/LeadPipelinePage";
import CRMLayout from "../pages/crm/CRMLayout";
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
  path="/products"
  element={
    <ProtectedRoute>
      <ProductsPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/products/add"
  element={
    <ProtectedRoute>
      <AddProductPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/categories"
  element={
    <ProtectedRoute>
      <CategoriesPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/categories/add"
  element={
    <ProtectedRoute>
      <AddCategoryPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/categories/edit/:id"
  element={
    <ProtectedRoute>
      <EditCategoryPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/products/:id"
  element={
    <ProtectedRoute>
      <ProductDetailsPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/products/edit/:id"
  element={
    <ProtectedRoute>
      <EditProductPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/products/barcode/:id"
  element={
    <ProtectedRoute>
      <BarcodePage />
    </ProtectedRoute>
  }
/>
<Route
  path="/stock-in"
  element={
    <ProtectedRoute>
      <StockInPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/stock-out"
  element={
    <ProtectedRoute>
      <StockOutPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/transactions"
  element={
    <ProtectedRoute>
      <TransactionsPage />
    </ProtectedRoute>
  }
/>

<Route path="/sales" element={<SalesPage />} /> 
<Route path="/sales/create" element={<CreateSalePage />} /> 
<Route path="/sales/:id" element={<SaleDetailsPage />} />
<Route
  path="/crm"
  element={
    <ProtectedRoute>
      <CRMLayout />
    </ProtectedRoute>
  }
>

  <Route
    path="customers"
    element={<CustomersPage />}
  />

  <Route
    path="customers/create"
    element={<CreateCustomerPage />}
  />

  <Route
    path="customers/edit/:id"
    element={<EditCustomerPage />}
  />

  <Route
    path="customers/:id"
    element={<CustomerDetailsPage />}
  />

  <Route
    path="leads"
    element={<LeadsPage />}
  />

  <Route
    path="leads/create"
    element={<CreateLeadPage />}
  />

  <Route
    path="leads/edit/:id"
    element={<EditLeadPage />}
  />

  <Route
    path="leads/:id"
    element={<LeadDetailsPage />}
  />

  <Route
    path="pipeline"
    element={<LeadPipelinePage />}
  />

</Route>
{/* <Route path="/customers" element={<CustomersPage />} /> 
<Route path="/customers/create" element={<CreateCustomerPage />} /> 
<Route path="/customers/edit/:id" element={<EditCustomerPage />} /> 
<Route path="/customers/:id" element={<CustomerDetailsPage />} />
<Route
  path="/leads"
  element={<LeadsPage />}
/>

<Route
  path="/leads/create"
  element={<CreateLeadPage />}
/>

<Route
  path="/leads/pipeline"
  element={<LeadPipelinePage />}
/>

<Route
  path="/leads/:id"
  element={<LeadDetailsPage />}
/>

<Route
  path="/leads/edit/:id"
  element={<EditLeadPage />}
/> */}

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;