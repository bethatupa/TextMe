import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="wrapper">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat/:contactName" element={<ChatPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;