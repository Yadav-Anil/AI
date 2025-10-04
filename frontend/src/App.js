import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AuthPage from "./components/AuthPage";
import { localStorageAPI } from "./mock";
import { Toaster } from "./components/ui/toaster";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorageAPI.getAuth();
    if (auth) {
      setUser(auth.user);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorageAPI.setAuth(userData, token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorageAPI.clearAuth();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route 
            path="/auth" 
            element={
              !user ? 
              <AuthPage onLogin={handleLogin} /> : 
              <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/" 
            element={
              user ? 
              <Dashboard user={user} onLogout={handleLogout} /> : 
              <Navigate to="/auth" replace />
            } 
          />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;