import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import LogoCreator from "./components/LogoCreator";
import BannerCreator from "./components/BannerCreator";

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/logo" element={<LogoCreator />} />
      <Route path="/banner" element={<BannerCreator />} />
    </Routes>
  </Router>
);

export default App;

