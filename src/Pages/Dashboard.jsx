import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

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
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      console.log("berhasil");
      
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="mt-5">
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
    </div>
  );
};

export default Dashboard;
