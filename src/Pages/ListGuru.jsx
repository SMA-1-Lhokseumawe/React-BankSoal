import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

import { Header } from "../components";

import { FaEdit, FaTrash } from "react-icons/fa";

const ListGuru = () => {
  const [guru, setGuru] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      getGuru();
    } else {
      navigate("/");
    }
  }, [navigate]);

  const getGuru = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      const response = await axios.get(`${apiUrl}/guru`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGuru(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const formatTanggal = (tanggal) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(tanggal);
    return date.toLocaleDateString("id-ID", options);
  };

  const handleEdit = (id) => {
    navigate(`/guru/${id}`);
  };

  const handleDeleteGuru = async (userId) => {
    const token = localStorage.getItem("accessToken");
    const apiUrl = process.env.REACT_APP_URL_API;
    await axios.delete(`${apiUrl}/guru/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    getGuru();
  };

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white dark:text-white dark:bg-secondary-dark-bg rounded-3xl border border-gray-300">
      <Header category="Page" title="Data Guru" />
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-white dark:bg-secondary-dark-bg">
              Nip
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-white dark:bg-secondary-dark-bg">
              Username
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-white dark:bg-secondary-dark-bg">
              Nama
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-white dark:bg-secondary-dark-bg">
              Email
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-white dark:bg-secondary-dark-bg">
              Jenis Kelamin
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-white dark:bg-secondary-dark-bg">
              Tanggal Lahir
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-white dark:bg-secondary-dark-bg">
              Alamat
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-white dark:bg-secondary-dark-bg">
              Foto
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-white dark:bg-secondary-dark-bg">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan="9"
                className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
              >
                Loading...
              </td>
            </tr>
          ) : guru.length > 0 ? (
            guru.map((guru) => (
              <tr key={guru.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:text-white dark:bg-secondary-dark-bg">
                  {guru.nip}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:text-white dark:bg-secondary-dark-bg">
                  {guru.user ? guru.user.username : "-"}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:text-white dark:bg-secondary-dark-bg">
                  {guru.nama}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:text-white dark:bg-secondary-dark-bg">
                  {guru.email}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:text-white dark:bg-secondary-dark-bg">
                  {guru.gender}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:text-white dark:bg-secondary-dark-bg">
                  {formatTanggal(guru.tanggalLahir)}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:text-white dark:bg-secondary-dark-bg">
                  {guru.alamat}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:text-white dark:bg-secondary-dark-bg">
                  {guru.url ? (
                    <div className="w-12 h-12 relative cursor-pointer group">
                      <a
                        href={guru.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full"
                      >
                        <img
                          src={guru.url}
                          alt={`Foto ${guru.nama}`}
                          className="w-full h-full object-cover rounded-full transition-all duration-300 group-hover:shadow-lg"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/48?text=No+Image";
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 rounded-full transition-all duration-300 group-hover:bg-opacity-20">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </div>
                      </a>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">N/A</span>
                    </div>
                  )}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:text-white dark:bg-secondary-dark-bg">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleEdit(guru.id)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteGuru(guru.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="9"
                className="px-5 py-10 text-center dark:text-white dark:bg-secondary-dark-bg"
              >
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
                  <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
                    Tidak ada data Guru
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

export default ListGuru;
