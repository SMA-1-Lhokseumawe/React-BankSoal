/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/authSlice";
import { useStateContext } from "../../contexts/ContextProvider";
import {
  FiClock,
  FiBook,
  FiAward,
  FiPlus,
  FiFilter,
  FiChevronLeft,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";

const ListDataSoal = () => {
  const [groupedSoal, setGroupedSoal] = useState([]);
  const [filteredModul, setFilteredModul] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);

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
      const response = await axios.get(`${apiUrl}/soal`, {
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

    // Reset detail view when changing filters
    setShowDetailView(false);
    setSelectedGroup(null);
  };

  // Handle viewing detail table
  const handleViewDetail = (group) => {
    setSelectedGroup(group);
    setShowDetailView(true);
    // Scroll to top when showing detail view
    window.scrollTo(0, 0);
  };

  // Return to card grid view
  const handleBackToGrid = () => {
    setShowDetailView(false);
    setSelectedGroup(null);
  };

  // Dynamic stylings
  const gradientStyle = {
    background:
      currentMode === "Dark"
        ? `linear-gradient(135deg, ${currentColor}20 0%, ${currentColor}40 100%)`
        : `linear-gradient(135deg, ${currentColor}10 0%, ${currentColor}30 100%)`,
  };

  const buttonStyle = {
    backgroundColor: currentColor,
  };

  const handleDeleteSoal = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      await axios.delete(`${apiUrl}/soal/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Update the state directly
      const updatedGroupedSoal = groupedSoal.map(group => ({
        ...group,
        count: group.count - group.items.filter(item => item.id === id).length,
        items: group.items.filter(item => item.id !== id)
      })).filter(group => group.count > 0);
  
      setGroupedSoal(updatedGroupedSoal);
      setFilteredModul(updatedGroupedSoal);
  
      // If the current selected group is affected, update it
      if (selectedGroup) {
        const updatedSelectedGroup = {
          ...selectedGroup,
          count: selectedGroup.items.filter(item => item.id !== id).length,
          items: selectedGroup.items.filter(item => item.id !== id)
        };
  
        if (updatedSelectedGroup.count > 0) {
          setSelectedGroup(updatedSelectedGroup);
        } else {
          // If no items left, go back to grid view
          setShowDetailView(false);
          setSelectedGroup(null);
        }
      }
    } catch (error) {
      console.error("Error deleting soal:", error);
      // Optionally show an error message to the user
    }
  };

  const handleEditSoal = (id) => {
    navigate(`/data-soal/${id}`);
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

      <div className="flex items-center justify-between">
        {showDetailView ? (
          <button
            className="inline-flex items-center px-5 py-2.5 rounded-lg text-white font-medium shadow-sm hover:shadow-md transition-all"
            style={buttonStyle}
            onClick={handleBackToGrid}
          >
            <FiChevronLeft className="mr-2" />
            Kembali
          </button>
        ) : (
          <button
            className="inline-flex items-center px-5 py-2.5 rounded-lg text-white font-medium shadow-sm hover:shadow-md transition-all"
            style={buttonStyle}
            onClick={() => navigate("/data-soal/tambah")}
          >
            <FiPlus className="mr-2" />
            Tambah Soal
          </button>
        )}

        {showDetailView && (
          <button
            className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
            style={buttonStyle}
          >
            Export Data
          </button>
        )}
      </div>

      {/* Only show filters in grid view */}
      {!showDetailView && (
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
      )}

      {/* Conditional rendering based on view state */}
      {showDetailView && selectedGroup ? (
        /* Detail Table View */
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Detail Soal - {selectedGroup.item.pelajaran.pelajaran} Kelas{" "}
              {selectedGroup.item.kelas.kelas}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Total Soal:{" "}
              <span className="font-medium">{selectedGroup.count}</span> |
              Pelajaran:{" "}
              <span className="font-medium">
                {selectedGroup.item.pelajaran.pelajaran}
              </span>{" "}
              | Kelas:{" "}
              <span className="font-medium">
                {selectedGroup.item.kelas.kelas}
              </span>
            </p>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-white dark:bg-gray-700">
                    ID
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-white dark:bg-gray-700">
                    Soal
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-white dark:bg-gray-700">
                    Pilihan A
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-white dark:bg-gray-700">
                    Pilihan B
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-white dark:bg-gray-700">
                    Pilihan C
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-white dark:bg-gray-700">
                    Pilihan D
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-white dark:bg-gray-700">
                    Pilihan E
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-white dark:bg-gray-700">
                    Jawaban Benar
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-white dark:bg-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedGroup.items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:text-white dark:bg-gray-800">
                      {index + 1}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:text-white dark:bg-gray-800">
                      <div className="line-clamp-2">
                        {typeof item.soal === "string"
                          ? item.soal.includes('{"ops":')
                            ? "Soal dengan gambar/format khusus"
                            : item.soal
                          : "Format soal tidak valid"}
                      </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:text-white dark:bg-gray-800">
                      <div className="line-clamp-1">{item.optionA}</div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:text-white dark:bg-gray-800">
                      <div className="line-clamp-1">{item.optionB}</div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:text-white dark:bg-gray-800">
                      <div className="line-clamp-1">{item.optionC}</div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:text-white dark:bg-gray-800">
                      <div className="line-clamp-1">{item.optionD}</div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:text-white dark:bg-gray-800">
                      <div className="line-clamp-1">{item.optionE}</div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:text-white dark:bg-gray-800">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${currentColor}20`,
                          color: currentColor,
                        }}
                      >
                        {item.correctAnswer}
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:text-white dark:bg-gray-800">
                      <div className="flex items-center space-x-3">
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => handleEditSoal(item.id)}
                        >
                          <FiEdit />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteSoal(item.id)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards Grid View */
        <>
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
                        Soal ini memiliki sebanyak {group.count} soal dengan
                        type soal pilihan ganda
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
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-between items-center">
                        {/* View Details button - always visible */}
                        <button
                          className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
                          style={buttonStyle}
                          onClick={() => handleViewDetail(group)}
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
        </>
      )}
    </div>
  );
};

export default ListDataSoal;
