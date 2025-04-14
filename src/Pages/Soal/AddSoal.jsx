import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/authSlice";
import { useStateContext } from "../../contexts/ContextProvider";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddSoal = () => {
  const [soal, setSoal] = useState(null);
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [optionE, setOptionE] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [kelasList, setKelasList] = useState([]);
  const [kelasId, setKelasId] = useState("");
  const [pelajaranList, setPelajaranList] = useState([]);
  const [pelajaranId, setPelajaranId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const quillRef = useRef(null);
  const { currentColor } = useStateContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      getKelas();
      getPelajaran();
    } else {
      navigate("/");
    }
  }, [navigate]);

  const getKelas = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:5000/all-kelas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setKelasList(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getPelajaran = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:5000/pelajaran", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPelajaranList(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const saveSoal = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate if soal is empty or contains only whitespace/empty HTML
    const quill = quillRef.current.getEditor();
    const soalDelta = quill.getContents();
    const soalText = quill.getText().trim();

    if (soalDelta.ops.length === 1 && soalText === "") {
      setFormErrors({ ...formErrors, soal: "Isi soal tidak boleh kosong" });
      setIsSubmitting(false);
      return;
    }

    const jsonData = {
      soal: JSON.stringify(soalDelta), // Convert Delta to JSON string
      optionA: optionA,
      optionB: optionB,
      optionC: optionC,
      optionD: optionD,
      optionE: optionE,
      correctAnswer: correctAnswer,
      kelasId: kelasId,
      pelajaranId: pelajaranId,
    };

    try {
      const token = localStorage.getItem("accessToken");
      await axios.post("http://localhost:5000/soal", jsonData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      navigate("/data-soal");
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const imageUrl = response.data.data.url;

      // Insert the image into the Quill editor
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, "image", imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // Trigger the file input dialog
  const handleImageClick = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.setAttribute("multiple", "false");

    input.onchange = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const file = input.files[0];
      if (file) {
        handleImageUpload(file);
      }
    };

    input.click();
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["bold", "italic", "underline", "strike"],
        [{ align: [] }],
        ["link"],
      ],
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b mt-5 from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full mx-auto">
        {/* Card utama */}
        <div className="bg-white dark:bg-secondary-dark-bg rounded-xl shadow-lg overflow-hidden mx-8">
          {/* Header */}
          <div className="py-4 px-6" style={{ backgroundColor: currentColor }}>
            <h1 className="text-xl font-bold text-white">Tambah Soal</h1>
          </div>

          {/* Form */}
          <div className="p-10">
            <form onSubmit={saveSoal} className="space-y-8">
              <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Pilih Kelas
                </label>
                <div className="relative rounded-md shadow-sm">
                  <select
                    name="kelasId"
                    required
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none transition duration-150"
                    style={{
                      boxShadow: `0 0 0 1px ${currentColor}`,
                      borderColor: currentColor,
                    }}
                    value={kelasId}
                    onChange={(e) => setKelasId(e.target.value)}
                  >
                    <option value="">Pilih Kelas</option>
                    {kelasList.map((kelas) => (
                      <option key={kelas.id} value={kelas.id}>
                        {kelas.kelas}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Pilih kelas untuk pelajaran ini
                </p>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 mt-5">
                  Pilih Pelajaran
                </label>
                <div className="relative rounded-md shadow-sm">
                  <select
                    name="pelajaranId"
                    required
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none transition duration-150"
                    style={{
                      boxShadow: `0 0 0 1px ${currentColor}`,
                      borderColor: currentColor,
                    }}
                    value={pelajaranId}
                    onChange={(e) => setPelajaranId(e.target.value)}
                  >
                    <option value="">Pilih Pelajaran</option>
                    {pelajaranList.map((pelajaran) => (
                      <option key={pelajaran.id} value={pelajaran.id}>
                        {pelajaran.pelajaran}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Pilih Pelajaran
                </p>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 mt-5">
                  Soal
                </label>
                <ReactQuill
                  ref={quillRef}
                  value={soal}
                  onChange={setSoal}
                  modules={modules}
                  placeholder="Masukkan soal..."
                  className={`quill-editor-container ${
                    formErrors.soal ? "quill-error" : ""
                  }`}
                />

                <button
                  type="button"
                  onClick={handleImageClick}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Upload Gambar
                </button>

                {formErrors.soal && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.soal}</p>
                )}
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Masukan isi soal dengan rich text editor. Klik ikon gambar
                  untuk menambahkan gambar.
                </p>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Pilihan A
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="optionA"
                    required
                    placeholder="Masukkan pilihan A"
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none transition duration-150"
                    style={{
                      boxShadow: `0 0 0 1px ${currentColor}`,
                      borderColor: currentColor,
                    }}
                    value={optionA}
                    onChange={(e) => setOptionA(e.target.value)}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Masukkan isi pilihan A
                </p>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Pilihan B
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="optionB"
                    required
                    placeholder="Masukkan pilihan B"
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none transition duration-150"
                    style={{
                      boxShadow: `0 0 0 1px ${currentColor}`,
                      borderColor: currentColor,
                    }}
                    value={optionB}
                    onChange={(e) => setOptionB(e.target.value)}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Masukkan isi pilihan B
                </p>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Pilihan C
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="optionC"
                    required
                    placeholder="Masukkan pilihan C"
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none transition duration-150"
                    style={{
                      boxShadow: `0 0 0 1px ${currentColor}`,
                      borderColor: currentColor,
                    }}
                    value={optionC}
                    onChange={(e) => setOptionC(e.target.value)}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Masukkan isi pilihan C
                </p>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Pilihan D
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="optionD"
                    required
                    placeholder="Masukkan pilihan D"
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none transition duration-150"
                    style={{
                      boxShadow: `0 0 0 1px ${currentColor}`,
                      borderColor: currentColor,
                    }}
                    value={optionD}
                    onChange={(e) => setOptionD(e.target.value)}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Masukkan isi pilihan D
                </p>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Pilihan E
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="optionE"
                    required
                    placeholder="Masukkan pilihan E"
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none transition duration-150"
                    style={{
                      boxShadow: `0 0 0 1px ${currentColor}`,
                      borderColor: currentColor,
                    }}
                    value={optionE}
                    onChange={(e) => setOptionE(e.target.value)}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Masukkan isi pilihan E
                </p>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 mt-5">
                  Jawaban Yang Benar
                </label>
                <div className="relative rounded-md shadow-sm">
                  <select
                    name="correctAnswer"
                    required
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none transition duration-150"
                    style={{
                      boxShadow: `0 0 0 1px ${currentColor}`,
                      borderColor: currentColor,
                    }}
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                  >
                    <option value="">Pilih Jawaban Benar</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                  </select>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Pilih jawaban yang benar
                </p>

                <div style={{ marginBottom: "30px" }}></div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-8 px-6">
                <button
                  type="button"
                  onClick={() => navigate("/data-soal")}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none"
                  style={{
                    backgroundColor: currentColor,
                  }}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Soal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <style jsx>{`
        .quill-editor-container {
          margin-bottom: 1rem;
        }

        .quill-editor-container .ql-toolbar {
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          border-color: ${currentColor};
        }

        .quill-editor-container .ql-container {
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          border-color: ${currentColor};
          min-height: 150px;
        }

        .quill-error .ql-toolbar,
        .quill-error .ql-container {
          border-color: #ef4444 !important;
        }

        /* Dark mode support */
        .dark .ql-snow .ql-stroke {
          stroke: #d1d5db;
        }

        .dark .ql-snow .ql-fill,
        .dark .ql-snow .ql-stroke.ql-fill {
          fill: #d1d5db;
        }

        .dark .ql-snow .ql-picker {
          color: #d1d5db;
        }

        .dark .ql-snow .ql-picker-options {
          background-color: #374151;
          border-color: #4b5563;
        }

        .dark .ql-snow .ql-tooltip {
          background-color: #374151;
          border-color: #4b5563;
          color: #d1d5db;
        }

        .dark .ql-snow .ql-tooltip input[type="text"] {
          background-color: #1f2937;
          border-color: #4b5563;
          color: #d1d5db;
        }

        /* Custom image styling */
        .ql-editor img {
          width: 400px; /* Fixed width of 400px */
          max-width: 100%; /* Ensure it doesn't overflow container */
          height: auto; /* Maintain aspect ratio */
          display: block;
          margin: 1rem 0;
          border-radius: 0.375rem;
        }
      `}</style>
    </div>
  );
};

export default AddSoal;
