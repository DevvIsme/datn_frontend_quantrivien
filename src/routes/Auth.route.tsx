import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/Auth.Layout";
import Login from "../pages/Auth/Login";
import ForgotPassword from "../pages/Auth/Forgot_password";
import { useAuthCookies } from "../hooks/useToken";
import NewPassword from "../pages/Auth/NewPassword";

const AuthRoutes: React.FC = () => {
  const { getRefreshToken: authenticate } = useAuthCookies();
  const auth = authenticate();
  if (auth) {
    return <Navigate to="/" replace />;
  }
  return (
    <AuthLayout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password/:string" element={<NewPassword />} />
        <Route path="/*" element={<Navigate to="/auth/login" replace />} />{" "}
      </Routes>
    </AuthLayout>
  );
};

export default AuthRoutes;
