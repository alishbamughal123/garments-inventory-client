import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import { appRoutes } from "../config/routes";
import LoginPage from "../pages/auth/LoginPage";
import CategoriesPage from "../pages/categories/CategoriesPage";
import AddCategoryPage from "../pages/categories/AddCategoryPage";
import EditCategoryPage from "../pages/categories/EditCategoryPage";
import CRMLayout from "../pages/crm/CRMLayout";
import CRMReportsPage from "../pages/crm/CRMReportsPage";
import CustomerAnalyticsPage from "../pages/crm/CustomerAnalyticsPage";
import LeadAnalyticsPage from "../pages/crm/LeadAnalyticsPage";
import RevenueAnalyticsPage from "../pages/crm/RevenueAnalyticsPage";
import CustomersPage from "../pages/customers/CustomersPage";
import CreateCustomerPage from "../pages/customers/CreateCustomerPage";
import CustomerDetailsPage from "../pages/customers/CustomerDetailsPage";
import EditCustomerPage from "../pages/customers/EditCustomerPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import StockInPage from "../pages/inventory/StockInPage";
import StockOutPage from "../pages/inventory/StockOutPage";
import ReturnsPage from "../pages/inventory/ReturnsPage";
import ProcessReturnPage from "../pages/inventory/ProcessReturnPage";
import EditReturnPage from "../pages/inventory/EditReturnPage";
import ReturnDetailsPage from "../pages/inventory/ReturnDetailsPage";
import LowStockPage from "../pages/inventory/LowStockPage";
import TransactionsPage from "../pages/inventory/TransactionsPage";
import CreateLeadPage from "../pages/leads/CreateLeadPage";
import EditLeadPage from "../pages/leads/EditLeadPage";
import LeadDetailsPage from "../pages/leads/LeadDetailsPage";
import LeadPipelinePage from "../pages/leads/LeadPipelinePage";
import LeadsPage from "../pages/leads/LeadsPage";
import AddProductPage from "../pages/products/AddProductPage";
import BarcodePage from "../pages/products/BarcodePage";
import EditProductPage from "../pages/products/EditProductPage";
import ProductDetailsPage from "../pages/products/ProductDetailsPage";
import ProductsPage from "../pages/products/ProductsPage";
import CreateSalePage from "../pages/sales/CreateSalePage";
import EditSalePage from "../pages/sales/EditSalePage";
import SaleDetailsPage from "../pages/sales/SaleDetailsPage";
import SalesPage from "../pages/sales/SalesPage";
import CreateTaskPage from "../pages/tasks/CreateTaskPage";
import EditTaskPage from "../pages/tasks/EditTaskPage";
import TaskCalendarPage from "../pages/tasks/TaskCalendarPage";
import TaskDetailsPage from "../pages/tasks/TaskDetailsPage";
import TasksPage from "../pages/tasks/TasksPage";

const protectedElement = (
  element
) => (
  <ProtectedRoute>
    {element}
  </ProtectedRoute>
);

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={appRoutes.home}
          element={
            <Navigate
              to={appRoutes.login}
            />
          }
        />

        <Route
          path={appRoutes.login}
          element={<LoginPage />}
        />

        <Route
          path={appRoutes.dashboard}
          element={protectedElement(
            <DashboardPage />
          )}
        />

        <Route
          path={appRoutes.products}
          element={protectedElement(
            <ProductsPage />
          )}
        />
        <Route
          path={appRoutes.productsAdd}
          element={protectedElement(
            <AddProductPage />
          )}
        />
        <Route
          path={appRoutes.productDetails()}
          element={protectedElement(
            <ProductDetailsPage />
          )}
        />
        <Route
          path={appRoutes.productEdit()}
          element={protectedElement(
            <EditProductPage />
          )}
        />
        <Route
          path={appRoutes.productBarcode()}
          element={protectedElement(
            <BarcodePage />
          )}
        />

        <Route
          path={appRoutes.categories}
          element={protectedElement(
            <CategoriesPage />
          )}
        />
        <Route
          path={appRoutes.categoriesAdd}
          element={protectedElement(
            <AddCategoryPage />
          )}
        />
        <Route
          path={appRoutes.categoriesEdit()}
          element={protectedElement(
            <EditCategoryPage />
          )}
        />

        <Route
          path={appRoutes.stockIn}
          element={protectedElement(
            <StockInPage />
          )}
        />
        <Route
          path={appRoutes.stockOut}
          element={protectedElement(
            <StockOutPage />
          )}
        />
        <Route
          path={appRoutes.returns}
          element={protectedElement(
            <ReturnsPage />
          )}
        />
        <Route
          path={appRoutes.returnsProcess}
          element={protectedElement(
            <ProcessReturnPage />
          )}
        />
        <Route
          path="/returns/edit/:id"
          element={protectedElement(
            <EditReturnPage />
          )}
        />
        <Route
          path={appRoutes.returnDetails()}
          element={protectedElement(
            <ReturnDetailsPage />
          )}
        />
        <Route
          path={appRoutes.lowStock}
          element={protectedElement(
            <LowStockPage />
          )}
        />
        <Route
          path={appRoutes.transactions}
          element={protectedElement(
            <TransactionsPage />
          )}
        />

        <Route
          path={appRoutes.sales}
          element={protectedElement(
            <SalesPage />
          )}
        />
        <Route
          path={appRoutes.salesCreate}
          element={protectedElement(
            <CreateSalePage />
          )}
        />
        <Route
          path="/sales/edit/:id"
          element={protectedElement(
            <EditSalePage />
          )}
        />
        <Route
          path={appRoutes.saleDetails()}
          element={protectedElement(
            <SaleDetailsPage />
          )}
        />

        <Route
          path={appRoutes.crm}
          element={protectedElement(
            <CRMLayout />
          )}
        >
          <Route
            index
            element={
              <Navigate
                to="customers"
                replace
              />
            }
          />

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
            element={
              <CustomerDetailsPage />
            }
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
            path="leads/pipeline"
            element={
              <LeadPipelinePage />
            }
          />

          <Route
            path="pipeline"
            element={
              <Navigate
                to="../leads/pipeline"
                replace
              />
            }
          />

          <Route
            path="tasks"
            element={<TasksPage />}
          />
          <Route
            path="tasks/create"
            element={
              <CreateTaskPage />
            }
          />
          <Route
            path="tasks/calendar"
            element={
              <TaskCalendarPage />
            }
          />
          <Route
            path="tasks/edit/:id"
            element={
              <EditTaskPage />
            }
          />
          <Route
            path="tasks/:id"
            element={
              <TaskDetailsPage />
            }
          />

          <Route
            path="reports"
            element={<CRMReportsPage />}
          />
          <Route
            path="reports/leads"
            element={
              <LeadAnalyticsPage />
            }
          />
          <Route
            path="reports/customers"
            element={
              <CustomerAnalyticsPage />
            }
          />
          <Route
            path="reports/revenue"
            element={
              <RevenueAnalyticsPage />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
