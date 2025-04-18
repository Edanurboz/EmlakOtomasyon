import React, { use, useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "react-query";
import { createUser } from "../utils/api";
import UserDetailContext from "../context/UserDetailContext";
const Layout = () => {

  const {isAuthenticated, user} = useAuth0()
  const {setUserDetails} = useContext(UserDetailContext)
  const {mutate} = useMutation({
    mutationKey: [user?.email],
    mutationFn: (token) => createUser(user?.email, token)
  })

  useEffect(() => {
    isAuthenticated && mutate()
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
