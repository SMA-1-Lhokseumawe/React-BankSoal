import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getMe, LogOut, reset } from "../features/authSlice";

import { MdOutlineCancel } from "react-icons/md";
import { AiOutlineLogout } from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";

import { Button } from ".";
import { useStateContext } from "../contexts/ContextProvider";
import avatar from "../data/avatar.jpg";

const UserProfile = () => {
  const [urlImage, setUrlImage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const { currentColor, setIsClicked, initialState } = useStateContext();

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
    } else {
      navigate("/login");
    }
  }, [navigate, user]);

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

  const handleClose = () => {
    setIsClicked(initialState);
  };

  const logout = async () => {
    await dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
          onClick={handleClose}
        />
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <img
          className="rounded-full h-24 w-24"
          src={urlImage && urlImage !== "http://localhost:5000/images/null" ? urlImage : avatar}
          alt="user-profile"
        />
        <div>
          <p className="font-semibold text-xl dark:text-gray-200">
            {" "}
            {user ? capitalizeFirstLetter(user.username) : "Admin"}{" "}
          </p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400">
            {" "}
            {user ? user.email : "Admin"}{" "}
          </p>
        </div>
      </div>
      {user && user.role !== 'admin' && (
        <div onClick={() => navigate('/profile-saya')}>
          <div className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]">
            <button
              type="button"
              style={{ color: "#03C9D7", backgroundColor: "#E5FAFB" }}
              className=" text-xl rounded-lg p-3 hover:bg-light-gray"
              onClick={() => navigate('/profile-saya')}
            >
              <BsFillPersonFill />
            </button>

            <div>
              <p className="font-semibold dark:text-gray-200 ">My Profile</p>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                {" "}
                Account Settings{" "}
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="mt-5">
        <Button
          onClick={logout}
          color="white"
          bgColor={currentColor}
          borderRadius="10px"
          icon={<AiOutlineLogout />}
          text="Keluar"
        />
      </div>
    </div>
  );
};

export default UserProfile;
