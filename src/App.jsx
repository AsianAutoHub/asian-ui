import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Toaster } from "react-hot-toast";
import theme from "./theme";

// components
import AuthInitializer from "./components/AuthInitializer";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// pages
import LoginPage from "./pages/LoginPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/dashboard/Dashboard";
import CarPurchaseList from "./pages/carPurchase/CarPurchaseList";
import CarPurchaseForm from "./pages/carPurchase/CarPurchaseForm";
import CarExpenseList from "./pages/carExpense/CarExpenseList";
import CarExpenseForm from "./pages/carExpense/CarExpenseForm";
import InvoicePage from "./pages/invoice/InvoicePage";
import MonthlyStatementPage from "./pages/statement/MonthlyStatementPage";
import UserMetricsPage from "./pages/usermetrics/UserMetricsPage";
import UserList from "./pages/users/UserList";
import UserForm from "./pages/users/UserForm";
import RoleList from "./pages/roles/RoleList";
import RoleForm from "./pages/roles/RoleForm";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <BrowserRouter>
        {/* ✅ check refresh token before rendering anything */}
        <AuthInitializer>
          <Routes>
            {/* ── Public ── */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* ── Protected Layout ── */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              {/* all logged in users */}
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="car-purchases"
                element={
                  <ProtectedRoute>
                    <CarPurchaseList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="car-purchases/new"
                element={
                  <ProtectedRoute>
                    <CarPurchaseForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="car-purchases/edit/:id"
                element={
                  <ProtectedRoute>
                    <CarPurchaseForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="car-expenses"
                element={
                  <ProtectedRoute>
                    <CarExpenseList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="car-expenses/new"
                element={
                  <ProtectedRoute>
                    <CarExpenseForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="car-expenses/edit/:id"
                element={
                  <ProtectedRoute>
                    <CarExpenseForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="invoice"
                element={
                  <ProtectedRoute>
                    <InvoicePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="monthly-statement"
                element={
                  <ProtectedRoute>
                    <MonthlyStatementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="user-metrics"
                element={
                  <ProtectedRoute>
                    <UserMetricsPage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="users"
                element={
                  <ProtectedRoute roles={["ADMIN"]}>
                    <UserList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="users/new"
                element={
                  <ProtectedRoute roles={["ADMIN"]}>
                    <UserForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="users/edit/:id"
                element={
                  <ProtectedRoute roles={["ADMIN"]}>
                    <UserForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="roles"
                element={
                  <ProtectedRoute roles={["ADMIN"]}>
                    <RoleList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="roles/new"
                element={
                  <ProtectedRoute roles={["ADMIN"]}>
                    <RoleForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="roles/edit/:id"
                element={
                  <ProtectedRoute roles={["ADMIN"]}>
                    <RoleForm />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthInitializer>
      </BrowserRouter>
    </ThemeProvider>
  );
}

// import React from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { ThemeProvider } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";
// import { Toaster } from "react-hot-toast";
// import theme from "./theme";
// import Layout from "./components/Layout";
// import Dashboard from "./pages/dashboard/Dashboard";
// import CarPurchaseList from "./pages/carPurchase/CarPurchaseList";
// import CarPurchaseForm from "./pages/carPurchase/CarPurchaseForm";
// import CarExpenseList from "./pages/carExpense/CarExpenseList";
// import CarExpenseForm from "./pages/carExpense/CarExpenseForm";
// import InvoicePage from "./pages/invoice/InvoicePage";
// import UserList from "./pages/users/UserList";
// import UserForm from "./pages/users/UserForm";
// import RoleList from "./pages/roles/RoleList";
// import RoleForm from "./pages/roles/RoleForm";
// import UserMetricsPage from "./pages/usermetrics/UserMetricsPage";
// import MonthlyStatementPage from "./pages/statement/MonthlyStatementPage";

// export default function App() {
//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Layout />}>
//             <Route index element={<Navigate to="/dashboard" replace />} />
//             <Route path="dashboard" element={<Dashboard />} />
//             <Route path="car-purchases" element={<CarPurchaseList />} />
//             <Route path="car-purchases/new" element={<CarPurchaseForm />} />
//             <Route
//               path="car-purchases/edit/:id"
//               element={<CarPurchaseForm />}
//             />
//             <Route path="car-expenses" element={<CarExpenseList />} />
//             <Route path="car-expenses/new" element={<CarExpenseForm />} />
//             <Route path="car-expenses/edit/:id" element={<CarExpenseForm />} />
//             <Route path="invoice" element={<InvoicePage />} />

//             <Route path="users" element={<UserList />} />
//             <Route path="users/new" element={<UserForm />} />
//             <Route path="users/edit/:id" element={<UserForm />} />

//             <Route path="roles" element={<RoleList />} />
//             <Route path="roles/new" element={<RoleForm />} />
//             <Route path="roles/edit/:id" element={<RoleForm />} />
//             <Route path="user-metrics" element={<UserMetricsPage />} />
//             <Route
//               path="monthly-statement"
//               element={<MonthlyStatementPage />}
//             />
//           </Route>
//         </Routes>
//       </BrowserRouter>
//     </ThemeProvider>
//   );
// }
