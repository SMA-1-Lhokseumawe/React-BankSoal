import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";
import { useStateContext } from "../contexts/ContextProvider";

const AddDiscussion = () => {
  const [judul, setJudul] = useState("");
  const [content, setContent] = useState("");
  const [kategori, setKategori] = useState("");
  const [siswaId, setSiswaId] = useState("");
  const [guruId, setGuruId] = useState("");
  const [files, setFiles] = useState([]);

  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { currentColor } = useStateContext();
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        navigate("/");
      }
  }, [navigate]);

  const getProfileSiswa = async () => {
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
        console.log("siswa id" + profileData.id);
        
      } else {
        console.error("Format data tidak sesuai:", response.data);
      }
    } catch (error) {
      console.error("Error mengambil profile siswa:", error);
    }
  };

  const getProfileGuru = async () => {
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
      } else {
        console.error("Format data tidak sesuai:", response.data);
      }
    } catch (error) {
      console.error("Error mengambil profile guru:", error);
    }
  };

  const savePost = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("content", content);
    formData.append("kategori", kategori);
    formData.append("siswaId", siswaId);
    formData.append("guruId", guruId);

    files.forEach((fileObj) => {
      formData.append("files", fileObj.file);
    });

    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      await axios.post(`${apiUrl}/post`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/diskusi");
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const processFiles = useCallback((fileList) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const newImages = Array.from(fileList)
      .filter((file) => allowedTypes.includes(file.type))
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

    setFiles((prevImages) => [...prevImages, ...newImages]);
  }, []);

  const handleImageUpload = (event) => {
    processFiles(event.target.files);
  };

  const handleRemoveImage = (index) => {
    URL.revokeObjectURL(files[index].preview);
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Drag and drop handlers
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  return (
    <div className="min-h-screen bg-gradient-to-b mt-5 from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full mx-auto">
        <div className="bg-white dark:bg-secondary-dark-bg rounded-xl shadow-lg overflow-hidden mx-8">
          {/* Header */}
          <div className="py-4 px-6" style={{ backgroundColor: currentColor }}>
            <h1 className="text-xl font-bold text-white">Tambah Postingan</h1>
          </div>

          {/* Form */}
          <div className="p-10">
            <form onSubmit={savePost} className="space-y-8">
              <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Judul
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="judul"
                    required
                    placeholder="Masukan Judul"
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
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Masukkan Judul Postingan
                </p>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 mt-5">
                  Isi Pertanyaan
                </label>
                <div className="relative rounded-md shadow-sm">
                  <textarea
                    name="content"
                    required
                    placeholder="buat beberapa pertanyaan disini"
                    rows="4"
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
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Masukkan Pertanyaan
                </p>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 mt-5">
                  Kategori
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="kategori"
                    required
                    placeholder="Masukan kategori dipisah dengan koma: matematika, fisika, kimia"
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
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Masukan Kategori
                </p>

                {/* Improved Upload Images Section */}
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 mt-5">
                  Upload Images
                </label>
                <div 
                  className={`mt-2 border-dashed border-2 rounded-lg p-6 transition-all duration-200 ${
                    isDragging 
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="text-center">
                    <svg 
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor" 
                      fill="none" 
                      viewBox="0 0 48 48" 
                      aria-hidden="true"
                    >
                      <path 
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />
                    </svg>
                    <div className="mt-4 flex text-sm justify-center">
                      <p className="text-gray-500">
                        <span className="font-medium text-blue-600 hover:text-blue-700">
                          Drop your images here
                        </span>{" "}
                        or
                      </p>
                      <label
                        htmlFor="upload-images"
                        className="relative ml-1 cursor-pointer font-medium text-blue-600 hover:text-blue-700 focus-within:outline-none"
                      >
                        <span>browse</span>
                        <input
                          id="upload-images"
                          name="upload-images"
                          type="file"
                          className="sr-only"
                          multiple
                          accept="image/jpeg,image/png,image/jpg"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      JPEG, JPG, PNG are allowed
                    </p>
                  </div>
                </div>

                {/* Image Preview Section */}
                {files.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-3">
                      Uploaded Images
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {files.map((image, index) => (
                        <div
                          key={index}
                          className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                        >
                          <div className="aspect-w-16 aspect-h-9 w-full">
                            <img
                              src={image.preview}
                              alt={`Preview ${index}`}
                              className="w-full h-32 object-cover"
                            />
                          </div>
                          <div className="p-2">
                            <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                              {image.file.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {(image.file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-md transition-all duration-200"
                            aria-label="Remove image"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex items-center justify-between pt-8 px-6">
                  <button
                    type="button"
                    onClick={() => navigate("/diskusi")}
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
                Membuat postingan pertanyaan anda akan langsung tercatat dalam sistem.
                Pastikan buat pertanyaan sudah sesuai.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDiscussion;
