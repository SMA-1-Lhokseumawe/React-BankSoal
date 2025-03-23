import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";
import { useStateContext } from "../contexts/ContextProvider";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // Import ikon mata

const GantiPassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confNewPassword, setConfNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State untuk modal
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // success, error, invalid
  
  // State untuk toggle visibility password
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);

  const { currentColor } = useStateContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    // Redirect ke login jika tidak ada token
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMsg("");
    setIsError(false);
    setIsSuccess(false);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(
        "http://localhost:5000/change-password",
        {
          oldPassword,
          newPassword,
          confNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reset form setelah berhasil
      setOldPassword("");
      setNewPassword("");
      setConfNewPassword("");
      setIsSuccess(true);
      setMsg(response.data.msg);
      
      // Tampilkan modal sukses
      setModalType("success");
      setShowModal(true);
    } catch (error) {
      setIsError(true);
      const errorMessage = error.response?.data?.msg || "Terjadi kesalahan";
      setMsg(errorMessage);
      
      // Tentukan tipe modal berdasarkan pesan error
      if (errorMessage.includes("Password lama tidak valid")) {
        setModalType("invalid");
      } else {
        setModalType("error");
      }
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle ketika user klik OK di modal sukses
  const handleSuccessModalClose = () => {
    setShowModal(false);
    navigate("/dashboard");
  };

  // Handle ketika user klik OK di modal error
  const handleErrorModalClose = () => {
    setShowModal(false);
  };

  // Toggle untuk password visibility
  const toggleOldPasswordVisibility = () => setShowOldPassword(!showOldPassword);
  const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
  const toggleConfPasswordVisibility = () => setShowConfPassword(!showConfPassword);

  return (
    <div className="min-h-screen bg-gradient-to-b mt-5 from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full mx-auto">
        <div className="bg-white dark:bg-secondary-dark-bg rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="py-4 px-6" style={{ backgroundColor: currentColor }}>
            <h1 className="text-xl font-bold text-white">Ganti Password</h1>
          </div>

          {/* Form */}
          <div className="p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Password Lama
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    required
                    placeholder="Masukkan password lama"
                    className="block w-full px-4 py-3 pr-10 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none transition duration-150"
                    style={{
                      boxShadow: `0 0 0 1px ${currentColor}`,
                      borderColor: currentColor,
                    }}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={toggleOldPasswordVisibility}
                  >
                    {showOldPassword ? (
                      <AiOutlineEyeInvisible className="h-5 w-5 text-gray-400" />
                    ) : (
                      <AiOutlineEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Masukkan password Anda saat ini untuk verifikasi
                </p>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 mt-5">
                  Password Baru
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    placeholder="Masukkan password baru"
                    className="block w-full px-4 py-3 pr-10 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none transition duration-150"
                    style={{
                      boxShadow: `0 0 0 1px ${currentColor}`,
                      borderColor: currentColor,
                    }}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={toggleNewPasswordVisibility}
                  >
                    {showNewPassword ? (
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
                  Konfirmasi Password Baru
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type={showConfPassword ? "text" : "password"}
                    required
                    placeholder="Konfirmasi password baru"
                    className="block w-full px-4 py-3 pr-10 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none transition duration-150"
                    style={{
                      boxShadow: `0 0 0 1px ${currentColor}`,
                      borderColor: currentColor,
                    }}
                    value={confNewPassword}
                    onChange={(e) => setConfNewPassword(e.target.value)}
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
                  Masukkan kembali password baru Anda
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-8 px-6">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
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
                  }}
                >
                  {isSubmitting ? "Memproses..." : "Ganti Password"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Card */}
        <div
          className="mt-6 bg-white dark:text-white dark:bg-secondary-dark-bg p-6 rounded-lg shadow"
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
                Untuk keamanan, gunakan password yang kuat dengan kombinasi
                huruf, angka, dan karakter khusus. Jangan gunakan password yang
                sama dengan akun lain Anda.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-90"></div>
            </div>

            {/* Modal */}
            <div className="inline-block align-bottom bg-white dark:bg-secondary-dark-bg rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  {/* Icon based on modal type */}
                  <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${
                    modalType === "success" 
                      ? "bg-green-100 dark:bg-green-900/30" 
                      : modalType === "invalid" 
                      ? "bg-yellow-100 dark:bg-yellow-900/30" 
                      : "bg-red-100 dark:bg-red-900/30"
                  } sm:mx-0 sm:h-10 sm:w-10`}>
                    {modalType === "success" ? (
                      <svg className="h-6 w-6 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : modalType === "invalid" ? (
                      <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    ) : (
                      <svg className="h-6 w-6 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>

                  {/* Modal content */}
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      {modalType === "success" 
                        ? "Password Berhasil Diubah" 
                        : modalType === "invalid" 
                        ? "Password Lama Tidak Valid" 
                        : "Gagal Mengubah Password"}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        {msg}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={modalType === "success" ? handleSuccessModalClose : handleErrorModalClose}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  style={{ backgroundColor: currentColor }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GantiPassword;