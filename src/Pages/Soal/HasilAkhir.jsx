import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getMe } from "../../features/authSlice";
import { useStateContext } from "../../contexts/ContextProvider";
import {
  FiAward,
  FiBarChart2,
  FiCheckCircle,
  FiHome,
  FiRepeat,
} from "react-icons/fi";

const HasilAkhir = () => {
  const [skor, setSkor] = useState("");
  const [level, setLevel] = useState("");
  const [jumlahSoal, setJumlahSoal] = useState("");
  const [jumlahJawabanBenar, setJumlahJawabanBenar] = useState("");
  const [pelajaran, setPelajaran] = useState("");
  const [kelas, setKelas] = useState("");
  const [nama, setNama] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  const { currentColor, currentMode } = useStateContext();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      getNilaiById();
    } else {
      navigate("/");
    }
  }, [navigate]);

  const getNilaiById = async () => {
    const token = localStorage.getItem("accessToken");
    const apiUrl = process.env.REACT_APP_URL_API;
    const response = await axios.get(`${apiUrl}/nilai/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setSkor(response.data.skor);
    setLevel(response.data.level);
    setJumlahSoal(response.data.jumlahSoal);
    setJumlahJawabanBenar(response.data.jumlahJawabanBenar);
    setKelas(response.data.kelas.kelas);
    setPelajaran(response.data.pelajaran.pelajaran);
    setNama(response.data.siswa.nama)
    setUpdatedAt(formatDateTime(response.data.updatedAt));
  };

  const getSkillLevel = () => {
    if (level === "Low") return { color: "#EF4444", level: "Rendah" }; // Red for Low
    if (level === "Medium") return { color: "#F59E0B", level: "Sedang" }; // Yellow for Medium
    if (level === "High") return { color: "#10B981", level: "Tinggi" }; // Green for High
    return { color: "#6B7280", level: "Tidak Diketahui" }; // Gray for unknown
  };

  const skillLevel = getSkillLevel();

  // Animated counter effect
  const Counter = ({ value, duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const increment = value / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        setCount(Math.floor(start));

        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        }
      }, 16);

      return () => clearInterval(timer);
    }, [value, duration]);

    return <span>{count}</span>;
  };

  const handleBackToHome = () => {
    navigate("/dashboard");
  };

  const handleTryAgain = () => {
    navigate("/quiz");
  };

  // Gradient background style
  const gradientStyle = {
    background:
      currentMode === "Dark"
        ? `linear-gradient(135deg, ${currentColor}20 0%, ${currentColor}40 100%)`
        : `linear-gradient(135deg, ${currentColor}10 0%, ${currentColor}30 100%)`,
  };

  // Button style
  const buttonStyle = {
    backgroundColor: currentColor,
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
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div
          className="p-6 border-b border-gray-200 dark:border-gray-700"
          style={gradientStyle}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white text-center">
            Hasil Akhir Quiz
          </h1>
        </div>

        {/* Results Overview */}
        <div className="px-6 py-8">
          {/* Score Percentage - Big Circle */}
          <div className="flex justify-center mb-8">
            <div
              className="relative w-48 h-48 flex items-center justify-center rounded-full border-8"
              style={{ borderColor: skillLevel.color }}
            >
              <div className="text-center">
                <h2
                  className="text-4xl font-bold mb-1"
                  style={{ color: skillLevel.color }}
                >
                  <Counter value={skor} />%
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Skor Anda
                </p>
              </div>
            </div>
          </div>

          {/* Skill Level */}
          <div className="text-center mb-10">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              Tingkat Kemampuan Anda
            </h3>
            <div
              className="inline-block py-2 px-5 rounded-full text-white font-medium text-lg"
              style={{ backgroundColor: skillLevel.color }}
            >
              {level}
            </div>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Tingkat kemampuan anda di pelajaran {pelajaran}{" "}
              {kelas ? `kelas ${kelas}` : ""} yaitu{" "}
              <span className="font-medium" style={{ color: skillLevel.color }}>
                {level}
              </span>
            </p>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Correct Answers */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${currentColor}20` }}
                >
                  <FiCheckCircle
                    className="w-6 h-6"
                    style={{ color: currentColor }}
                  />
                </div>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
                <Counter value={jumlahJawabanBenar} duration={1500} /> / {jumlahSoal}
              </h4>
              <p className="text-gray-500 dark:text-gray-400">Jawaban Benar</p>
            </div>

            {/* Score Percentage */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${currentColor}20` }}
                >
                  <FiBarChart2
                    className="w-6 h-6"
                    style={{ color: currentColor }}
                  />
                </div>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
                <Counter value={skor} duration={1500} />%
              </h4>
              <p className="text-gray-500 dark:text-gray-400">
                Persentase Skor
              </p>
            </div>

            {/* Skill Level */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${currentColor}20` }}
                >
                  <FiAward
                    className="w-6 h-6"
                    style={{ color: currentColor }}
                  />
                </div>
              </div>
              <h4
                className="text-xl font-semibold mb-1"
                style={{ color: skillLevel.color }}
              >
                {level}
              </h4>
              <p className="text-gray-500 dark:text-gray-400">
                Tingkat Kemampuan
              </p>
            </div>
          </div>

          {/* Meta Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                  Pelajaran
                </p>
                <p className="font-medium text-gray-800 dark:text-white">
                  {pelajaran}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                  Kelas
                </p>
                <p className="font-medium text-gray-800 dark:text-white">
                  {kelas ? `Kelas ${kelas}` : "Tidak Tersedia"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                  Jumlah Soal
                </p>
                <p className="font-medium text-gray-800 dark:text-white">
                  {jumlahSoal} Soal
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                  Waktu Pengerjaan
                </p>
                <p className="font-medium text-gray-800 dark:text-white">
                  {updatedAt}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row justify-center space-y-3 md:space-y-0 md:space-x-4">
            <button
              onClick={handleBackToHome}
              className="flex items-center justify-center px-6 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            >
              <FiHome className="mr-2" />
              Kembali ke Beranda
            </button>
            <button
              onClick={handleTryAgain}
              className="flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-all"
              style={buttonStyle}
            >
              <FiRepeat className="mr-2" />
              Coba Quiz Lain
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Note */}
      <div className="mt-6 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>
          Terus latih kemampuan anda untuk meningkatkan tingkat penguasaan
          materi.
        </p>
      </div>
    </div>
  );
};

export default HasilAkhir;
