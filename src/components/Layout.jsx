import React from "react";
import Navbar from "./Navbar";
import { useAuth } from "../contexts/AuthContext";

export default function Layout({ children }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#E0E7FF]">
      {user && <Navbar />}
      <main className="p-6 max-w-6xl mx-auto">{children}</main>
    </div>
  );
}
