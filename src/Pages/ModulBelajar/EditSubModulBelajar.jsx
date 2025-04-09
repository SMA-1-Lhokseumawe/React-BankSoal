import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getMe } from "../../features/authSlice";
import { useStateContext } from "../../contexts/ContextProvider";

import QuillEditor from "../../components/editors/QuillEditor";
import ContentPreview from "../../components/previews/ContentPreview";

import useImageCompression from "../../hooks/useImageCompression";

import debounce from "../../utils/debounce";
import { prepareHtmlForPreview } from "../../utils/htmlProcessor";
import { formatCompressionStats } from "../../utils/formatters";

const EditSubModulBelajar = () => {
  const [subJudul, setSubJudul] = useState("");
  const [subDeskripsi, setSubDeskripsi] = useState("");
  const [content, setContent] = useState("");
  const [modulId, setModulId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processedContent, setProcessedContent] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const { currentColor } = useStateContext();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { compressContentImages, compressionStats, isCompressing } =
    useImageCompression({
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
    });

  const formattedStats = formatCompressionStats(compressionStats);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      getSubModulById();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Handler untuk perubahan konten editor
  const handleContentChange = (value) => {
    setContent(value);
    debouncedProcessContent(value);
  };

  // Proses konten dengan debounce untuk menghindari pemrosesan berlebihan
  const debouncedProcessContent = useCallback(
    debounce(async (value) => {
      if (value) {
        try {
          // Kompresi gambar dalam konten
          const compressed = await compressContentImages(value);
          // Persiapkan HTML untuk preview
          const prepared = prepareHtmlForPreview(compressed);
          setProcessedContent(prepared);
        } catch (error) {
          console.error("Error processing content:", error);
          setProcessedContent(value);
        }
      } else {
        setProcessedContent("");
      }
    }, 500),
    [compressContentImages]
  );

  const getSubModulById = async () => {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(`http://localhost:5000/sub-modul/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setSubJudul(response.data.subJudul);
    setSubDeskripsi(response.data.subDeskripsi);
    setContent(response.data.content);
    setModulId(response.data.modulId);
  };

  const updateSubModul = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("subJudul", subJudul);
    formData.append("subDeskripsi", subDeskripsi);
    formData.append("content", content);
    formData.append("modulId", modulId);

    const jsonData = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });

    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(`http://localhost:5000/sub-modul/${id}`, jsonData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      navigate(`/list-sub-modul-belajar/${modulId}`);
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b mt-5 from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full mx-auto">
        {/* Card utama */}
        <div className="bg-white dark:bg-secondary-dark-bg rounded-xl shadow-lg overflow-hidden mx-8">
          {/* Header */}
          <div className="py-4 px-6" style={{ backgroundColor: currentColor }}>
            <h1 className="text-xl font-bold text-white">
              Tambah Sub Modul Baru
            </h1>
          </div>

          {/* Form */}
          <div className="p-10">
            <form onSubmit={updateSubModul} className="space-y-8">
              <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg">
                {/* Modul ID Field */}
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 mt-5">
                  ID Modul
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="modulId"
                    readOnly
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none transition duration-150 bg-gray-100 dark:bg-gray-700"
                    style={{
                      boxShadow: `0 0 0 1px ${currentColor}`,
                      borderColor: currentColor,
                    }}
                    value={modulId}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  ID Modul yang terhubung dengan sub modul ini
                </p>

                {/* Judul Sub Modul */}
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 mt-5">
                  Judul Sub Modul
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="subJudul"
                    required
                    placeholder="Masukan sub judul"
                    className={`block w-full px-4 py-3 rounded-md border ${
                      formErrors.subJudul
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:outline-none"
                    } dark:bg-gray-800 dark:text-white transition duration-150`}
                    style={{
                      boxShadow: formErrors.subJudul
                        ? "0 0 0 1px #ef4444"
                        : `0 0 0 1px ${currentColor}`,
                      borderColor: formErrors.subJudul
                        ? "#ef4444"
                        : currentColor,
                    }}
                    value={subJudul}
                    onChange={(e) => {
                      setSubJudul(e.target.value);
                      // Clear error when typing
                      if (formErrors.subJudul) {
                        setFormErrors({ ...formErrors, subJudul: null });
                      }
                    }}
                  />
                </div>
                {formErrors.subJudul && (
                  <p className="mt-2 text-sm text-red-600">
                    {formErrors.subJudul}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Masukkan judul sub modul
                </p>

                {/* Deskripsi Sub Modul */}
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 mt-5">
                  Deskripsi Sub Modul
                </label>
                <div className="relative rounded-md shadow-sm">
                  <textarea
                    name="deskripsi"
                    required
                    placeholder="Deskripsi"
                    rows="4"
                    className={`block w-full px-4 py-3 rounded-md border ${
                      formErrors.subDeskripsi
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:outline-none"
                    } dark:bg-gray-800 dark:text-white transition duration-150`}
                    style={{
                      boxShadow: formErrors.subDeskripsi
                        ? "0 0 0 1px #ef4444"
                        : `0 0 0 1px ${currentColor}`,
                      borderColor: formErrors.subDeskripsi
                        ? "#ef4444"
                        : currentColor,
                    }}
                    value={subDeskripsi}
                    onChange={(e) => {
                      setSubDeskripsi(e.target.value);
                      // Clear error when typing
                      if (formErrors.subDeskripsi) {
                        setFormErrors({ ...formErrors, subDeskripsi: null });
                      }
                    }}
                  />
                </div>
                {formErrors.subDeskripsi && (
                  <p className="mt-2 text-sm text-red-600">
                    {formErrors.subDeskripsi}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Masukkan deskripsi
                </p>

                {/* Content Editor */}
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 mt-5">
                  Content
                </label>
                <div
                  className={`relative ${
                    formErrors.content ? "ring-2 ring-red-500 rounded-md" : ""
                  }`}
                >
                  {/* Gunakan komponen QuillEditor kustom */}
                  <QuillEditor
                    value={content}
                    onChange={handleContentChange}
                    placeholder="Masukkan konten pembelajaran disini..."
                    themeColor={formErrors.content ? "#ef4444" : currentColor}
                  />
                </div>
                {formErrors.content && (
                  <p className="mt-2 text-sm text-red-600">
                    {formErrors.content}
                  </p>
                )}

                {/* Compression info panel */}
                {content && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg mt-10 pt-10">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-200">
                      Informasi Kompresi
                    </h3>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-medium">
                            Ukuran Konten Asli:
                          </span>{" "}
                          {formattedStats.originalSize}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-medium">
                            Ukuran Terkompresi:
                          </span>{" "}
                          {isCompressing
                            ? "Mengompresi..."
                            : formattedStats.compressedSize}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Rasio Kompresi:</span>{" "}
                        {isCompressing
                          ? "Mengompresi..."
                          : formattedStats.ratio}
                      </p>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Status:</span>{" "}
                        {isCompressing ? (
                          <span className="text-blue-500 font-medium">
                            Mengompresi...
                          </span>
                        ) : formattedStats.isSuccess ? (
                          <span className="text-green-500 font-medium">
                            Siap untuk dikirim
                          </span>
                        ) : (
                          <span className="text-red-500 font-medium">
                            Ukuran masih terlalu besar!
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: "30px" }}></div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-8 px-6">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
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
                  disabled={isSubmitting || isCompressing}
                  className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none ${
                    isSubmitting || isCompressing
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                  style={{
                    backgroundColor: currentColor,
                    hover: { backgroundColor: `${currentColor}dd` },
                  }}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Sub Modul"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Preview Content Section */}
        {content && (
          <ContentPreview
            content={processedContent}
            title="Preview Konten"
            themeColor={currentColor}
            className="mx-8 mt-6"
          />
        )}
        {/* End Preview Content Section */}

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
                Penambahan sub modul baru akan langsung tercatat dalam sistem.
                Pastikan data yang dimasukkan sudah benar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSubModulBelajar;
