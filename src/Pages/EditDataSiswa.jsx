import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getMe } from "../features/authSlice";
import { useStateContext } from "../contexts/ContextProvider";

const EditDataSiswa = () => {
  const [kelasList, setKelasList] = useState([]);
  const [nis, setNis] = useState("");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [kelasId, setKelasId] = useState("");
  const [gender, setGender] = useState("");
  const [umur, setUmur] = useState("");
  const [alamat, setAlamat] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { currentColor } = useStateContext();

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      getSiswaById();
      getKelas();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const getKelas = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:5000/all-kelas", {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to headers
        },
      });
      setKelasList(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getSiswaById = async () => {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(`http://localhost:5000/siswa/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setNis(response.data.nis);
    setNama(response.data.nama);
    setEmail(response.data.email);
    setKelasId(response.data.kelasId);
    setGender(response.data.gender);
    setUmur(response.data.umur);
    setAlamat(response.data.alamat);
    setPreview(response.data.url);
  };

  const updateSiswa = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nis", nis);
    formData.append("nama", nama);
    formData.append("email", email);
    formData.append("kelasId", kelasId);
    formData.append("gender", gender);
    formData.append("umur", umur);
    formData.append("alamat", alamat);
    if (file) {
      formData.append("file", file);
    }

    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(`http://localhost:5000/siswa/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/siswa");
    } catch (error) {
      console.log(error);
    }
  };

  const loadImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file); // Correct the typing here
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b mt-5 from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full mx-auto">
        <div className="bg-white dark:bg-secondary-dark-bg rounded-xl shadow-lg overflow-hidden mx-8">
          {/* Header */}
          <div className="py-4 px-6" style={{ backgroundColor: currentColor }}>
            <h1 className="text-xl font-bold text-white">
              Tambah Profile Siswa
            </h1>
          </div>

          {/* Form */}
          <div className="p-10">
            <form onSubmit={updateSiswa} className="space-y-8">
              <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  NIS Siswa
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="nis"
                    required
                    placeholder="123456789"
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
                    value={nis}
                    onChange={(e) => setNis(e.target.value)}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Masukkan NIS Siswa
                </p>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 mt-5">
                  Nama Lengkap
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="nama"
                    required
                    placeholder="John Doe, Jane Doe"
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
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Masukkan Nama Lengkap
                </p>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 mt-5">
                  Email
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="email"
                    required
                    placeholder="nama@sma1lhok.sch.id, nama@gmail.com"
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Masukkan email anda
                </p>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 mt-5">
                  Pilih Kelas Anda
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

                {/* Replace the current Jenis Kelamin input field with this code */}
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 mt-5">
                  Pilih Jenis Kelamin
                </label>
                <div className="mt-2">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <input
                        id="laki-laki"
                        name="gender"
                        type="radio"
                        value="Laki-laki"
                        checked={gender === "Laki-laki"}
                        onChange={(e) => setGender(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                        style={{
                          accentColor: currentColor,
                        }}
                      />
                      <label
                        htmlFor="laki-laki"
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-200"
                      >
                        Laki-laki
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="perempuan"
                        name="gender"
                        type="radio"
                        value="Perempuan"
                        checked={gender === "Perempuan"}
                        onChange={(e) => setGender(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                        style={{
                          accentColor: currentColor,
                        }}
                      />
                      <label
                        htmlFor="perempuan"
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-200"
                      >
                        Perempuan
                      </label>
                    </div>
                  </div>
                </div>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 mt-5">
                  Umur
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="number"
                    name="umur"
                    required
                    placeholder="15, 16, 17"
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
                    value={umur}
                    onChange={(e) => setUmur(e.target.value)}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Masukkan umur anda
                </p>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 mt-5">
                  Alamat
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="alamat"
                    required
                    placeholder="Lhokseumawe, Muara Satu"
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
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Masukkan alamat anda
                </p>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 mt-5">
                  Upload Foto Profil
                </label>
                <div className="mt-2 flex flex-col space-y-4">
                  <div className="flex items-center">
                    <div className="relative">
                      <input
                        type="file"
                        name="file"
                        id="file"
                        accept="image/*"
                        onChange={loadImage}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div
                        className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none cursor-pointer"
                        style={{
                          boxShadow: `0 0 0 1px ${currentColor}`,
                          borderColor: currentColor,
                        }}
                      >
                        Pilih Foto
                      </div>
                    </div>
                    <span className="ml-3 text-sm text-gray-500 dark:text-gray-300">
                      {file ? file.name : "Belum ada file yang dipilih"}
                    </span>
                  </div>

                  {/* Image Preview */}
                  {preview && (
                    <div className="mt-4 relative">
                      <div className="flex justify-start">
                        <div
                          className="relative w-40 h-40 rounded-md overflow-hidden border border-gray-300 dark:border-gray-600"
                          style={{
                            boxShadow: `0 0 0 1px ${currentColor}`,
                            borderColor: currentColor,
                          }}
                        >
                          <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setPreview(null);
                        }}
                        className="absolute top-0 right-0 mt-2 mr-2 p-1 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        style={{
                          color: currentColor,
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
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
                  )}
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                    Upload foto profil (JPG, PNG, maksimal 5MB)
                  </p>
                </div>
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
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
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
                Penambahan profile siswa akan langsung tercatat dalam sistem.
                Pastikan data yang dimasukkan sudah benar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDataSiswa;
