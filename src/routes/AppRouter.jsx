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
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;