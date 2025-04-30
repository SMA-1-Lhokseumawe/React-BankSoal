import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

import { Header } from "../components";

import { FaEdit, FaTrash } from "react-icons/fa";

const ListPelajaran = () => {
  const [pelajaran, setPelajaran] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      getPelajaran();
    } else {
      navigate("/");
    }
  }, [navigate]);

  const getPelajaran = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      const response = await axios.get(`${apiUrl}/pelajaran`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to headers
        },
      });
      setPelajaran(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleTambah = () => {
    navigate("/pelajaran/tambah-pelajaran");
  };

  const handleEdit = (id) => {
    navigate(`/pelajaran/${id}`);
  };

  const handleDeletePelajaran = async (userId) => {
    const token = localStorage.getItem("accessToken");
    const apiUrl = process.env.REACT_APP_URL_API;
    await axios.delete(`${apiUrl}/pelajaran/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    getPelajaran();
  };

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white dark:text-white dark:bg-secondary-dark-bg rounded-3xl border border-gray-300">
      <div className="flex justify-between items-center header-container">
        <div className="kebawah-dikit">
          <Header category="Page" title="Data Pelajaran" />
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
              ID
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-white dark:bg-secondary-dark-bg">
              Nama Pelajaran
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-white dark:bg-secondary-dark-bg">
              Kelas
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-white dark:bg-secondary-dark-bg">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
        {loading ? (
              <tr>
                <td colSpan="4" className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                  Loading...
                </td>
              </tr>
          ) : pelajaran.length > 0 ? (
            pelajaran.map((item) => (
            <tr key={item.id}>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:text-white dark:bg-secondary-dark-bg">
                {item.id}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:text-white dark:bg-secondary-dark-bg">
                {item.pelajaran}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:text-white dark:bg-secondary-dark-bg">
                {item.kelas ? item.kelas.kelas : "N/A"}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:text-white dark:bg-secondary-dark-bg">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleEdit(item.id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeletePelajaran(item.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="px-5 py-10 text-center dark:text-white dark:bg-secondary-dark-bg">
              <div className="flex flex-col items-center justify-center">
                <svg 
                  className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Tidak ada data pelajaran</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Silakan tambahkan data pelajaran baru dengan klik tombol "Tambah Data"
                </p>
              </div>
            </td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
  );
};

export default ListPelajaran;
