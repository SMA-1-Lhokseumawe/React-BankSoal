/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/authSlice";
import { useStateContext } from "../../contexts/ContextProvider";
import { FiBook, FiFilter, FiCheckCircle, FiHelpCircle } from "react-icons/fi";

const NilaiSaya = () => {
  const [nilai, setNilai] = useState([]);
  const [namaSiswa, setNamaSiswa] = useState("");
  const [filteredNilai, setFilteredNilai] = useState([]);

  const baseFilters = ["All", "Kelas 10", "Kelas 11", "Kelas 12"];

  const [activeFilter, setActiveFilter] = useState("All");
  const { currentColor, currentMode } = useStateContext();
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      getNilai();
      getProfileSiswa();
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    // Apply initial filter
    if (nilai.length > 0) {
      if (activeFilter === "All") {
        setFilteredNilai(nilai);
      } else {
        const filterClass = parseInt(activeFilter.split(" ")[1]);
        const filtered = nilai.filter(
          (item) => item.kelas.kelas === filterClass
        );
        setFilteredNilai(filtered);
      }
    }
  }, [nilai, activeFilter]);

  const getNilai = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:5000/nilai", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const sortedData = response.data.sort((a, b) => {
        // Convert to Date objects and compare
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });

      setNilai(sortedData);
      setFilteredNilai(sortedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const getProfileSiswa = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:5000/profile-siswa", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNamaSiswa(response.data.data.nama)
    } catch (error) {
      console.error("Error fetching siswa profile:", error);
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);

    if (filter === "All") {
      setFilteredNilai(nilai);
    } else {
      const filterClass = parseInt(filter.split(" ")[1]);
      const filtered = nilai.filter(
        (item) => item.kelas.kelas === filterClass
      );
      setFilteredNilai(filtered);
    }
  };

  const gradientStyle = {
    background:
      currentMode === "Dark"
        ? `linear-gradient(135deg, ${currentColor}20 0%, ${currentColor}40 100%)`
        : `linear-gradient(135deg, ${currentColor}10 0%, ${currentColor}30 100%)`,
  };

  const buttonStyle = {
    backgroundColor: currentColor,
  };

  const handleViewNilaiSaya = (id) => {
    navigate(`/nilai-saya/${id}`);
  };

  const handleKerjakanLagi = (id) => {
    navigate(`/start-quiz-again/${id}`);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Tidak Tersedia';
  
    try {
      // Create a Date object from the input string
      const date = new Date(dateString);
  
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return 'Waktu Tidak Valid';
      }
  
      // Format the date using toLocaleDateString and toLocaleTimeString
      const formattedDate = date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
  
      const formattedTime = date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
  
      return `${formattedDate}, ${formattedTime} WIB`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Tidak Tersedia';
    }
  };

  return (
    <div className="p-6 space-y-8 dark:bg-gray-900 mt-5">
      {/* Header section with gradient background */}
      <div className="rounded-xl p-6 mb-8" style={gradientStyle}>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Nilai {namaSiswa}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
          Lihat riwayat nilai anda dari setiap soal yang sudah dikerjakan. Filter berdasarkan kelas untuk melihat performa anda.
        </p>
      </div>

      <div className="flex mb-6 overflow-x-auto gap-2">
        <button
          className="px-4 py-2 rounded-lg flex items-center shadow-sm"
          style={{ backgroundColor: currentColor, color: "white" }}
        >
          <FiFilter className="mr-2" /> Filter
        </button>

        {baseFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterChange(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeFilter === filter
                ? currentMode === "Dark"
                  ? "bg-secondary-dark-bg border-2"
                  : "bg-white border-2"
                : currentMode === "Dark"
                ? "bg-dark-bg border border-gray-700 text-gray-300 hover:bg-secondary-dark-bg"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
            style={
              activeFilter === filter
                ? { borderColor: currentColor, color: currentColor }
                : {}
            }
          >
            {filter}
          </button>
        ))}
      </div>
      {filteredNilai.length === 0 && !loading ? (
        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center">
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Tidak ada nilai yang sesuai dengan filter "{activeFilter}"
          </p>
          <button
            className="mt-4 px-4 py-2 text-sm rounded-lg"
            style={{ backgroundColor: currentColor, color: "white" }}
            onClick={() => setActiveFilter("All")}
          >
            Tampilkan Semua
          </button>
        </div>
      ) : loading ? (
        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center">
          <p className="text-gray-600 dark:text-gray-300 text-lg">Loading...</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredNilai.map((item, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden border dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-md bg-white dark:bg-gray-800 flex flex-col"
            >
              {/* Card Header with color */}
              <div className="h-3" style={{ backgroundColor: currentColor }}></div>

              <div className="p-5 flex-grow">
                {/* Title and description */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    Skor: {item.skor}
                  </h2>
                  <span 
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.level === "High" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }`}
                  >
                    {item.level}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                  Kelas {item.kelas.kelas}
                </p>

                {/* Stats with improved visuals */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div
                      className="rounded-full p-2 mr-3"
                      style={{
                        backgroundColor:
                          currentMode === "Dark"
                            ? `${currentColor}40`
                            : `${currentColor}20`,
                      }}
                    >
                      <FiHelpCircle
                        className="text-lg"
                        style={{ color: currentColor }}
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Jumlah Soal
                      </p>
                      <p className="font-semibold dark:text-gray-200">
                        {item.jumlahSoal}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div
                      className="rounded-full p-2 mr-3"
                      style={{
                        backgroundColor:
                          currentMode === "Dark"
                            ? `${currentColor}40`
                            : `${currentColor}20`,
                      }}
                    >
                      <FiCheckCircle
                        className="text-lg"
                        style={{ color: currentColor }}
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Jawaban Benar
                      </p>
                      <p className="font-semibold dark:text-gray-200">
                        {item.jumlahJawabanBenar}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-600">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <FiBook className="mr-2 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {item.pelajaran ? item.pelajaran.pelajaran : "-"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDateTime(item.updatedAt)}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                  <button
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
                    style={buttonStyle}
                    onClick={() => handleKerjakanLagi(item.id)}
                  >
                    Kerjakan Lagi
                  </button>
                  
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium border transition-all hover:bg-gray-100 dark:hover:bg-gray-600"
                    style={{ borderColor: currentColor, color: currentColor }}
                    onClick={() => handleViewNilaiSaya(item.id)}
                  >
                    Detail
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NilaiSaya;