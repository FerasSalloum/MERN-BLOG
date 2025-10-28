import React from "react";
import { Routes, Route } from "react-router-dom";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Singin from "./pages/Singin";
import Singup from "./pages/Singup";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/about" element={<About />}></Route>
      <Route path="/dashboard" element={<Dashboard />}></Route>
      <Route path="/projects" element={<Projects />}></Route>
      <Route path="/singin" element={<Singin />}></Route>
      <Route path="/singup" element={<Singup />}></Route>
    </Routes>
  );
};

export default App;
