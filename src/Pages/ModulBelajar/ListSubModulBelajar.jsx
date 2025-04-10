import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getMe } from "../../features/authSlice";
import { useStateContext } from "../../contexts/ContextProvider";
import { FiPlus, FiEdit2, FiTrash2, FiEye } from "react-icons/fi";

const ListSubModulBelajar = () => {
  const [subModul, setSubModul] = useState([]);
  const [judulModul, setJudulModul] = useState("");
  const [loading, setLoading] = useState(true);
  const { currentColor, currentMode } = useStateContext();

  const { user } = useSelector((state) => state.auth);

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      getSubModulByModulId();
      getModulById();
    } else {
      navigate("/");
    }
  }, [navigate]);

  const getSubModulByModulId = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `http://localhost:5000/sub-modul-by-modulid/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSubModul(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sub modules:", error);
      setLoading(false);
    }
  };

  const getModulById = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`http://localhost:5000/modul/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJudulModul(response.data.judul);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sub modules:", error);
      setLoading(false);
    }
  };

  const handleViewSubModul = (id) => {
    navigate(`/sub-modul-belajar/view/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/sub-modul-belajar/edit/${id}`);
  };

  const handleDeleteSubModul = async (userId) => {
    const token = localStorage.getItem("accessToken");
    await axios.delete(`http://localhost:5000/sub-modul/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    getSubModulByModulId();
  };

  // Menambahkan styling dinamis berdasarkan currentColor dan mode
  const gradientStyle = {
    background:
      currentMode === "Dark"
        ? `linear-gradient(135deg, ${currentColor}20 0%, ${currentColor}40 100%)`
        : `linear-gradient(135deg, ${currentColor}10 0%, ${currentColor}30 100%)`,
  };

  const buttonStyle = {
    backgroundColor: currentColor,
  };

  return (
    <div className="p-6 space-y-8 dark:bg-gray-900">
      {/* Header section with gradient background */}
      <div className="rounded-xl p-6 mb-8" style={gradientStyle}>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          {loading ? "Loading..." : judulModul || "Detail Modul"}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
          Pilih pembelajaran yang mau dibahas
        </p>
      </div>

      {user && user.role !== "siswa" && (
        <div>
          <button
            className="inline-flex items-center px-5 py-2.5 rounded-lg text-white font-medium shadow-sm hover:shadow-md transition-all"
            style={buttonStyle}
            onClick={() =>
              navigate("/sub-modul-belajar/tambah-sub-modul-belajar", {
                state: { modulId: id },
              })
            }
          >
            <FiPlus className="mr-2" />
            Tambah Sub Modul
          </button>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {subModul.map((subModul, index) => {
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

              <div className="p-6 flex-grow">
                {/* Title and description */}
                <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">
                  {subModul.subJudul}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
                  {subModul.subDeskripsi}
                </p>

                {/* Card Footer */}
                <div className="flex justify-between items-center">
                  {/* Left side: Edit and Delete buttons */}
                  <div className="flex space-x-2">
                    {user && user.role !== "siswa" && (
                      <>
                        <button
                          onClick={() => handleEdit(subModul.id)}
                          className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-sm font-medium flex items-center transition-all hover:bg-amber-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSubModul(subModul.id)}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium flex items-center transition-all hover:bg-red-600"
                        >
                          Hapus
                        </button>
                      </>
                    )}
                  </div>

                  {/* Right side: View Details button */}
                  <button
                    onClick={() => handleViewSubModul(subModul.id)}
                    style={{ backgroundColor: currentColor }}
                    className="px-3 py-1.5 text-white rounded-lg text-sm font-medium flex items-center transition-all hover:opacity-90"
                  >
                    Lihat
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListSubModulBelajar;
