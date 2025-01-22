import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthContext } from "./context/AuthContext"; // Import your context
import "./index.css";

// Define the initial context value
const authContextValue = {
  role: "user", // You can dynamically manage this value later
  isLoggedIn: true, // Adjust based on your app logic
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Wrap App with AuthContext.Provider */}
    <AuthContext.Provider value={authContextValue}>
      <App />
    </AuthContext.Provider>
  </StrictMode>
);
