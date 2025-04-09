import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/authSlice";
import { useStateContext } from "../../contexts/ContextProvider";
import {
  FiClock,
  FiBook,
  FiAward,
  FiPlus,
  FiEye,
  FiHeadphones,
  FiActivity,
  FiFilter,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

const ListModulBelajar = () => {
  const [gayaBelajar, setGayaBelajar] = useState("");
  const [modul, setModul] = useState([]);
  const [filteredModul, setFilteredModul] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const baseFilters = ["All", "Kelas 10", "Kelas 11", "Kelas 12"];

  const styleFilters = ["Kinestetik", "Auditori", "Visual"];

  const { user } = useSelector((state) => state.auth);

  // Get visible filters based on user role
  const filters =
    user && user.role === "siswa"
      ? baseFilters
      : [...baseFilters, ...styleFilters];

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
      if (user && user.role === "admin") {
        getModul();
      } else if (user && user.role === "siswa") {
        checkGayaBelajarSiswa();
      } else {
        getModul();
      }
    } else {
      navigate("/");
    }
  }, [navigate, user]);

  // Apply filter when activeFilter or modul changes
  useEffect(() => {
    filterModul(activeFilter);
  }, [activeFilter, modul]);

  const getModul = async (studentLearningStyle = null) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:5000/modul", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      let modulData = response.data;
  
      // If a learning style is provided (for students), filter modules
      if (studentLearningStyle) {
        modulData = modulData.filter(
          (modul) => 
            modul.type.toLowerCase() === studentLearningStyle.toLowerCase()
        );
      }
  
      setModul(modulData);
      setFilteredModul(modulData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const checkGayaBelajarSiswa = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:5000/profile-siswa", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const gayaBelajar = response.data.data.gayaBelajar;
      setGayaBelajar(gayaBelajar);

      // Check if gayaBelajar is null and show modal if it is
      if (response.data.data.gayaBelajar === null) {
        setShowModal(true);
        setModalMessage(
          "Gaya Belajar Anda belum dibuat. Silakan isi kuesioner untuk melanjutkan."
        );
      } else {
        getModul(gayaBelajar);
      }
    } catch (error) {
      console.error("Error fetching siswa profile:", error);
      // If 404 error (profile not found), show modal
      if (error.response && error.response.status === 404) {
        setShowModal(true);
        setModalMessage(
          "Gaya Belajar Anda belum dibuat. Silakan isi kuesioner untuk melanjutkan."
        );
      }
    }
  };

  // Function to filter modules based on selected filter
  const filterModul = (filter) => {
    if (filter === "All") {
      setFilteredModul(modul);
      return;
    }

    let result = [];

    // Filter by class
    if (filter.startsWith("Kelas")) {
      const classNumber = filter.split(" ")[1]; // Extract the class number (10, 11, 12)

      result = modul.filter((item) => {
        // Check if kelas.kelas contains the class number
        if (item.kelas && item.kelas.kelas) {
          // Handle different class name formats (e.g., "X", "XI", "XII" or "10", "11", "12")
          const kelasStr = String(item.kelas.kelas);

          if (
            classNumber === "10" &&
            (kelasStr.indexOf("10") !== -1 || kelasStr.indexOf("X") !== -1)
          ) {
            return true;
          } else if (
            classNumber === "11" &&
            (kelasStr.indexOf("11") !== -1 || kelasStr.indexOf("XI") !== -1)
          ) {
            return true;
          } else if (
            classNumber === "12" &&
            (kelasStr.indexOf("12") !== -1 || kelasStr.indexOf("XII") !== -1)
          ) {
            return true;
          }
        }
        return false;
      });
    }
    // Filter by learning style
    else {
      result = modul.filter(
        (item) => item.type && item.type.toLowerCase() === filter.toLowerCase()
      );
    }

    setFilteredModul(result);
  };

  const handleModalConfirm = () => {
    // Navigate to the learning style questionnaire
    navigate("/tes-gaya-belajar");
  };

  const handleViewSubModul = (id) => {
    navigate(`/list-sub-modul-belajar/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/modul-belajar/edit/${id}`);
  };

  const handleDeleteModul = async (userId) => {
    const token = localStorage.getItem("accessToken");
    await axios.delete(`http://localhost:5000/modul/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    getModul();
  };

  // Filter change handler
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

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
    <div className="p-6 space-y-8 dark:bg-gray-900 mt-5">
      {/* Header section with gradient background */}
      <div className="rounded-xl p-6 mb-8" style={gradientStyle}>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Daftar Modul Pembelajaran
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
          Temukan modul pembelajaran yang sesuai dengan gaya belajar dan
          kebutuhan Anda. Dari dasar hingga lanjutan, semua dirancang untuk
          memaksimalkan pengalaman belajar.
        </p>
      </div>

      {/* Only show "Tambah Modul" button if user is not a student */}
      {user && user.role !== "siswa" && (
        <div>
          <button
            className="inline-flex items-center px-5 py-2.5 rounded-lg text-white font-medium shadow-sm hover:shadow-md transition-all"
            style={buttonStyle}
            onClick={() => navigate("/modul-belajar/tambah-modul-belajar")}
          >
            <FiPlus className="mr-2" />
            Tambah Modul
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex mb-6 overflow-x-auto gap-2">
        <button
          className="px-4 py-2 rounded-lg flex items-center shadow-sm"
          style={{ backgroundColor: currentColor, color: "white" }}
        >
          <FiFilter className="mr-2" /> Filter
        </button>

        {filters.map((filter) => (
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

      {/* Show message if no modules match filter */}
      {filteredModul.length === 0 && !loading ? (
        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center">
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Tidak ada modul yang sesuai dengan filter "{activeFilter}"
          </p>
          <button
            className="mt-4 px-4 py-2 text-sm rounded-lg"
            style={{ backgroundColor: currentColor, color: "white" }}
            onClick={() => setActiveFilter("All")}
          >
            Tampilkan Semua
          </button>
        </div>
      ) : (
        /* Cards Grid */
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredModul.map((modul, index) => {
            // Menentukan ikon dan warna gaya belajar
            let gayaBelajarIcon;
            let badgeClass;
            let hoverClass;

            switch (modul.type.toLowerCase()) {
              case "visual":
                gayaBelajarIcon = <FiEye className="mr-2" />;
                badgeClass =
                  currentMode === "Dark"
                    ? "bg-indigo-900 bg-opacity-30 text-indigo-300 border border-indigo-800"
                    : "bg-indigo-100 text-indigo-800 border border-indigo-200";
                hoverClass =
                  currentMode === "Dark"
                    ? "hover:border-indigo-700"
                    : "hover:border-indigo-300";
                break;
              case "auditori":
                gayaBelajarIcon = <FiHeadphones className="mr-2" />;
                badgeClass =
                  currentMode === "Dark"
                    ? "bg-purple-900 bg-opacity-30 text-purple-300 border border-purple-800"
                    : "bg-purple-100 text-purple-800 border border-purple-200";
                hoverClass =
                  currentMode === "Dark"
                    ? "hover:border-purple-700"
                    : "hover:border-purple-300";
                break;
              case "kinestetik":
                gayaBelajarIcon = <FiActivity className="mr-2" />;
                badgeClass =
                  currentMode === "Dark"
                    ? "bg-green-900 bg-opacity-30 text-green-300 border border-green-800"
                    : "bg-green-100 text-green-800 border border-green-200";
                hoverClass =
                  currentMode === "Dark"
                    ? "hover:border-green-700"
                    : "hover:border-green-300";
                break;
              default:
                gayaBelajarIcon = null;
                badgeClass =
                  currentMode === "Dark"
                    ? "bg-gray-800 text-gray-300 border border-gray-700"
                    : "bg-gray-100 text-gray-800 border border-gray-200";
                hoverClass =
                  currentMode === "Dark"
                    ? "hover:border-gray-600"
                    : "hover:border-gray-300";
            }

            return (
              <div
                key={index}
                className={`rounded-xl overflow-hidden border dark:border-gray-700 shadow-sm ${hoverClass} transition-all duration-300 hover:shadow-md bg-white dark:bg-gray-800 flex flex-col`}
              >
                {/* Card Header with color */}
                <div
                  className="h-3"
                  style={{ backgroundColor: currentColor }}
                ></div>

                <div className="p-5 flex-grow">
                  {/* Badge for learning style */}
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-2 ${badgeClass}`}
                  >
                    {gayaBelajarIcon}
                    <span className="capitalize">{modul.type}</span>
                  </div>

                  {/* Title and description */}
                  <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">
                    {modul.judul}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                    {modul.deskripsi}
                  </p>

                  {/* Stats with improved visuals */}
                  <div className="grid grid-cols-2 gap-4">
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
                        <FiClock
                          className="text-lg"
                          style={{ color: currentColor }}
                        />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Durasi
                        </p>
                        <p className="font-semibold dark:text-gray-200">
                          {modul.durasi}{" "}
                          {!modul.durasi.includes("jam") && "Jam"}
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
                        <FiAward
                          className="text-lg"
                          style={{ color: currentColor }}
                        />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Tingkat
                        </p>
                        <p className="font-semibold dark:text-gray-200">
                          Kelas {modul.kelas ? modul.kelas.kelas : "-"}
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
                        {modul.pelajaran ? modul.pelajaran.pelajaran : "-"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center">
                    {/* Edit and Delete buttons - only visible for non-students */}
                    {user && user.role !== "siswa" ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(modul.id)}
                          className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-sm font-medium flex items-center transition-all hover:bg-amber-600"
                        >
                          <FiEdit2 className="mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteModul(modul.id)}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium flex items-center transition-all hover:bg-red-600"
                        >
                          <FiTrash2 className="mr-1" />
                          Hapus
                        </button>
                      </div>
                    ) : (
                      // Empty div to maintain flex layout when buttons are hidden
                      <div></div>
                    )}

                    {/* View Details button - always visible */}
                    <button
                      className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
                      style={buttonStyle}
                      onClick={() => handleViewSubModul(modul.id)}
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Learning Styles Info Card */}
      <div className="mt-10 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-1" style={{ backgroundColor: currentColor }}></div>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div
              className="p-2 rounded-full mr-3"
              style={{
                backgroundColor:
                  currentMode === "Dark"
                    ? `${currentColor}40`
                    : `${currentColor}20`,
              }}
            >
              <svg
                className="h-6 w-6"
                style={{ color: currentColor }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              Memahami Gaya Belajar
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div
              className={`p-4 rounded-lg ${
                currentMode === "Dark"
                  ? "bg-gray-700 border border-indigo-800"
                  : "bg-indigo-50 border border-indigo-100"
              }`}
            >
              <div className="flex items-center mb-3">
                <FiEye
                  className={`${
                    currentMode === "Dark"
                      ? "text-indigo-300"
                      : "text-indigo-600"
                  } mr-2 text-lg`}
                />
                <h4
                  className={`font-bold ${
                    currentMode === "Dark"
                      ? "text-indigo-300"
                      : "text-indigo-700"
                  }`}
                >
                  Visual
                </h4>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Pembelajar visual belajar terbaik melalui pengamatan, diagram,
                dan materi visual. Mereka memproses informasi dengan baik
                melalui grafik, bagan, dan gambaran visual.
              </p>
            </div>

            <div
              className={`p-4 rounded-lg ${
                currentMode === "Dark"
                  ? "bg-gray-700 border border-purple-800"
                  : "bg-purple-50 border border-purple-100"
              }`}
            >
              <div className="flex items-center mb-3">
                <FiHeadphones
                  className={`${
                    currentMode === "Dark"
                      ? "text-purple-300"
                      : "text-purple-600"
                  } mr-2 text-lg`}
                />
                <h4
                  className={`font-bold ${
                    currentMode === "Dark"
                      ? "text-purple-300"
                      : "text-purple-700"
                  }`}
                >
                  Auditori
                </h4>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Pembelajar auditori mengandalkan pendengaran dan berbicara untuk
                belajar. Mereka belajar dengan baik dari diskusi, ceramah, dan
                penjelasan secara lisan.
              </p>
            </div>

            <div
              className={`p-4 rounded-lg ${
                currentMode === "Dark"
                  ? "bg-gray-700 border border-green-800"
                  : "bg-green-50 border border-green-100"
              }`}
            >
              <div className="flex items-center mb-3">
                <FiActivity
                  className={`${
                    currentMode === "Dark" ? "text-green-300" : "text-green-600"
                  } mr-2 text-lg`}
                />
                <h4
                  className={`font-bold ${
                    currentMode === "Dark" ? "text-green-300" : "text-green-700"
                  }`}
                >
                  Kinestetik
                </h4>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Pembelajar kinestetik belajar dengan melakukan langsung atau
                gerakan fisik. Mereka memahami konsep dengan praktik langsung,
                eksperimen, dan aktivitas hands-on.
              </p>
            </div>
          </div>
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
                  onClick={() => navigate(-1)}
                >
                  KEMBALI
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListModulBelajar;
