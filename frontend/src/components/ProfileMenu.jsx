import React from "react";
import { Avatar, Menu } from "@mantine/core";
import { replace, useNavigate } from "react-router-dom";

const ProfileMenu = ({ user, logout }) => {

    const navigate = useNavigate();

  return (
    <Menu>
      <Menu.Target>
        <Avatar src={user?.picture} alt="userImg" radius={"xl"} />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item onClick={() => navigate("./favourites", {replace:true})}>Favorilerim</Menu.Item>
        <Menu.Item onClick={() => navigate("./bookings", {replace:true})}>Randevularım</Menu.Item>
        <Menu.Item
          onClick={() => {
            localStorage.clear();
            logout();
          }}
          color="red"
        >
          Çıkış Yap
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ProfileMenu;
