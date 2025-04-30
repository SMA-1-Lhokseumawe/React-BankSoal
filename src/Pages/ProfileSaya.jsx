import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";
import { useStateContext } from "../contexts/ContextProvider";

import { FiEye, FiHeadphones, FiActivity } from "react-icons/fi";

const ProfileSaya = () => {
  const [siswaId, setSiswaId] = useState("");
  const [guruId, setGuruId] = useState("");
  const [nis, setNis] = useState("");
  const [nip, setNip] = useState("");
  const [username, setUsername] = useState("");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [kelas, setKelas] = useState("");
  const [gayaBelajar, setGayaBelajar] = useState("");
  const [gender, setGender] = useState("");
  const [umur, setUmur] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [alamat, setAlamat] = useState("");
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { currentColor } = useStateContext();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      if (user && user.role === "guru") {
        getProfileGuru();
      } else if (user && user.role === "siswa") {
        getProfileSiswa();
      }
    } else {
      navigate("/login");
    }
  }, [navigate, user]);

  const formatDateForDisplay = (isoDateString) => {
    if (!isoDateString) return "";
    const date = new Date(isoDateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

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
        setSiswaId(profileData.id);
        setNis(profileData.nis);
        setNama(profileData.nama);
        setEmail(profileData.email);
        setKelas(profileData.kelas.kelas);
        setGayaBelajar(profileData.gayaBelajar);
        setGender(profileData.gender);
        setUmur(profileData.umur);
        setAlamat(profileData.alamat);
        setPreview(profileData.url);

        // Mengakses username dari nested object 'user'
        if (profileData.user) {
          setUsername(profileData.user.username);
        }
      } else {
        console.error("Format data tidak sesuai:", response.data);
      }
    } catch (error) {
      console.error("Error mengambil profile siswa:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProfileGuru = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      const response = await axios.get(`${apiUrl}/profile-guru`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.data) {
        const profileData = response.data.data;
        setGuruId(profileData.id);
        setNip(profileData.nip);
        setNama(profileData.nama);
        setEmail(profileData.email);
        setGender(profileData.gender);
        setTanggalLahir(profileData.tanggalLahir);
        setAlamat(profileData.alamat);
        setPreview(profileData.url);

        if (profileData.user) {
          setUsername(profileData.user.username);
        }
      } else {
        console.error("Format data tidak sesuai:", response.data);
      }
    } catch (error) {
      console.error("Error mengambil profile guru:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk mendapatkan inisial dari nama untuk avatar fallback
  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full border-4 border-t-transparent border-opacity-50 animate-spin mx-auto"
            style={{
              borderColor: `${currentColor} transparent ${currentColor} ${currentColor}`,
            }}
          ></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Memuat profil...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b mt-5 from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white dark:bg-secondary-dark-bg rounded-xl shadow-lg overflow-hidden mb-6">
          <div
            className="h-40 w-full relative"
            style={{ backgroundColor: currentColor }}
          >
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>

          <div className="px-4 sm:px-8 pb-6 flex flex-col items-center relative">
            {/* Edit Profile Button - Positioned in top right with responsive design */}
            <div className="absolute top-4 right-4 z-10">
              <button
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-white text-xs sm:text-sm font-medium shadow-md flex items-center"
                style={{ backgroundColor: currentColor }}
                onClick={() => {
                  if (user && user.role === "guru") {
                    navigate(`/guru/${guruId}`);
                  } else if (user && user.role === "siswa") {
                    navigate(`/siswa/${siswaId}`);
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 sm:h-4 sm:w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                <span className="whitespace-nowrap">Edit Profil</span>
              </button>
            </div>

            {/* Profile Avatar - Positioned to overlap the banner */}
            <div className="absolute -top-16 sm:-top-20 w-full flex justify-center">
              {preview ? (
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden">
                  <img
                    src={preview}
                    alt={nama}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center text-white text-3xl sm:text-4xl font-bold"
                  style={{ backgroundColor: currentColor }}
                >
                  {getInitials(nama)}
                </div>
              )}
            </div>

            {/* Profile Info - Below the avatar with proper spacing */}
            <div className="mt-14 sm:mt-20 text-center w-full">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                {nama}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1 text-base sm:text-lg">
                @{username}
              </p>

              <div className="mt-3 sm:mt-4 flex justify-center gap-2">
                <span
                  className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium text-white shadow-sm"
                  style={{ backgroundColor: currentColor }}
                >
                  {user && user.role === "guru" ? "Guru" : "Siswa"}
                </span>
                {user && user.role === "siswa" && (
                  <>
                    <span className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm">
                      {kelas}
                    </span>
                    <span className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm flex items-center gap-1">
                      {gayaBelajar === "Visual" && <FiEye className="mr-1" />}
                      {gayaBelajar === "Auditori" && (
                        <FiHeadphones className="mr-1" />
                      )}
                      {gayaBelajar === "Kinestetik" && (
                        <FiActivity className="mr-1" />
                      )}
                      {gayaBelajar}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white dark:bg-secondary-dark-bg rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Informasi Personal
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Username
                </h3>
                <p className="mt-1 text-gray-800 dark:text-white">{username}</p>
              </div>

              {/* Email */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email
                </h3>
                <p className="mt-1 text-gray-800 dark:text-white">{email}</p>
              </div>

              {/* NIP/NIS */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {user && user.role === "guru" ? "NIP" : "NIS"}
                </h3>
                <p className="mt-1 text-gray-800 dark:text-white">
                  {user && user.role === "guru" ? nip : nis}
                </p>
              </div>

              {/* Gender */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Jenis Kelamin
                </h3>
                <p className="mt-1 text-gray-800 dark:text-white">{gender}</p>
              </div>

              {/* Umur/Tanggal Lahir */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {user && user.role === "guru" ? "Tanggal Lahir" : "Umur"}
                </h3>
                <p className="mt-1 text-gray-800 dark:text-white">
                  {user && user.role === "guru"
                    ? formatDateForDisplay(tanggalLahir)
                    : `${umur} tahun`}
                </p>
              </div>

              {/* Alamat */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Alamat
                </h3>
                <p className="mt-1 text-gray-800 dark:text-white">{alamat}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Card */}
        <div
          className="bg-white dark:bg-secondary-dark-bg rounded-xl shadow-lg overflow-hidden mb-6 border-l-4"
          style={{ borderLeftColor: currentColor }}
        >
          <div className="p-6">
            <div className="flex items-center">
              <div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${currentColor}20` }}
              >
                <svg
                  className="w-6 h-6"
                  style={{ fill: currentColor }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                  Informasi Profil
                </h3>
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  {user && user.role === "guru"
                    ? "Ini adalah halaman profil guru Anda. Untuk mengubah profil, silakan klik button `Edit Profile`."
                    : "Ini adalah halaman profil siswa Anda. Untuk mengubah profil, silakan klik button `Edit Profile`."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 rounded-lg shadow-md transition duration-300 ease-in-out text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              backgroundColor: currentColor,
              boxShadow: `0 4px 14px 0 ${currentColor}40`,
              focus: {
                ringColor: currentColor,
              },
            }}
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSaya;
