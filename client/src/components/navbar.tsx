import React from "react";
import { useLocation } from "wouter";
import { logout } from "../auth";

const Navbar = () => {
  const [, setLocation] = useLocation(); // wouter

  const handleLogout = async () => {
    await logout(setLocation); // envía setLocation para redirigir
  };

  return (
    <nav>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </nav>
  );
};

export default Navbar;
