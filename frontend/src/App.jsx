import React, { Suspense, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Property from "./pages/Property";
import Listing from "./pages/Listing";
import Bookings from "./pages/Bookings";
import Favourites from "./pages/Favourites";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import {ReactQueryDevtools} from 'react-query/devtools';
import "react-toastify/dist/ReactToastify.css";
import UserDetailContext from "./context/UserDetailContext";

const App = () => {
  const queryClient = new QueryClient();
  const [userDetails, setUserDetails] = useState({
    favourites: [],
    bookings : [],
    token: null
  })

  return (
    <UserDetailContext.Provider value= {{userDetails, setUserDetails}}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/listing">
                <Route index element={<Listing />} />
                <Route path=":propertyId" element={<Property />} />
              </Route>
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/favourites" element={<Favourites />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
      <ToastContainer/>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    </UserDetailContext.Provider>
  );
};

export default App;
