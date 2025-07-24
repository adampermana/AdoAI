import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/layout/Header";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import { ChatProvider } from "./context/chatContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

if (loading) {
return (
  <div className="loading-screen">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="loading-content"
    >
      <ClipLoader size={60} color="#00d4ff" loading={loading} />
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="loading-text"
      >
        Initializing AdoAI...
      </motion.h2>
    </motion.div>
  </div>
);

}


  return (
    <ThemeProvider>
      <ChatProvider>
        <BrowserRouter>
          <div className="app">
            <Header />
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/chat" element={<Chat />} />
              </Routes>
            </AnimatePresence>
          </div>
        </BrowserRouter>
      </ChatProvider>
    </ThemeProvider>
  );
}

export default App;