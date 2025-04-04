import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import { FiPlus } from "react-icons/fi";

const ListSubModulBelajar = () => {
  const subModulData = [
    {
      subJudul: "Belajar Bilangan Phytagoras",
      subDeskripsi:
        "Modul ini mengajarkan konsep dasar bilangan Phytagoras dan aplikasinya dalam pemecahan masalah matematika.",
    },
    {
      subJudul: "Belajar Membuat Aplikasi Android",
      subDeskripsi:
        "Modul ini membahas tentang pengembangan aplikasi Android dasar menggunakan Android Studio dan Kotlin.",
    },
    {
      subJudul: "Belajar Membuat Aplikasi Android",
      subDeskripsi:
        "Modul ini membahas tentang pengembangan aplikasi Android dasar menggunakan Android Studio dan Kotlin.",
    },
    {
      subJudul: "Belajar Membuat Aplikasi Android",
      subDeskripsi:
        "Modul ini membahas tentang pengembangan aplikasi Android dasar menggunakan Android Studio dan Kotlin.",
    },

    {
      subJudul: "Menjadi Android Developer Expert",
      subDeskripsi:
        "Modul lanjutan untuk memperdalam kemampuan dalam pengembangan aplikasi Android dengan best practices.",
    },
  ];

  const [activeFilter, setActiveFilter] = useState("All");
  const { currentColor, currentMode } = useStateContext();
  const navigate = useNavigate();

  // Menambahkan styling dinamis berdasarkan currentColor dan mode
  const gradientStyle = {
    background:
      currentMode === "Dark"
        ? `linear-gradient(135deg, ${currentColor}20 0%, ${currentColor}40 100%)`
        : `linear-gradient(135deg, ${currentColor}10 0%, ${currentColor}30 100%)`,
  };

  const buttonStyle = {
    backgroundColor: currentColor,
  };

  return (
    <div className="p-6 space-y-8 dark:bg-gray-900">
      {/* Header section with gradient background */}
      <div className="rounded-xl p-6 mb-8" style={gradientStyle}>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Daftar Sub Modul Pembelajaran
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
          Pilih pembelajaran yang mau dibahas
        </p>
      </div>

      <div>
        <button
          className="inline-flex items-center px-5 py-2.5 rounded-lg text-white font-medium shadow-sm hover:shadow-md transition-all"
          style={buttonStyle}
          onClick={() => navigate("/add-modul-belajar")}
        >
          <FiPlus className="mr-2" />
          Tambah Sub Modul
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {subModulData.map((modul, index) => {
          return (
            <div
              key={index}
              className={`rounded-xl overflow-hidden border dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-md bg-white dark:bg-gray-800 flex flex-col`}
            >
              {/* Card Header with color */}
              <div
                className="h-3"
                style={{ backgroundColor: currentColor }}
              ></div>

              <div className="p-6 flex-grow">
                {/* Title and description */}
                <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">
                  {modul.subJudul}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
                  {modul.subDeskripsi}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListSubModulBelajar;
