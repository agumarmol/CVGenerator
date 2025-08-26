import axios from "axios";
import { SetLocation } from "wouter"; // importa el tipo de wouter

// Axios configurado para enviar cookies de sesión
const api = axios.create({
  baseURL: "http://127.0.0.1:3000/api",
  withCredentials: true, // importante para sesiones
  headers: { "Content-Type": "application/json" },
});

// Función de login
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/login", { email, password });
    return response.data.user;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

// Obtener datos del usuario logueado
export const getUserData = async () => {
  try {
    const response = await api.get("/auth/user");
    return response.data.user;
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    throw error;
  }
};

// Función de logout mejorada
export const logout = async (setLocation: SetLocation) => {
  try {
    await api.post("/logout");
    setLocation("/"); // redirige a landing
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    alert("Hubo un problema al cerrar sesión. Por favor, inténtalo nuevamente.");
  }
};
