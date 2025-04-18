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
  const [audioFile, setAudioFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);
  const [deleteAudio, setDeleteAudio] = useState(false);
  const [deleteVideo, setDeleteVideo] = useState(false);
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
    setCurrentAudioUrl(response.data.urlAudio);
    setCurrentVideoUrl(response.data.urlVideo);
  };

  const updateSubModul = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("subJudul", subJudul);
    formData.append("subDeskripsi", subDeskripsi);
    formData.append("content", content);
    formData.append("modulId", modulId);

    // Handle files and deletions
    if (audioFile) {
      formData.append("audioFile", audioFile);
    } else if (deleteAudio) {
      formData.append("deleteAudio", "true");
    }

    if (videoFile) {
      formData.append("videoFile", videoFile);
    } else if (deleteVideo) {
      formData.append("deleteVideo", "true");
    }

    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(`http://localhost:5000/sub-modul/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate(`/list-sub-modul-belajar/${modulId}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handlers for file changes
  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleDeleteAudio = () => {
    setDeleteAudio(true);
    setCurrentAudioUrl(null);
  };

  const handleDeleteVideo = () => {
    setDeleteVideo(true);
    setCurrentVideoUrl(null);
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
                {/* Upload Audio and Video Files */}
                <div className="space-y-6 mt-8">
                  <h3
                    className="text-lg font-medium text-gray-700 dark:text-gray-200 border-b pb-2"
                    style={{ borderColor: currentColor }}
                  >
                    Media Pendukung
                  </h3>

                  {/* Audio Upload */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Audio Narasi
                    </label>
                    <div className="flex items-center space-x-3">
                      <div className="flex-grow">
                        <div
                          className="relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          style={{ borderColor: currentColor }}
                        >
                          <input
                            type="file"
                            id="audio-upload"
                            accept=".mp3, .wav"
                            onChange={handleAudioChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="flex flex-col items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-8 h-8 mb-2"
                              style={{ color: currentColor }}
                            >
                              <path d="M8 10a4 4 0 11.002 8.002A4 4 0 018 10zm2 4a2 2 0 11-4 0 2 2 0 014 0z" />
                              <path d="M16 4a5 5 0 00-5 5v6.5c0 .28.22.5.5.5s.5-.22.5-.5V9a4 4 0 118 0v6.5c0 .28.22.5.5.5s.5-.22.5-.5V9a5 5 0 00-5-5z" />
                            </svg>
                            <span
                              className="font-medium"
                              style={{ color: currentColor }}
                            >
                              {audioFile ? audioFile.name : "Upload Audio"}
                            </span>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Format MP3 atau WAV (Max. 10MB)
                            </p>
                          </div>
                        </div>
                      </div>
                      {audioFile && (
                        <button
                          type="button"
                          onClick={() => setAudioFile(null)}
                          className="p-2 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-600 dark:text-red-200 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                    {audioFile && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        File terpilih:{" "}
                        <span className="font-medium">{audioFile.name}</span> (
                        {(audioFile.size / (1024 * 1024)).toFixed(2)} MB)
                      </p>
                    )}
                  </div>

                  {/* Video Upload */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Video Tutorial
                    </label>
                    <div className="flex items-center space-x-3">
                      <div className="flex-grow">
                        <div
                          className="relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          style={{ borderColor: currentColor }}
                        >
                          <input
                            type="file"
                            id="video-upload"
                            accept=".mp4, .avi, .mov"
                            onChange={handleVideoChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="flex flex-col items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-8 h-8 mb-2"
                              style={{ color: currentColor }}
                            >
                              <path d="M4 5h16v10H4V5zm16 12v-2H4v2h16zm0-14H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V5a2 2 0 00-2-2z" />
                              <path d="M10 9l5 3-5 3V9z" />
                            </svg>
                            <span
                              className="font-medium"
                              style={{ color: currentColor }}
                            >
                              {videoFile ? videoFile.name : "Upload Video"}
                            </span>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Format MP4, AVI, atau MOV (Max. 50MB)
                            </p>
                          </div>
                        </div>
                      </div>
                      {videoFile && (
                        <button
                          type="button"
                          onClick={() => setVideoFile(null)}
                          className="p-2 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-600 dark:text-red-200 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                    {videoFile && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        File terpilih:{" "}
                        <span className="font-medium">{videoFile.name}</span> (
                        {(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                </div>

                {/* Media Preview Section */}
                {(currentAudioUrl || currentVideoUrl) && (
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">
                      Preview Media Terkini
                    </h3>

                    <div className="space-y-6">
                      {/* Audio Preview */}
                      {currentAudioUrl && !deleteAudio && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Audio Saat Ini
                            </h4>
                            <button
                              type="button"
                              onClick={handleDeleteAudio}
                              className="text-red-500 hover:text-red-700 text-sm flex items-center"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Hapus Audio
                            </button>
                          </div>
                          <div
                            className="audio-player-container"
                            style={{
                              borderLeft: `3px solid ${currentColor}`,
                              paddingLeft: "12px",
                            }}
                          >
                            <audio
                              controls
                              className="w-full max-w-md"
                              style={{
                                "--play-button-color": currentColor,
                                "--range-color": currentColor,
                              }}
                            >
                              <source src={currentAudioUrl} type="audio/mp3" />
                              Browser Anda tidak mendukung tag audio.
                            </audio>
                          </div>
                          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            {audioFile
                              ? "Audio baru akan menggantikan audio saat ini"
                              : ""}
                          </p>
                        </div>
                      )}

                      {/* Video Preview */}
                      {currentVideoUrl && !deleteVideo && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Video Saat Ini
                            </h4>
                            <button
                              type="button"
                              onClick={handleDeleteVideo}
                              className="text-red-500 hover:text-red-700 text-sm flex items-center"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Hapus Video
                            </button>
                          </div>
                          <div
                            className="relative mx-auto"
                            style={{
                              maxWidth: "600px",
                              height: "337px",
                            }}
                          >
                            <video
                              className="w-full h-full rounded-lg object-cover"
                              controls
                              style={{
                                "--play-button-color": currentColor,
                                "--range-color": currentColor,
                              }}
                            >
                              <source src={currentVideoUrl} type="video/mp4" />
                              Browser Anda tidak mendukung tag video.
                            </video>
                          </div>
                          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                            {videoFile
                              ? "Video baru akan menggantikan video saat ini"
                              : ""}
                          </p>
                        </div>
                      )}

                      {/* Deletion Messages */}
                      {deleteAudio && (
                        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md text-sm">
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-red-500 mr-2"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-red-700 dark:text-red-300">
                              Audio akan dihapus setelah menyimpan
                            </span>
                            <button
                              type="button"
                              onClick={() => setDeleteAudio(false)}
                              className="ml-auto text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100"
                            >
                              Batalkan
                            </button>
                          </div>
                        </div>
                      )}

                      {deleteVideo && (
                        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md text-sm">
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-red-500 mr-2"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-red-700 dark:text-red-300">
                              Video akan dihapus setelah menyimpan
                            </span>
                            <button
                              type="button"
                              onClick={() => setDeleteVideo(false)}
                              className="ml-auto text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100"
                            >
                              Batalkan
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
