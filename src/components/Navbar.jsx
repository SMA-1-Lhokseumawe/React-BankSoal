import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

import { AiOutlineMenu } from "react-icons/ai";
import { RiNotification3Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";

import avatar from "../data/avatar.jpg";
import { Notification, UserProfile } from ".";
import { useStateContext } from "../contexts/ContextProvider";

const NavButton = ({ title, customFunc, icon, color, dotColor, badge }) => (
  <button
    type="button"
    onClick={() => customFunc()}
    style={{ color }}
    className="relative text-xl rounded-full p-3 hover:bg-light-gray"
  >
    {dotColor && (
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
    )}
    {badge > 0 && (
      <span className="absolute inline-flex rounded-full h-5 w-5 right-1 top-1 bg-red-500 text-white text-xs justify-center items-center">
        {badge > 9 ? '9+' : badge}
      </span>
    )}
    {icon}
  </button>
);

const Navbar = () => {
  const [urlImage, setUrlImage] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      if (user && user.role === "guru") {
        getProfileGuru();
      } else if (user && user.role === "siswa") {
        getProfileSiswa();
      }
      
      // Fetch unread notifications count
      fetchUnreadCount();
      
      // Set up interval to refresh unread count every minute
      const interval = setInterval(fetchUnreadCount, 60000);
      
      return () => clearInterval(interval);
    } else {
      navigate("/login");
    }
  }, [navigate, user]);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      const apiUrl = process.env.REACT_APP_URL_API;
      const response = await axios.get(`${apiUrl}/notifications/unread-count`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error("Error fetching unread notifications count:", error);
    }
  };

  const getProfileSiswa = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      const response = await axios.get(`${apiUrl}/profile-siswa`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.data) {
        const profileData = response.data.data;
        setUrlImage(profileData.url);
      } else {
        console.error("Format data tidak sesuai:", response.data);
      }
    } catch (error) {
      console.error("Error mengambil profile siswa:", error);
    } finally {
    }
  };

  const getProfileGuru = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      const response = await axios.get(`${apiUrl}/profile-guru`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.data) {
        const profileData = response.data.data;
        setUrlImage(profileData.url);
        console.log(profileData.url);
        
      } else {
        console.error("Format data tidak sesuai:", response.data);
      }
    } catch (error) {
      console.error("Error mengambil profile guru:", error);
    } finally {
    }
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const {
    currentColor,
    activeMenu,
    setActiveMenu,
    handleClick,
    isClicked,
    setScreenSize,
    screenSize,
  } = useStateContext();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  // When notification panel is opened, refresh notifications
  useEffect(() => {
    if (isClicked.notification) {
      // After the notification panel is closed, refresh the unread count
      return () => {
        fetchUnreadCount();
      };
    }
  }, [isClicked.notification]);

  return (
    <div className="flex justify-between p-2 md:ml-6 md:mr-6 relative">
      <NavButton
        title="Menu"
        customFunc={handleActiveMenu}
        color={currentColor}
        icon={<AiOutlineMenu />}
      />
      <div className="flex">
        <NavButton
          title="Notification"
          customFunc={() => handleClick("notification")}
          color={currentColor}
          icon={<RiNotification3Line />}
          badge={unreadCount}
        />

        <div
          className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
          onClick={() => handleClick("userProfile")}
        >
          <img
            className="rounded-full w-8 h-8"
            src={urlImage || avatar}
            alt="user-profile"
          />
          <p>
            <span className="text-gray-400 text-14">Hi,</span>{" "}
            <span className="text-gray-400 font-bold ml-1 text-14">
              {user ? capitalizeFirstLetter(user.username) : "Admin"}
            </span>
          </p>
          <MdKeyboardArrowDown className="text-gray-400 text-14" />
        </div>

        {isClicked.notification && <Notification />}
        {isClicked.userProfile && <UserProfile />}
      </div>
    </div>
  );
};

export default Navbar;