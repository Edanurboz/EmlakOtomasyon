import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "react-query";
import { createUser } from "../utils/api";
import UserDetailContext from "../context/UserDetailContext";
import useFavourites from "../hooks/useFavourites";
import useBookings from "../hooks/useBookings";
const Layout = () => {

  useFavourites()
  useBookings()

  const {isAuthenticated, user, getAccessTokenWithPopup } = useAuth0()
  const {setUserDetails} = useContext(UserDetailContext)
  const {mutate} = useMutation({
    mutationKey: [user?.email],
    mutationFn: (token) => createUser(user?.email, token)
  })

  useEffect(() => {
    const getTokenAndRegister = async()=>{
      const res = await getAccessTokenWithPopup({
        authorizationParams:{
          audience: "http://localhost:3000",
          scope: "openid profile email"
        }
      }) 
      localStorage.setItem("access_token", res)
      setUserDetails((prev)=>({...prev, token:res}))
      mutate(res)
    }
    isAuthenticated && getTokenAndRegister()
  }, [isAuthenticated])
  return (
    <>
      <div>
        <Header />
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
