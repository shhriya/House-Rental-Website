import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import SellerMain from "./components/SellerMain";
import BuyerMain from "./components/BuyerMain";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MyHouses from "./components/MyHouses";
import SellerDetails from "./components/SellerDetails";
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/seller-main" element={<SellerMain />} />
        <Route path="/buyer-main" element={<BuyerMain />} />
        {/* <Route path="/seller-main" element={<SellerMain />} /> */}
        <Route path="/my-houses" element={<MyHouses />} />
        <Route path="/seller-details/:email" element={<SellerDetails />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
