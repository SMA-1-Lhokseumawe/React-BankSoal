import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

import { Header } from "../components";

import { FaEdit, FaTrash } from "react-icons/fa";

const ListUsers = () => {
  const [users, setUsers] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      getUsers();
    } else {
      navigate("/");
    }
  }, [navigate]);

  const getUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      const response = await axios.get(`${apiUrl}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleTambah = () => {
    navigate("/users/tambah-users");
  };

  const handleEdit = (id) => {
    navigate(`/users/${id}`);
  };

  const handleDelete = async (userId) => {
    const token = localStorage.getItem("accessToken");
    const apiUrl = process.env.REACT_APP_URL_API;
    await axios.delete(`${apiUrl}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    getUsers();
  };

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white dark:text-white dark:bg-secondary-dark-bg rounded-3xl border border-gray-300">
      <div className="flex justify-between items-center header-container">
        <div className="kebawah-dikit">
          <Header category="Page" title="Data Users" />
        </div>
        <div className="flex flex-col sm:flex-row items-center search-container">
          <button
            onClick={handleTambah}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 mt-2 sm:mt-0"
          >
            Tambah Data
          </button>
        </div>
      </div>
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-white dark:bg-secondary-dark-bg">
              No.
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-white dark:bg-secondary-dark-bg">
              Username
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-white dark:bg-secondary-dark-bg">
              Email
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-white dark:bg-secondary-dark-bg">
              Role
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-white dark:bg-secondary-dark-bg">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((item, index) => (
            <tr key={item.uuid}>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:text-white dark:bg-secondary-dark-bg">
                {index + 1}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:text-white dark:bg-secondary-dark-bg">
                {item.username}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:text-white dark:bg-secondary-dark-bg">
                {item.email}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:text-white dark:bg-secondary-dark-bg">
                {item.role}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:text-white dark:bg-secondary-dark-bg">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleEdit(item.uuid)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(item.uuid)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListUsers;
