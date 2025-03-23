import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";
import { useStateContext } from "../contexts/ContextProvider";

const AddKelas = () => {
  const [kelas, setKelas] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { currentColor } = useStateContext();
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const saveKelas = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("kelas", kelas);

    const jsonData = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });

    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        "http://localhost:5000/kelas",
        jsonData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/kelas");
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
            <h1 className="text-xl font-bold text-white">Tambah Kelas Baru</h1>
          </div>
          
          {/* Form */}
          <div className="p-10">
            <form onSubmit={saveKelas} className="space-y-8">
              <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Nama Kelas
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="kelas"
                    required
                    placeholder="Contoh: X-1, XI IPA 2, XII IPS 3"
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none transition duration-150"
                    style={{ 
                      boxShadow: `0 0 0 1px ${currentColor}`,
                      borderColor: currentColor,
                      focus: { 
                        outline: "none", 
                        boxShadow: `0 0 0 2px ${currentColor}`,  
                        borderColor: currentColor
                      }
                    }}
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Masukkan nama kelas dengan format yang sesuai
                </p>
              </div>
              
              {/* Buttons */}
              <div className="flex items-center justify-between pt-8 px-6">
                <button
                  type="button"
                  onClick={() => navigate("/kelas")}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                  style={{
                    focus: {
                      boxShadow: `0 0 0 2px ${currentColor}`,
                      borderColor: currentColor
                    }
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
                    hover: { backgroundColor: `${currentColor}dd` }
                  }}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Kelas"}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Info Card */}
        <div className="mt-6 bg-white dark:text-white dark:bg-secondary-dark-bg p-6 rounded-lg shadow mx-8" 
          style={{ borderLeft: `4px solid ${currentColor}` }}>
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
                Penambahan kelas baru akan langsung tercatat dalam sistem. Pastikan data yang dimasukkan sudah benar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddKelas;