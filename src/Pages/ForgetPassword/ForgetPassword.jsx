import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const sendResetPassword = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponseMessage("");
    setIsError(false);

    const jsonData = {
      email: email,
    };

    try {
      const apiUrl = process.env.REACT_APP_URL_API;
      const response = await axios.post(
        `${apiUrl}/send-link-reset-password`,
        jsonData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setResponseMessage(response.data.msg);
      setIsSubmitting(false);
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-secondary-dark-bg rounded-xl shadow-lg overflow-hidden mx-8">
          {/* Header */}
          <div className="py-4 px-6" style={{ backgroundColor: "#FF6B35" }}>
            <h1 className="text-xl font-bold text-white">Reset Password</h1>
          </div>

          {/* Form */}
          <div className="p-5">
            <form onSubmit={sendResetPassword} className="space-y-8">
              {responseMessage && (
                <div
                  className={`p-4 rounded-lg ${
                    isError
                      ? "bg-red-50 text-red-800 border border-red-200"
                      : "bg-green-50 text-green-800 border border-green-200"
                  }`}
                >
                  <p className="text-sm">{responseMessage}</p>
                </div>
              )}
              <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Email
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="email"
                    required
                    placeholder="Contoh: nama@sma1lhok.sch.id, nama@gmail.com"
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none transition duration-150"
                    style={{
                      boxShadow: `0 0 0 1px #FF6B35`,
                      borderColor: "#FF6B35",
                      focus: {
                        outline: "none",
                        boxShadow: `0 0 0 2px #FF6B35`,
                        borderColor: "#FF6B35",
                      },
                    }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Masukkan email anda untuk mereset password
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-8 px-6">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                  style={{
                    focus: {
                      boxShadow: `0 0 0 2px #FF6B35`,
                      borderColor: "#FF6B35",
                    },
                  }}
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  style={{
                    backgroundColor: "#FF6B35",
                    hover: { backgroundColor: "#FF6B35dd" },
                  }}
                >
                  {isSubmitting ? "Mengirim..." : "Kirim"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Card */}
        <div
          className="mt-6 bg-white dark:text-white dark:bg-secondary-dark-bg p-6 rounded-lg shadow mx-8"
          style={{ borderLeft: `4px solid #FF6B35` }}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 dark:text-white dark:bg-secondary-dark-bg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#FF6B35"
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
                Gunakan email yang sudah terdaftar oleh sistem kami. Pastikan
                email sudah diisi dengan benar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
