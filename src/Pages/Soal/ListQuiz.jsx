import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/authSlice";
import { useStateContext } from "../../contexts/ContextProvider";
import { FiClock, FiBook, FiAward, FiFilter, FiX } from "react-icons/fi";

const ListQuiz = () => {
  const [groupedSoal, setGroupedSoal] = useState([]);
  const [filteredModul, setFilteredModul] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState({});
  const [showModal, setShowModal] = useState(false);

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
      getSoal();
    } else {
      navigate("/");
    }
  }, [navigate]);

  const getSoal = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      const response = await axios.get(`${apiUrl}/all-soal`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const originalData = response.data;

      // Group the soal data
      const grouped = groupSoalByKelasPelajaran(originalData);
      setGroupedSoal(grouped);
      setFilteredModul(grouped);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const groupSoalByKelasPelajaran = (data) => {
    const groupedData = {};

    data.forEach((item) => {
      const key = `${item.kelasId}-${item.pelajaranId}`;

      if (!groupedData[key]) {
        groupedData[key] = {
          count: 0,
          item: { ...item },
          items: [],
        };
      }

      groupedData[key].count += 1;
      groupedData[key].items.push(item);
    });

    return Object.values(groupedData);
  };

  // Filter change handler
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);

    if (filter === "All") {
      setFilteredModul(groupedSoal);
    } else {
      const filterClass = parseInt(filter.split(" ")[1]);
      const filtered = groupedSoal.filter(
        (item) => item.item.kelas.kelas === filterClass
      );
      setFilteredModul(filtered);
    }
    setSelectedGroup({});
  };

  const handleStartQuiz = () => {
    // Navigate to the StartQuiz page with the selected group data
    console.log("Starting quiz for", selectedGroup);
    
    // Pass selectedGroup to StartQuiz component using navigate state
    navigate('/start-quiz', { 
      state: { 
        groupData: selectedGroup,
        pelajaran: selectedGroup.item.pelajaran.pelajaran,
        kelas: selectedGroup.item.kelas.kelas,
        soalCount: selectedGroup.count,
        soalItems: selectedGroup.items
      } 
    });
    
    // Close the modal after action
    setShowModal(false);
  };

  const openModal = (group) => {
    setSelectedGroup(group);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
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

  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  };

  return (
    <div className="p-6 space-y-8 dark:bg-gray-900 mt-5">
      {/* Header section with gradient background */}
      <div className="rounded-xl p-6 mb-8" style={gradientStyle}>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Daftar Setiap Soal
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
          Temukan soal yang sesuai dengan kelas dan pelajaran. Dari dasar hingga
          lanjutan, semua dirancang untuk menentukan kemampuan siswa pengalaman
          belajar.
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
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredModul.map((group, index) => {
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

                <div className="p-5 flex-grow">
                  {/* Title and description */}
                  <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">
                    Data Soal Pelajaran {group.item.pelajaran.pelajaran}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                    Soal ini memiliki sebanyak {group.count} soal dengan type
                    soal pilihan ganda
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
                          120 menit
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
                          Kelas {group.item.kelas.kelas}
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
                        {group.item.pelajaran
                          ? group.item.pelajaran.pelajaran
                          : "-"}
                      </span>
                    </div>
                    {/* Action Button aligned to the right */}
                    <button
                      className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
                      style={buttonStyle}
                      onClick={() => openModal(group)}
                    >
                      Kerjakan
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Popup */}
      {showModal && (
        <div style={modalOverlayStyle} onClick={closeModal}>
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside modal
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Konfirmasi
              </h3>
              <button 
                onClick={closeModal}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiX className="text-gray-500 dark:text-gray-400" size={24} />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 dark:text-gray-300 text-center mb-2">
                Tekan lanjutkan untuk mengerjakan tugas:
              </p>
              <p className="text-gray-900 dark:text-white font-medium text-center">
                {selectedGroup.item?.pelajaran?.pelajaran} - Kelas {selectedGroup.item?.kelas?.kelas}
              </p>
            </div>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={closeModal}
                className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleStartQuiz}
                className="px-6 py-2 rounded-lg text-white hover:opacity-90 transition-all"
                style={buttonStyle}
              >
                Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListQuiz;