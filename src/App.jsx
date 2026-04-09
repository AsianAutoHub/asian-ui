import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Toaster } from "react-hot-toast";
import theme from "./theme";
import Layout from "./components/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import CarPurchaseList from "./pages/carPurchase/CarPurchaseList";
import CarPurchaseForm from "./pages/carPurchase/CarPurchaseForm";
import CarExpenseList from "./pages/carExpense/CarExpenseList";
import CarExpenseForm from "./pages/carExpense/CarExpenseForm";
import InvoicePage from "./pages/invoice/InvoicePage";
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
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="car-purchases" element={<CarPurchaseList />} />
            <Route path="car-purchases/new" element={<CarPurchaseForm />} />
            <Route
              path="car-purchases/edit/:id"
              element={<CarPurchaseForm />}
            />
            <Route path="car-expenses" element={<CarExpenseList />} />
            <Route path="car-expenses/new" element={<CarExpenseForm />} />
            <Route path="car-expenses/edit/:id" element={<CarExpenseForm />} />
            <Route path="invoice" element={<InvoicePage />} />

            <Route path="users" element={<UserList />} />
            <Route path="users/new" element={<UserForm />} />
            <Route path="users/edit/:id" element={<UserForm />} />

            <Route path="roles" element={<RoleList />} />
            <Route path="roles/new" element={<RoleForm />} />
            <Route path="roles/edit/:id" element={<RoleForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
