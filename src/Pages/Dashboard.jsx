/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe, LogOut, reset } from "../features/authSlice";

import {
  BsBook,
  BsPencilSquare,
  BsFillPersonLinesFill,
  BsCameraVideo,
  BsRecordFill,
} from "react-icons/bs";
import { PiChalkboardTeacher } from "react-icons/pi";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const earningData = [
    {
      icon: <BsBook />,
      amount: "3",
      title: "Ujian",
      iconColor: "rgb(255, 244, 229)",
      iconBg: "#40e0ef",
      pcColor: "red-600",
    },
    {
      icon: <BsPencilSquare />,
      amount: "13",
      title: "Soal",
      iconColor: "rgb(255, 244, 229)",
      iconBg: "rgb(254, 201, 15)",
      pcColor: "green-600",
    },
    {
      icon: <BsFillPersonLinesFill />,
      amount: "250",
      title: "Siswa",
      iconColor: "rgb(255, 244, 229)",
      iconBg: "#fb767c",
      pcColor: "red-600",
    },
    {
      icon: <PiChalkboardTeacher />,
      amount: "20",
      title: "Guru",
      iconColor: "rgb(255, 244, 229)",
      iconBg: "#e76df9",
      pcColor: "red-600",
    },
    {
      icon: <BsCameraVideo />,
      amount: "Bank Soal",
      title: "Panduan",
      iconColor: "rgb(255, 244, 229)",
      iconBg: "#47ef9b",
      pcColor: "red-600",
    },
  ];

  // Data untuk Bar Chart
  const barChartData = {
    labels: [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ],
    datasets: [
      {
        label: "High",
        data: [20, 25, 22, 30, 28, 33, 25, 26, 27],
        backgroundColor: "#3877f6",
      },
      {
        label: "Medium",
        data: [40, 35, 37, 33, 36, 34, 32, 30, 31],
        backgroundColor: "#cfd931",
      },
      {
        label: "Low",
        data: [30, 40, 41, 37, 36, 33, 43, 44, 42],
        backgroundColor: "#f04c11",
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Evaluasi Kemampuan Siswa per Bulan",
      },
    },
  };

  // Data untuk Pie Chart
  const pieChartData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        data: [300, 400, 500], // Contoh total untuk masing-masing kategori
        backgroundColor: ["#3877f6", "#cfd931", "#f04c11"],
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Total Evaluasi Kemampuan Siswa",
      },
    },
  };

  const [gayaBelajar, setGayaBelajar] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [redirectPath, setRedirectPath] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      console.log("berhasil");
      if (user && user.role === "admin") {
        // Admin doesn't need profile checks
        console.log("Admin user - no profile checks needed");
      } else if (user && user.role === "guru") {
        // For guru, only check guru profile
        checkGuruProfile();
      } else if (user && user.role === "siswa") {
        // For siswa, only check siswa profile
        checkSiswaProfile();
      }
    } else {
      navigate("/");
    }
  }, [navigate, user]);

  // Function to show modal with specific message and redirect path
  const showProfileModal = (message, path) => {
    setModalMessage(message);
    setRedirectPath(path);
    setShowModal(true);
  };

  // Handle the OK button click in the modal
  const handleModalConfirm = () => {
    setShowModal(false);
    if (redirectPath) {
      navigate(redirectPath);
    }
  };

  const checkSiswaProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:5000/profile-siswa", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.data.gayaBelajar === null) {
        setGayaBelajar(null);
      } else {
        setGayaBelajar(response.data.data.gayaBelajar);
      }

      if (response.data && response.data.status) {
        console.log("berhasil");
      } else {
        // Show modal for missing profile
        showProfileModal(
          "Profil siswa Anda belum dibuat. Silakan buat profil untuk melanjutkan.",
          "/add-profile-siswa"
        );
      }
    } catch (error) {
      console.error("Error fetching siswa profile:", error);
      // If 404 error (profile not found), show modal
      if (error.response && error.response.status === 404) {
        showProfileModal(
          "Profil siswa Anda belum dibuat. Silakan buat profil untuk melanjutkan.",
          "/add-profile-siswa"
        );
      }
    }
  };

  const checkGuruProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:5000/profile-guru", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.status) {
        console.log("berhasil");
      } else {
        // Show modal for missing profile
        showProfileModal(
          "Profil guru Anda belum dibuat. Silakan buat profil untuk melanjutkan.",
          "/add-profile-guru"
        );
      }
    } catch (error) {
      console.error("Error fetching guru profile:", error);
      // If 404 error (profile not found), show modal
      if (error.response && error.response.status === 404) {
        showProfileModal(
          "Profil guru Anda belum dibuat. Silakan buat profil untuk melanjutkan.",
          "/add-profile-guru"
        );
      }
    }
  };

  const logout = async () => {
    await dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

  return (
    <div className="mt-5">
      {user && user.role === "siswa" && gayaBelajar === null && (
        <div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4"
          role="alert"
        >
          <p className="font-bold">Perhatian!</p>
          <p>
            Anda belum mengisi kuesioner untuk menentukan gaya belajar Anda.{" "}
            <a href="/tes-gaya-belajar" className="text-blue-500 underline">
              Silakan klik di sini untuk mengisi kuesioner.
            </a>
          </p>
        </div>
      )}
      <div className="flex flex-wrap lg:flex-nowrap justify-center">
        <div className="flex m-3 flex-wrap justify-center gap-4 items-center">
          {earningData.map((item) => (
            <div
              key={item.title}
              className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl shadow-xl border border-grey text-center" // Tambahkan 'shadow-xl' di sini
            >
              <button
                type="button"
                style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                className="text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl mx-auto"
              >
                {item.icon}
              </button>
              <p className="mt-3">
                <span className="text-lg font-semibold">{item.amount}</span>
                <span className={`text-sm text-${item.pcColor} ml-2`}>
                  {item.percentage}
                </span>
              </p>
              <p className="text-sm text-gray-400 mt-1">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Chart Section */}
      <div className="m-9 flex items-center dark:text-gray-200">
        <BsRecordFill className="mr-2" />
        <h1>Grafik Tingkat Evaluasi Kemampuan Siswa</h1>
      </div>
      <div className="mt-10 flex flex-col lg:flex-row items-center justify-center gap-10">
        {/* Bar Chart */}
        <div className="w-full lg:w-1/2">
          <Bar data={barChartData} options={barChartOptions} />
        </div>
        {/* Pie Chart */}
        <div className="w-full lg:w-1/3">
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>

      {/* Modal for profile notification */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay with animation */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-300"
              aria-hidden="true"
            ></div>

            {/* This centers the modal content */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            {/* Modal panel with animation */}
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-fade-in-up">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 sm:mx-0 sm:h-10 sm:w-10">
                    {/* Info icon */}
                    <svg
                      className="h-6 w-6 text-blue-600 dark:text-blue-300"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900 dark:text-white"
                      id="modal-title"
                    >
                      Pemberitahuan
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        {modalMessage}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                  onClick={handleModalConfirm}
                >
                  OK
                </button>

                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-300 text-base font-medium text-black hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:w-auto sm:text-sm transition-colors duration-200"
                  onClick={logout}
                >
                  KELUAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
