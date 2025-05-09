import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";
import { useStateContext } from "../contexts/ContextProvider";

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const AddUsers = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [role, setRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);

  const { currentColor } = useStateContext();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      console.log("berhasil");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const saveUsers = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confPassword", confPassword);
    formData.append("role", role);

    const jsonData = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });

    try {
      const apiUrl = process.env.REACT_APP_URL_API;
      await axios.post(`${apiUrl}/users`, jsonData);
      navigate("/users");
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      setIsSubmitting(false);
    }
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;

    // Check if the input contains spaces
    if (value.includes(" ")) {
      setUsernameError("Username tidak boleh mengandung spasi");
    } else {
      setUsernameError("");
    }

    // Remove spaces from the input
    const noSpacesValue = value.replace(/\s+/g, "");
    setUsername(noSpacesValue);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfPasswordVisibility = () =>
    setShowConfPassword(!showConfPassword);

  return (
    <div className="min-h-screen bg-gradient-to-b mt-5 from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full mx-auto">
        <div className="bg-white dark:bg-secondary-dark-bg rounded-xl shadow-lg overflow-hidden mx-8">
          {/* Header */}
          <div className="py-4 px-6" style={{ backgroundColor: currentColor }}>
            <h1 className="text-xl font-bold text-white">Tambah Data Users</h1>
          </div>

          {/* Form */}
          <div className="p-10">
            <form onSubmit={saveUsers} className="space-y-8">
              <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Username
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="username"
                    required
                    placeholder="Ganti Username (tanpa spasi)"
                    className={`block w-full px-4 py-3 rounded-md border ${
                      usernameError
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } dark:bg-gray-800 dark:text-white focus:outline-none transition duration-150`}
                    style={{
                      boxShadow: usernameError
                        ? "0 0 0 1px #EF4444"
                        : `0 0 0 1px ${currentColor}`,
                      borderColor: usernameError ? "#EF4444" : currentColor,
                    }}
                    value={username}
                    onChange={handleUsernameChange}
                  />
                </div>
                {usernameError ? (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {usernameError}
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                    Masukkan username (tanpa spasi)
                  </p>
                )}

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 mt-5">
                  Email
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="email"
                    required
                    placeholder="Contoh: info@gmail.com, siswa@sma1lhk.sch.id"
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none transition duration-150"
                    style={{
                      boxShadow: `0 0 0 1px ${currentColor}`,
                      borderColor: currentColor,
                    }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Masukan Email
                </p>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 mt-5">
                  Password
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Masukkan password baru"
                    className="block w-full px-4 py-3 pr-10 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none transition duration-150"
                    style={{
                      boxShadow: `0 0 0 1px ${currentColor}`,
                      borderColor: currentColor,
                    }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible className="h-5 w-5 text-gray-400" />
                    ) : (
                      <AiOutlineEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Password minimal 6 karakter
                </p>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 mt-5">
                  Konfirmasi Password
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type={showConfPassword ? "text" : "password"}
                    required
                    placeholder="Konfirmasi password"
                    className="block w-full px-4 py-3 pr-10 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none transition duration-150"
                    style={{
                      boxShadow: `0 0 0 1px ${currentColor}`,
                      borderColor: currentColor,
                    }}
                    value={confPassword}
                    onChange={(e) => setConfPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={toggleConfPasswordVisibility}
                  >
                    {showConfPassword ? (
                      <AiOutlineEyeInvisible className="h-5 w-5 text-gray-400" />
                    ) : (
                      <AiOutlineEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Masukkan kembali password Anda
                </p>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 mt-5">
                  Role
                </label>
                <div className="relative rounded-md shadow-sm">
                  <select
                    name="role"
                    required
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none transition duration-150"
                    style={{
                      boxShadow: `0 0 0 1px ${currentColor}`,
                      borderColor: currentColor,
                    }}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="">Pilih Role</option>
                    <option value="admin">Admin</option>
                    <option value="guru">Guru</option>
                    <option value="siswa">Siswa</option>
                  </select>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Pilih Role
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-8 px-6">
                <button
                  type="button"
                  onClick={() => navigate("/users")}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || usernameError}
                  className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none ${
                    isSubmitting || usernameError
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                  style={{
                    backgroundColor: currentColor,
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
                Pastikan data yang dimasukkan sudah benar. Username tidak boleh
                mengandung spasi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUsers;
