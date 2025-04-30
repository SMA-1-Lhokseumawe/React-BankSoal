import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/authSlice";
import { useStateContext } from "../../contexts/ContextProvider";

const HasilTes = () => {
  const [learningStyle, setLearningStyle] = useState(null);
  const [persentaseVisual, setPersentaseVisual] = useState(null);
  const [persentaseAuditori, setPersentaseAuditori] = useState(null);
  const [persentaseKinestetik, setPersentaseKinestetik] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const { currentColor } = useStateContext();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      getProfileSiswa();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const getProfileSiswa = async () => {
    setIsLoading(true);
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
        setLearningStyle(profileData.gayaBelajar);
        setPersentaseVisual(profileData.persentaseVisual);
        setPersentaseAuditori(profileData.persentaseAuditori);
        setPersentaseKinestetik(profileData.persentaseKinestetik);
      } else {
        console.error("Format data tidak sesuai:", response.data);
      }
    } catch (error) {
      console.error("Error mengambil profile siswa:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLearningStyleDescription = () => {
    if (learningStyle === "Kinestetik") {
      return 'Gaya belajar kinestetik dapat belajar paling baik dengan berinteraksi atau mengalami hal-hal di sekitarnya. Kamu lebih cenderung mampu memahami dengan adanya keterlibatan langsung, daripada mendengarkan ceramah atau membaca dari sebuah buku. Gaya belajar kinestetik suka melakukan hal-hal dan menggunakan tubuh mereka untuk mengingat fakta, seperti "memanggil" (dialing) nomor telepon pada telpon genggam mereka. Gaya belajar kinestetik, berarti belajar dengan menyentuh dan melakukan.';
    } else if (learningStyle === "Auditori") {
      return "Gaya belajar auditori adalah gaya belajar dengan cara mendengar, yang memberikan penekanan pada segala jenis bunyi dan kata, baik yang diciptakan maupun yang diingat. Gaya pembelajar auditori adalah dimana seseorang lebih cepat menyerap informasi melalui apa yang ia dengarkan. Penjelasan tertulis akan lebih mudah ditangkap oleh para pembelajar auditori ini.";
    } else if (learningStyle === "Visual") {
      return "Gaya belajar visual menyerap informasi terkait dengan visual, warna, gambar, peta, diagram dan belajar dari apa yang dilihat oleh mata. Artinya bukti-bukti konkret harus diperlihatkan terlebih dahulu agar mereka paham, gaya belajar seperti ini mengandalkan penglihatan atau melihat dulu buktinya untuk kemudian mempercayainya.";
    } else {
      return "Belum ada data gaya belajar yang tersedia.";
    }
  };

  // Button style
  const buttonStyle = {
    backgroundColor: currentColor,
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Tes Gaya Belajar
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            Jawablah pertanyaan berikut ini sesuai dengan tingkat kecocokan
            berdasarkan kondisimu saat ini
          </p>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="relative">
              <div className="overflow-hidden h-3 text-xs flex rounded-full bg-blue-200 dark:bg-gray-700">
                <div
                  style={{ width: "100%", backgroundColor: currentColor }}
                  className="rounded-full transition-all duration-500 ease-in-out"
                ></div>
              </div>
              <div className="text-right mt-1 text-sm text-gray-600 dark:text-gray-400">
                3/3
              </div>
            </div>
          </div>
        </div>

        {/* Results Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-8">
          {/* Trophy Icon */}
          <div className="flex justify-center mb-8">
            <img
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmYzEwNyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItYXdhcmQiPjxjaXJjbGUgY3g9IjEyIiBjeT0iOCIgcj0iNyI+PC9jaXJjbGU+PHBhdGggZD0iTTguMjEgMTMuODlMNyAyM2w1LTMgNSAzLTEuMjEtOS4xMiI+PC9wYXRoPjwvc3ZnPg=="
              alt="Trophy"
              className="w-24 h-24"
            />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Kamu termasuk tipe
            </h2>

            {/* Learning Style */}
            <div className="mt-4 flex flex-col items-center">
              {learningStyle === "Auditori" && (
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.465a5 5 0 001.414 1.414m-.282-9.9a9 9 0 0112.728 0"
                    />
                  </svg>
                </div>
              )}

              <h1
                className="text-5xl font-bold mb-2"
                style={{ color: currentColor }}
              >
                {learningStyle}
              </h1>
            </div>

            {/* Description */}
            <p className="mt-6 text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              {getLearningStyleDescription()}
            </p>
          </div>

          {/* Result Chart */}
          <div className="mt-12 bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              Distribusi Gaya Belajar
            </h3>

            <div className="flex justify-center space-x-8 md:space-x-16">
              {/* Visual */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-16 h-16 flex items-center justify-center rounded-full ${
                    parseInt(persentaseVisual) >=
                      parseInt(persentaseAuditori) &&
                    parseInt(persentaseVisual) >= parseInt(persentaseKinestetik)
                      ? ""
                      : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                  }`}
                  style={
                    parseInt(persentaseVisual) >=
                      parseInt(persentaseAuditori) &&
                    parseInt(persentaseVisual) >= parseInt(persentaseKinestetik)
                      ? { backgroundColor: currentColor + "40" }
                      : {}
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke={
                      parseInt(persentaseVisual) >=
                        parseInt(persentaseAuditori) &&
                      parseInt(persentaseVisual) >=
                        parseInt(persentaseKinestetik)
                        ? currentColor
                        : "currentColor"
                    }
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <p
                  className={`text-3xl font-bold mt-4 ${
                    parseInt(persentaseVisual) >=
                      parseInt(persentaseAuditori) &&
                    parseInt(persentaseVisual) >= parseInt(persentaseKinestetik)
                      ? ""
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                  style={
                    parseInt(persentaseVisual) >=
                      parseInt(persentaseAuditori) &&
                    parseInt(persentaseVisual) >= parseInt(persentaseKinestetik)
                      ? { color: currentColor }
                      : {}
                  }
                >
                  {persentaseVisual}%
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Visual
                </p>
              </div>

              {/* Auditori */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-16 h-16 flex items-center justify-center rounded-full ${
                    parseInt(persentaseAuditori) >=
                      parseInt(persentaseVisual) &&
                    parseInt(persentaseAuditori) >=
                      parseInt(persentaseKinestetik)
                      ? ""
                      : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                  }`}
                  style={
                    parseInt(persentaseAuditori) >=
                      parseInt(persentaseVisual) &&
                    parseInt(persentaseAuditori) >=
                      parseInt(persentaseKinestetik)
                      ? { backgroundColor: currentColor + "40" }
                      : {}
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke={
                      parseInt(persentaseAuditori) >=
                        parseInt(persentaseVisual) &&
                      parseInt(persentaseAuditori) >=
                        parseInt(persentaseKinestetik)
                        ? currentColor
                        : "currentColor"
                    }
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.465a5 5 0 001.414 1.414m-.282-9.9a9 9 0 0112.728 0"
                    />
                  </svg>
                </div>
                <p
                  className={`text-3xl font-bold mt-4 ${
                    parseInt(persentaseAuditori) >=
                      parseInt(persentaseVisual) &&
                    parseInt(persentaseAuditori) >=
                      parseInt(persentaseKinestetik)
                      ? ""
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                  style={
                    parseInt(persentaseAuditori) >=
                      parseInt(persentaseVisual) &&
                    parseInt(persentaseAuditori) >=
                      parseInt(persentaseKinestetik)
                      ? { color: currentColor }
                      : {}
                  }
                >
                  {persentaseAuditori}%
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Auditori
                </p>
              </div>

              {/* Kinestetik */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-16 h-16 flex items-center justify-center rounded-full ${
                    parseInt(persentaseKinestetik) >=
                      parseInt(persentaseVisual) &&
                    parseInt(persentaseKinestetik) >=
                      parseInt(persentaseAuditori)
                      ? ""
                      : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                  }`}
                  style={
                    parseInt(persentaseKinestetik) >=
                      parseInt(persentaseVisual) &&
                    parseInt(persentaseKinestetik) >=
                      parseInt(persentaseAuditori)
                      ? { backgroundColor: currentColor + "40" }
                      : {}
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke={
                      parseInt(persentaseKinestetik) >=
                        parseInt(persentaseVisual) &&
                      parseInt(persentaseKinestetik) >=
                        parseInt(persentaseAuditori)
                        ? currentColor
                        : "currentColor"
                    }
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p
                  className={`text-3xl font-bold mt-4 ${
                    parseInt(persentaseKinestetik) >=
                      parseInt(persentaseVisual) &&
                    parseInt(persentaseKinestetik) >=
                      parseInt(persentaseAuditori)
                      ? ""
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                  style={
                    parseInt(persentaseKinestetik) >=
                      parseInt(persentaseVisual) &&
                    parseInt(persentaseKinestetik) >=
                      parseInt(persentaseAuditori)
                      ? { color: currentColor }
                      : {}
                  }
                >
                  {persentaseKinestetik}%
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Kinestetik
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-3 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
              style={buttonStyle}
            >
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HasilTes;
