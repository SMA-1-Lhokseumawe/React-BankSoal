import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/authSlice";
import { useStateContext } from "../../contexts/ContextProvider";

const AddModulBelajar = () => {
  const [kelasList, setKelasList] = useState([]);
  const [pelajaranList, setPelajaranList] = useState([]);
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [durasi, setDurasi] = useState("");
  const [kelasId, setKelasId] = useState("");
  const [pelajaranId, setPelajaranId] = useState("");
  const [type, setType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { currentColor } = useStateContext();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      getKelas();
      getPelajaran();
    } else {
      navigate("/");
    }
  }, [navigate]);

  const getKelas = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      const response = await axios.get(`${apiUrl}/kelas`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to headers
        },
      });
      setKelasList(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getPelajaran = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      const response = await axios.get(`${apiUrl}/pelajaran`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to headers
        },
      });
      setPelajaranList(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const saveModul = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const jsonData = {
      judul: judul,
      deskripsi: deskripsi,
      durasi: durasi,
      kelasId: kelasId,
      pelajaranId: pelajaranId,
      type: type,
    };
  
    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      const response = await axios.post(`${apiUrl}/modul`, jsonData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      // Ambil ID modul dari respons API
      const modulId = response.data.id;
      
      // Navigasi ke halaman add-sub-modul-belajar dengan parameter modulId
      navigate("/sub-modul-belajar/tambah-sub-modul-belajar", { state: { modulId: modulId } });
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b mt-5 from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full mx-auto">
        <div className="bg-white dark:bg-secondary-dark-bg rounded-xl shadow-lg overflow-hidden mx-8">
          {/* Header */}
          <div className="py-4 px-6" style={{ backgroundColor: currentColor }}>
            <h1 className="text-xl font-bold text-white">Tambah Modul Baru</h1>
          </div>

          {/* Form */}
          <div className="p-10">
            <form onSubmit={saveModul} className="space-y-8">
              <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Judul Modul
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="judul"
                    required
                    placeholder="Judul"
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none transition duration-150"
                    style={{
                      boxShadow: `0 0 0 1px ${currentColor}`,
                      borderColor: currentColor,
                      focus: {
                        outline: "none",
                        boxShadow: `0 0 0 2px ${currentColor}`,
                        borderColor: currentColor,
                      },
                    }}
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Masukkan judul modul
                </p>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 mt-5">
                  Deskripsi
                </label>
                <div className="relative rounded-md shadow-sm">
                  <textarea
                    name="deskripsi"
                    required
                    placeholder="Deskripsi"
                    rows="4"
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none transition duration-150"
                    style={{
                      boxShadow: `0 0 0 1px ${currentColor}`,
                      borderColor: currentColor,
                      focus: {
                        outline: "none",
                        boxShadow: `0 0 0 2px ${currentColor}`,
                        borderColor: currentColor,
                      },
                    }}
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Masukkan deskripsi
                </p>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 mt-5">
                  Waktu Durasi Belajar
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="durasi"
                    required
                    placeholder="Contoh: B.Indonesia, IPA, IPS"
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none transition duration-150"
                    style={{
                      boxShadow: `0 0 0 1px ${currentColor}`,
                      borderColor: currentColor,
                      focus: {
                        outline: "none",
                        boxShadow: `0 0 0 2px ${currentColor}`,
                        borderColor: currentColor,
                      },
                    }}
                    value={durasi}
                    onChange={(e) => setDurasi(e.target.value)}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Masukkan Estimasi Waktu Belajar
                </p>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 mt-5">
                  Pilih Kelas
                </label>
                <div className="relative rounded-md shadow-sm">
                  <select
                    name="kelasId"
                    required
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none transition duration-150"
                    style={{
                      boxShadow: `0 0 0 1px ${currentColor}`,
                      borderColor: currentColor,
                      focus: {
                        outline: "none",
                        boxShadow: `0 0 0 2px ${currentColor}`,
                        borderColor: currentColor,
                      },
                    }}
                    value={kelasId}
                    onChange={(e) => setKelasId(e.target.value)}
                  >
                    <option value="">Pilih Kelas</option>
                    {kelasList.map((kelas) => (
                      <option key={kelas.id} value={kelas.id}>
                        {kelas.kelas}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Pilih kelas untuk pelajaran ini
                </p>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 mt-5">
                  Pilih Pelajaran
                </label>
                <div className="relative rounded-md shadow-sm">
                  <select
                    name="pelajaranId"
                    required
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none transition duration-150"
                    style={{
                      boxShadow: `0 0 0 1px ${currentColor}`,
                      borderColor: currentColor,
                      focus: {
                        outline: "none",
                        boxShadow: `0 0 0 2px ${currentColor}`,
                        borderColor: currentColor,
                      },
                    }}
                    value={pelajaranId}
                    onChange={(e) => setPelajaranId(e.target.value)}
                  >
                    <option value="">Pilih Pelajaran</option>
                    {pelajaranList.map((pelajaran) => (
                      <option key={pelajaran.id} value={pelajaran.id}>
                        {pelajaran.pelajaran}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Pilih pelajaran untuk modul ini
                </p>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 mt-5">
                  Type Gaya Belajar
                </label>
                <div className="relative rounded-md shadow-sm">
                  <select
                    name="type"
                    required
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none transition duration-150"
                    style={{
                      boxShadow: `0 0 0 1px ${currentColor}`,
                      borderColor: currentColor,
                      focus: {
                        outline: "none",
                        boxShadow: `0 0 0 2px ${currentColor}`,
                        borderColor: currentColor,
                      },
                    }}
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="" disabled>
                      Pilih gaya belajar
                    </option>
                    <option value="Visual">Visual</option>
                    <option value="Kinestetik">Kinestetik</option>
                    <option value="Auditori">Auditori</option>
                  </select>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Pilih type gaya belajar
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-8 px-6">
                <button
                  type="button"
                  onClick={() => navigate("/pelajaran")}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                  style={{
                    focus: {
                      boxShadow: `0 0 0 2px ${currentColor}`,
                      borderColor: currentColor,
                    },
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  style={{
                    backgroundColor: currentColor,
                    hover: { backgroundColor: `${currentColor}dd` },
                  }}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Modul"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Card */}
        <div
          className="mt-6 bg-white dark:text-white dark:bg-secondary-dark-bg p-6 rounded-lg shadow mx-8"
          style={{ borderLeft: `4px solid ${currentColor}` }}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 dark:text-white dark:bg-secondary-dark-bg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill={currentColor}
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-700 dark:text-white">
                Penambahan pelajaran baru akan langsung tercatat dalam sistem.
                Pastikan data yang dimasukkan sudah benar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddModulBelajar;
