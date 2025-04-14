import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/authSlice";
import { useStateContext } from "../../contexts/ContextProvider";
import { FiSearch, FiEye, FiTrash2 } from "react-icons/fi";

const ListDataNilai = () => {
  const [nilai, setNilai] = useState([]);
  const [filteredNilai, setFilteredNilai] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
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
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    // Apply search filter
    if (nilai.length > 0) {
      const filtered = nilai.filter((item) => {
        const siswaNama = item.siswa ? item.siswa.nama.toLowerCase() : "";
        const mataPelajaran = item.pelajaran ? item.pelajaran.pelajaran.toLowerCase() : "";
        const kelas = item.kelas ? item.kelas.kelas.toString().toLowerCase() : "";
        const level = item.level ? item.level.toLowerCase() : "";
  
        return (
          siswaNama.includes(searchQuery.toLowerCase()) ||
          mataPelajaran.includes(searchQuery.toLowerCase()) ||
          kelas.includes(searchQuery.toLowerCase()) ||
          level.includes(searchQuery.toLowerCase())
        );
      });
  
      setFilteredNilai(filtered);
    }
  }, [nilai, searchQuery]);
  

  const getNilai = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:5000/nilai", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNilai(response.data);
      setFilteredNilai(response.data);
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
    await axios.delete(`http://localhost:5000/nilai/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    getNilai();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Tidak Tersedia';
  
    try {
      const date = new Date(dateString);
  
      if (isNaN(date.getTime())) {
        return 'Waktu Tidak Valid';
      }
  
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
  
      return `${formattedDate}, ${formattedTime}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Tidak Tersedia';
    }
  };

  return (
    <div className="p-6 space-y-8 dark:bg-gray-900 mt-5">
      <div className="rounded-xl p-6 mb-8" style={{ background: currentMode === "Dark" ? `linear-gradient(135deg, ${currentColor}20 0%, ${currentColor}40 100%)` : `linear-gradient(135deg, ${currentColor}10 0%, ${currentColor}30 100%)` }}>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Data Nilai Siswa
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
          Lihat riwayat nilai siswa dari setiap soal yang sudah dikerjakan. Cari berdasarkan nama siswa.
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
              boxShadow: searchQuery ? `0 0 0 2px ${currentColor}20` : 'none'
            }}
          />
          <FiSearch 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Nama Siswa
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Mata Pelajaran
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Kelas
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Skor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Level
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Jumlah Soal
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Jawaban Benar
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tanggal
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredNilai.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
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
                      {item.kelas ? item.kelas.kelas : "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.skor}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.level === "High" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                        : item.level === "Medium"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}>
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
    </div>
  );
};

export default ListDataNilai;
