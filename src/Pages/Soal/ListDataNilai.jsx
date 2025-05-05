/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/authSlice";
import { useStateContext } from "../../contexts/ContextProvider";
import { FiSearch, FiEye, FiTrash2 } from "react-icons/fi";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const ListDataNilai = () => {
  const [nilai, setNilai] = useState([]);
  const [filteredNilai, setFilteredNilai] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedGroupDetail, setSelectedGroupDetail] = useState(null);

  const { currentColor, currentMode } = useStateContext();
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      getNilai();
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    // Apply search filter
    if (nilai.length > 0) {
      const filtered = nilai.filter((item) => {
        const siswaNama = item.siswa ? item.siswa.nama.toLowerCase() : "";
        const mataPelajaran = item.pelajaran
          ? item.pelajaran.pelajaran.toLowerCase()
          : "";
        const kelas = item.kelas
          ? item.kelas.kelas.toString().toLowerCase()
          : "";
        const level = item.level ? item.level.toLowerCase() : "";

        return (
          siswaNama.includes(searchQuery.toLowerCase()) ||
          mataPelajaran.includes(searchQuery.toLowerCase()) ||
          kelas.includes(searchQuery.toLowerCase()) ||
          level.includes(searchQuery.toLowerCase())
        );
      });

      setFilteredNilai(filtered);
      setTotalPages(Math.ceil(filtered.length / itemsPerPage));
      // Reset to first page when search changes
      setCurrentPage(1);
    }
  }, [nilai, searchQuery, itemsPerPage]);

  const getNilai = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      const response = await axios.get(`${apiUrl}/nilai`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNilai(response.data);
      setFilteredNilai(response.data);
      setTotalPages(Math.ceil(response.data.length / itemsPerPage));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleViewNilaiSiswa = (id) => {
    navigate(`/nilai-saya/${id}`);
  };

  const handleDeleteNilai = async (id) => {
    const token = localStorage.getItem("accessToken");
    const apiUrl = process.env.REACT_APP_URL_API;
    await axios.delete(`${apiUrl}/nilai/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    getNilai();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Tidak Tersedia";

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "Waktu Tidak Valid";
      }

      const formattedDate = date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const formattedTime = date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      return `${formattedDate}, ${formattedTime}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Tidak Tersedia";
    }
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNilai.slice(indexOfFirstItem, indexOfLastItem);

  // Generate page numbers
  const renderPageNumbers = () => {
    const pageNumbers = [];
    let startPage, endPage;

    if (totalPages <= 5) {
      // Less than 5 total pages, show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // More than 5 total pages, show pagination with ellipsis
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    // Add first page
    if (startPage > 1) {
      pageNumbers.push(
        <a
          key={1}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(1);
          }}
          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        >
          1
        </a>
      );

      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push(
          <span
            key="ellipsis1"
            className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0"
          >
            ...
          </span>
        );
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <a
          key={i}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(i);
          }}
          aria-current={currentPage === i ? "page" : undefined}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
            currentPage === i
              ? "z-10 bg-indigo-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              : "text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          }`}
        >
          {i}
        </a>
      );
    }

    // Add ellipsis if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push(
        <span
          key="ellipsis2"
          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0"
        >
          ...
        </span>
      );
    }

    // Add last page
    if (endPage < totalPages) {
      pageNumbers.push(
        <a
          key={totalPages}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(totalPages);
          }}
          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        >
          {totalPages}
        </a>
      );
    }

    return pageNumbers;
  };

  // Fungsi untuk menangani klik pada tombol eye (lihat detail)
  const handleViewGroupDetail = (group) => {
    setSelectedGroupDetail(group);
    setShowDetailModal(true);
  };

  // Fungsi untuk menutup modal detail
  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedGroupDetail(null);
  };

  return (
    <div className="p-6 space-y-8 dark:bg-gray-900 mt-5">
      <div
        className="rounded-xl p-6 mb-8"
        style={{
          background:
            currentMode === "Dark"
              ? `linear-gradient(135deg, ${currentColor}20 0%, ${currentColor}40 100%)`
              : `linear-gradient(135deg, ${currentColor}10 0%, ${currentColor}30 100%)`,
        }}
      >
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Data Nilai Siswa
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
          Lihat riwayat nilai siswa dari setiap soal yang sudah dikerjakan. Cari
          berdasarkan nama siswa.
        </p>
      </div>

      <div className="flex mb-6 items-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Cari nama, pelajaran, kelas, dan juga level ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
            style={{
              borderColor: currentColor,
              boxShadow: searchQuery ? `0 0 0 2px ${currentColor}20` : "none",
            }}
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {filteredNilai.length === 0 && !loading ? (
        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center">
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Tidak ada nilai yang sesuai dengan pencarian "{searchQuery}"
          </p>
          <button
            className="mt-4 px-4 py-2 text-sm rounded-lg"
            style={{ backgroundColor: currentColor, color: "white" }}
            onClick={() => setSearchQuery("")}
          >
            Hapus Pencarian
          </button>
        </div>
      ) : loading ? (
        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center">
          <p className="text-gray-600 dark:text-gray-300 text-lg">Loading...</p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Nama Siswa
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Mata Pelajaran
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Kelas
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Skor
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Level
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Jumlah Soal
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Jawaban Benar
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Tanggal
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentItems.map((item, index) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-50 dark:bg-gray-700"
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.siswa ? item.siswa.nama : "Tidak Tersedia"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {item.pelajaran ? item.pelajaran.pelajaran : "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {item.kelas ? item.kelas.namaKelas : "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.skor}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.level === "High"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : item.level === "Medium"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {item.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {item.jumlahSoal}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {item.jumlahJawabanBenar}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDateTime(item.updatedAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleViewNilaiSiswa(item.id)}
                        className="flex items-center text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        style={{ color: currentColor }}
                      >
                        <FiEye className="mr-1" />
                      </button>
                      <button
                        className="flex items-center text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        onClick={() => handleDeleteNilai(item.id)}
                      >
                        <FiTrash2 className="mr-1" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Component */}
      {filteredNilai.length > 0 && !loading && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-1 justify-between sm:hidden">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage - 1);
              }}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Previous
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage + 1);
              }}
              className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Next
            </a>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing{" "}
                <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">
                  {indexOfLastItem > filteredNilai.length
                    ? filteredNilai.length
                    : indexOfLastItem}
                </span>{" "}
                of <span className="font-medium">{filteredNilai.length}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                aria-label="Pagination"
                className="isolate inline-flex -space-x-px rounded-md shadow-xs"
              >
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                  className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:ring-gray-700 dark:hover:bg-gray-700 dark:text-gray-400 ${
                    currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <AiOutlineLeft aria-hidden="true" className="size-5" />
                </a>

                {renderPageNumbers()}

                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                  className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:ring-gray-700 dark:hover:bg-gray-700 dark:text-gray-400 ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <AiOutlineRight aria-hidden="true" className="size-5" />
                </a>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* tabel penilaian per kelas */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Rangkuman Penilaian Per Kelas
        </h2>
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Kelas
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Mata Pelajaran
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Total Siswa
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Level Rata-rata
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {(() => {
                // Mengelompokkan data berdasarkan kelas dan pelajaran
                const grouped = {};

                nilai.forEach((item) => {
                  const kelasId = item.kelasId;
                  const pelajaranId = item.pelajaranId;
                  const key = `${kelasId}-${pelajaranId}`;

                  if (!grouped[key]) {
                    grouped[key] = {
                      kelasId,
                      kelasNama:
                        item.siswa && item.siswa.kelas
                          ? item.siswa.kelas.namaKelas
                          : item.kelas
                          ? item.kelas.namaKelas
                          : "Tidak Tersedia",
                      pelajaranId,
                      pelajaranNama: item.pelajaran
                        ? item.pelajaran.pelajaran
                        : "Tidak Tersedia",
                      siswaIds: new Set(),
                      levels: [],
                    };
                  }

                  if (item.siswaId) {
                    grouped[key].siswaIds.add(item.siswaId);
                  }

                  if (item.level) {
                    grouped[key].levels.push(item.level);
                  }
                });

                // Konversi ke array dan format untuk ditampilkan
                const groupedData = Object.values(grouped);

                return groupedData.map((group, index) => {
                  // Menentukan level rata-rata
                  const levelCount = {
                    High: 0,
                    Medium: 0,
                    Low: 0,
                  };

                  group.levels.forEach((level) => {
                    if (levelCount[level] !== undefined) {
                      levelCount[level]++;
                    }
                  });

                  // Menentukan level yang paling sering muncul
                  let maxCount = 0;
                  let dominantLevel = "Low";

                  for (const [level, count] of Object.entries(levelCount)) {
                    if (count > maxCount) {
                      maxCount = count;
                      dominantLevel = level;
                    }
                  }

                  return (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0
                          ? "bg-white dark:bg-gray-800"
                          : "bg-gray-50 dark:bg-gray-700"
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {group.kelasNama}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          {group.pelajaranNama}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          {group.siswaIds.size}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            dominantLevel === "High"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : dominantLevel === "Medium"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {dominantLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleViewGroupDetail(group)}
                            className="flex items-center text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            style={{ color: currentColor }}
                          >
                            <FiEye className="mr-1" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal untuk menampilkan detail siswa */}
      {showDetailModal && selectedGroupDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Detail Siswa Kelas {selectedGroupDetail.kelasNama} -{" "}
                {selectedGroupDetail.pelajaranNama}
              </h3>
              <button
                onClick={handleCloseDetailModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-auto">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Nama Siswa
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Jumlah Soal
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Jawaban Benar
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Skor
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Level
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Tanggal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {nilai
                      .filter(
                        (item) =>
                          // Filter berdasarkan kelas dan pelajaran yang dipilih
                          item.siswa &&
                          item.siswa.kelasId === selectedGroupDetail.kelasId &&
                          item.pelajaranId === selectedGroupDetail.pelajaranId
                      )
                      .map((item, index) => (
                        <tr
                          key={item.id}
                          className={
                            index % 2 === 0
                              ? "bg-white dark:bg-gray-800"
                              : "bg-gray-50 dark:bg-gray-700"
                          }
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {item.siswa ? item.siswa.nama : "Tidak Tersedia"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {item.jumlahSoal}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {item.jumlahJawabanBenar}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {item.skor}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                item.level === "High"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : item.level === "Medium"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              }`}
                            >
                              {item.level}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDateTime(item.updatedAt)}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-right">
              <button
                onClick={handleCloseDetailModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListDataNilai;
