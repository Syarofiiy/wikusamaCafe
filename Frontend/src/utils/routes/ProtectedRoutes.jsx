// import library yang dibutuhkan
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { getLocalStorage } from "../helper/localStorage";
import { LOCAL_STORAGE_TOKEN, LOCAL_STORAGE_USER } from "../constants";
import AdminLayout from "../../components/layout/Layout";

// buat fungsi userAuth untuk mengambil user dan token dari localStorage
const userAuth = () => {
  // ambil token dari local storage
  const token = getLocalStorage(LOCAL_STORAGE_TOKEN);
  // ambil user dari local storage
  const user = getLocalStorage(LOCAL_STORAGE_USER);

  // jika token dan user ada maka kembalikan token dan role
  if (token && user) {
    return {
      token: token,
      role: user.role, // pastikan user.role tersedia
    };
  }

  // jika tidak ada maka kembalikan null
  return null;
};

// buat komponen ProtectedRoutes
const ProtectedRoutes = () => {
  // ambil token dan role dari userAuth
  const auth = userAuth();

  // jika auth null, redirect ke halaman login
  if (!auth) {
    return <Navigate to="/login" />;
  }

  // jika token ada, render layout admin dan child routes
  return <Outlet />;
};

// export komponen ProtectedRoutes
export default ProtectedRoutes;
