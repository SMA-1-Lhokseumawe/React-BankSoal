/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getMe } from "../../features/authSlice";
import { useStateContext } from "../../contexts/ContextProvider";

const ViewContent = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [moduleData, setModuleData] = useState(null);
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
      console.log("berhasil");
      getSubModulById();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const getSubModulById = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `http://localhost:5000/sub-modul/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setContent(response.data.content);
      setModuleData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching module content:", error);
      setLoading(false);
    }
  };

  const renderContent = () => {
    return { __html: content };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: currentColor }}
        ></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-6 pb-4 border-b dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Kembali
          </button>

          {moduleData && moduleData.modulId && (
            <button
              onClick={() => navigate(`/sub-modul-belajar/edit/${id}`)}
              className="px-4 py-2 rounded-lg text-white font-medium shadow-sm hover:shadow-md transition-all"
              style={{ backgroundColor: currentColor }}
            >
              Edit Konten
            </button>
          )}
        </div>

        {moduleData && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {moduleData.subJudul || "Sub Modul"}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {moduleData.subDeskripsi || ""}
            </p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="content-container bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div
          className="prose prose-lg max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={renderContent()}
        />
      </div>
    </div>
  );
};

export default ViewContent;
