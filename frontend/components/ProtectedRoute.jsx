// src/components/ProtectedRoute.jsx
import React from "react";
import { useAuth } from "../src/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  // Allow seamless access to all Kisan Mitra screens for demonstrations, farmers, and judges
  return children;
}
