import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Home } from "./pages/Home";
import MyApointment from "./pages/MyApointment";
import Restorant from "./pages/Restorant";
import Login from "./pages/Login.jsx";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import RegistrationForm from "./pages/Register";
import RestoRegistrationForm from "./pages/RestoReg";
import RestaurantAppointment from "./component/Appoint";
import Protected from "./component/Protected";
import Head from "./component/Navbar";
import MyRestorant from "./pages/MyRestorant";
import { Appointments } from "./pages/Appointments";
import { AppointmentProvider } from "./component/AppointmentContext";
import OwnerHome from "./pages/OwnerHome";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [role, setRole] = useState(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
    useEffect(() => {
    // Whenever the app is refreshed, clear any authentication data.
    localStorage.removeItem("token");
    localStorage.removeItem("customer");
    localStorage.removeItem("customer");
   sessionStorage.removeItem("customer");
    // Reset state to logged-out
    setIsLoggedIn(false);
    setRole(null);
  }, []);
  useEffect(() => {
    const customerData = localStorage.getItem("customer");
    if (customerData) {
      const { role } = JSON.parse(customerData);
      setRole(role);
    }
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch(`${baseUrl}/verify-token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            setIsLoggedIn(true);
          } else {
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
           
            setIsLoggedIn(false);
          }
        } catch (error) {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
         
          setIsLoggedIn(false);
        }
      }
      setIsAuthChecked(true);
    };
    checkAuthStatus();
  }, []);
    useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("customer");
    sessionStorage.removeItem("customer");
    setIsLoggedIn(false);
  };

  if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <AppointmentProvider>
        {isLoggedIn ? <Head onLogout={handleLogout} /> : null}

        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                role === "user" ? (
                  <Navigate to="/home" replace />
                ) : (
                  <Navigate to="/ownerhome" replace />
                )
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/restoreg" element={<RestoRegistrationForm />} />
          <Route
            path="/home"
            element={<Protected isLoggedIn={isLoggedIn}><Home /></Protected>}
          />
          <Route
            path="/ownerhome"
            element={<Protected isLoggedIn={isLoggedIn}><OwnerHome /></Protected>}
          />
          <Route
            path="/restorant"
            element={<Protected isLoggedIn={isLoggedIn}><Restorant /></Protected>}
          />
          <Route
            path="/apointment"
            element={<Protected isLoggedIn={isLoggedIn}><RestaurantAppointment /></Protected>}
          />
          <Route
            path="/restorantInfo"
            element={<Protected isLoggedIn={isLoggedIn}><MyRestorant /></Protected>}
          />
          <Route
            path="/myapointment"
            element={<Protected isLoggedIn={isLoggedIn}><MyApointment /></Protected>}
          />
          <Route
            path="/restorantAppointment"
            element={<Protected isLoggedIn={isLoggedIn}><Appointments /></Protected>}
          />
        </Routes>
      </AppointmentProvider>
    </BrowserRouter>
  );
}

export default App;
