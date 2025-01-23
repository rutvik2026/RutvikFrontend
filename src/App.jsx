import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { Home } from "./pages/Home";
import MyApointment from "./pages/MyApointment";
import Restorant from "./pages/Restorant";
import Login from "./pages/Login";

import { BrowserRouter, Route, Routes, Navigate, useNavigate } from "react-router-dom";
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
const navigate = useNavigate();

  // Redirect to `/` on initial load, only if not already on `/`
  useEffect(() => {
    const token = localStorage.getItem("token");

    // If the user is logged in, redirect them to "/"
    if (token) {
      setIsLoggedIn(true);
      navigate("/"); // Redirect logged-in user to the home page
    } else {
      setIsLoggedIn(false);
    }

    setIsAuthChecked(true); // Once authentication status is checked, set it to true
  }, [navigate]);
  useEffect(() => {
    const customerData = localStorage.getItem("customer");
    if (customerData) {
      const { role } = JSON.parse(customerData); // Parse the customer data
      setRole(role);
      console.log("Role:1", role);
    }
  }, []);
 useEffect(() => {
   localStorage.removeItem("token");
   sessionStorage.removeItem("token");
   localStorage.removeItem("customer");
   sessionStorage.removeItem("customer");
 }, []);
  // Check token validity on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Replace `/api/verify-token` with your backend endpoint
          const response = await fetch("/api/verify-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            setIsLoggedIn(true);
          } else {
            // Token is invalid or expired
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          setIsLoggedIn(false);
        }
      }
      setIsAuthChecked(true); // Auth check is complete
    };

    checkAuthStatus();
  }, []);

  // Listen for token changes in localStorage
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
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsLoggedIn(false);
  };

  if (!isAuthChecked) {
    // Show a loading indicator while verifying authentication
    return <div>Loading...</div>;
  }
  
  return (
    <>
      <BrowserRouter>
        {isLoggedIn ? <Head onLogout={handleLogout} /> : null}

        <AppointmentProvider>
          {" "}
          {/* Wrap your Routes with AppointmentProvider */}
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

            <Route
              path="/login"
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

            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/restoreg" element={<RestoRegistrationForm />} />

            <Route
              path="/home"
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <Home />
                </Protected>
              }
            />
            <Route
              path="/ownerhome"
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <OwnerHome />
                </Protected>
              }
            />
            <Route
              path="/restorant"
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <Restorant />
                </Protected>
              }
            />

            <Route
              path="/apointment"
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <RestaurantAppointment />
                </Protected>
              }
            />

            <Route
              path="/restorantInfo"
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <MyRestorant />
                </Protected>
              }
            />

            <Route
              path="/myapointment"
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <MyApointment />
                </Protected>
              }
            />
            <Route
              path="/restorantAppointment"
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <Appointments />
                </Protected>
              }
            />
          </Routes>
        </AppointmentProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
