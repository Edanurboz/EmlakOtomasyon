import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  return (
    <BrowserRouter>
    <Suspense fallback={<div>Loading..</div>}>
      <Header />
      <Routes>
        <Route element={<Layout />} />
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </Suspense>
    </BrowserRouter>
  );
};

export default App
