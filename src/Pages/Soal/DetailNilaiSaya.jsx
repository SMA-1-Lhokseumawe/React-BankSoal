/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getMe } from "../../features/authSlice";
import { useStateContext } from "../../contexts/ContextProvider";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiXCircle,
  FiBookOpen,
  FiCalendar,
  FiBook,
} from "react-icons/fi";

const DetailNilaiSaya = () => {
  const [nilai, setNilai] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state) => state.auth);
  const { id } = useParams();
  const { currentColor } = useStateContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      getNilaiById();
    } else {
      navigate("/");
    }
  }, [id, navigate]);

  const getNilaiById = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      const response = await axios.get(`${apiUrl}/nilai/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNilai(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching nilai detail:", error);
      setLoading(false);
    }
  };

  // Parse Quill JSON content to get text
  const parseQuillContent = (content) => {
    try {
      if (!content) return "Soal tidak tersedia";
      
      if (typeof content === 'string' && content.includes('{"ops":')) {
        const parsedContent = JSON.parse(content);
        
        if (parsedContent.ops) {
          return parsedContent.ops.map((op, index) => {
            if (typeof op.insert === 'string') {
              return <span key={index}>{op.insert}</span>;
            } else if (op.insert && op.insert.image) {
              return <img key={index} src={op.insert.image} alt={`Soal Image ${index}`} className="w-full max-w-[300px] my-2" />;
            }
            return null;
          });
        }
      }
      
      return content;
    } catch (error) {
      console.error("Error parsing Quill content:", error);
      return "Format soal tidak valid";
    }
  };
  

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Tidak Tersedia';
  
    try {
      const date = new Date(dateString);
  
      if (isNaN(date.getTime())) {
        return 'Waktu Tidak Valid';
      }
  
      const formattedDate = date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
  
      const formattedTime = date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
  
      return `${formattedDate}, ${formattedTime} WIB`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Tidak Tersedia';
    }
  };

  const buttonStyle = {
    backgroundColor: currentColor,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: currentColor }}></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 dark:bg-gray-900 min-h-screen">
      {/* Header with back button */}
      <div className="flex items-center mb-4">
        <button
          className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mr-4"
          onClick={() => navigate(user.role === 'siswa' ? "/nilai-saya" : "/nilai")}
        >
          <FiArrowLeft className="mr-2" size={20} />
          <span>Kembali</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Hasil Exam
        </h1>
      </div>

      {/* Exam Summary Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="h-2" style={{ backgroundColor: currentColor }}></div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center mb-4">
                  <FiCalendar className="text-gray-500 dark:text-gray-400 mr-2" />
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Tanggal Ujian
                  </h3>
                </div>
                <p className="text-gray-800 dark:text-white font-medium">
                  {formatDateTime(nilai.updatedAt)}
                </p>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <FiBook className="text-gray-500 dark:text-gray-400 mr-2" />
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Mata Pelajaran
                  </h3>
                </div>
                <p className="text-gray-800 dark:text-white font-medium">
                  {nilai.pelajaran.pelajaran}
                </p>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <FiBookOpen className="text-gray-500 dark:text-gray-400 mr-2" />
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Kelas
                  </h3>
                </div>
                <p className="text-gray-800 dark:text-white font-medium">
                  Kelas {nilai.kelas.kelas}
                </p>
              </div>
            </div>

            {/* Right Column - Score and Stats */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 flex flex-col justify-between">
              <div className="space-y-4">
              <div className="flex justify-between">
                  <h3 className="text-gray-700 dark:text-gray-300 font-medium">
                    Nama
                  </h3>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {nilai.siswa.nama}
                  </p>
                </div>
                <div className="flex justify-between">
                  <h3 className="text-gray-700 dark:text-gray-300 font-medium">
                    Total soal
                  </h3>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {nilai.jumlahSoal}
                  </p>
                </div>
                <div className="flex justify-between">
                  <h3 className="text-gray-700 dark:text-gray-300 font-medium">
                    Score
                  </h3>
                  <p className="text-2xl font-bold" style={{ color: currentColor }}>
                    {nilai.skor}
                  </p>
                </div>
                <div className="flex justify-between">
                  <h3 className="text-gray-700 dark:text-gray-300 font-medium">
                    Level
                  </h3>
                  <p className="text-2xl font-bold" style={{ color: currentColor }}>
                    {nilai.level}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exam Details */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
          Detail Jawaban
        </h2>

        <div className="space-y-6">
          {nilai.soals.map((soal, index) => (
            <div
              key={soal.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Question header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center text-white font-medium mr-3"
                    style={buttonStyle}
                  >
                    {index + 1}
                  </div>
                  <h3 className="font-medium text-gray-800 dark:text-white">
                    Soal {index + 1}
                  </h3>
                </div>
                <div className="flex items-center">
                  {soal.nilai_soal.benar ? (
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <FiCheckCircle className="mr-1" />
                      Benar
                    </div>
                  ) : (
                    <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <FiXCircle className="mr-1" />
                      Salah
                    </div>
                  )}
                </div>
              </div>

              {/* Question content */}
              <div className="p-6">
                <div className="mb-6">
                  <p className="text-gray-800 dark:text-white mb-2">
                    {parseQuillContent(soal.soal)}
                  </p>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Option A */}
                  <div 
                    className={`p-3 rounded-lg border flex items-center ${
                      soal.correctAnswer === 'A' && soal.nilai_soal.jawaban === 'A'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : soal.correctAnswer === 'A'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : soal.nilai_soal.jawaban === 'A'
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div 
                      className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${
                        soal.correctAnswer === 'A' 
                          ? 'bg-green-500 text-white' 
                          : soal.nilai_soal.jawaban === 'A'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      A
                    </div>
                    <p className={`${
                      soal.correctAnswer === 'A' 
                        ? 'text-green-700 dark:text-green-300' 
                        : soal.nilai_soal.jawaban === 'A'
                        ? 'text-red-700 dark:text-red-300'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {soal.optionA}
                    </p>
                  </div>

                  {/* Option B */}
                  <div 
                    className={`p-3 rounded-lg border flex items-center ${
                      soal.correctAnswer === 'B' && soal.nilai_soal.jawaban === 'B'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : soal.correctAnswer === 'B'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : soal.nilai_soal.jawaban === 'B'
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div 
                      className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${
                        soal.correctAnswer === 'B' 
                          ? 'bg-green-500 text-white' 
                          : soal.nilai_soal.jawaban === 'B'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      B
                    </div>
                    <p className={`${
                      soal.correctAnswer === 'B' 
                        ? 'text-green-700 dark:text-green-300' 
                        : soal.nilai_soal.jawaban === 'B'
                        ? 'text-red-700 dark:text-red-300'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {soal.optionB}
                    </p>
                  </div>

                  {/* Option C */}
                  <div 
                    className={`p-3 rounded-lg border flex items-center ${
                      soal.correctAnswer === 'C' && soal.nilai_soal.jawaban === 'C'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : soal.correctAnswer === 'C'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : soal.nilai_soal.jawaban === 'C'
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div 
                      className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${
                        soal.correctAnswer === 'C' 
                          ? 'bg-green-500 text-white' 
                          : soal.nilai_soal.jawaban === 'C'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      C
                    </div>
                    <p className={`${
                      soal.correctAnswer === 'C' 
                        ? 'text-green-700 dark:text-green-300' 
                        : soal.nilai_soal.jawaban === 'C'
                        ? 'text-red-700 dark:text-red-300'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {soal.optionC}
                    </p>
                  </div>

                  {/* Option D */}
                  <div 
                    className={`p-3 rounded-lg border flex items-center ${
                      soal.correctAnswer === 'D' && soal.nilai_soal.jawaban === 'D'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : soal.correctAnswer === 'D'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : soal.nilai_soal.jawaban === 'D'
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div 
                      className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${
                        soal.correctAnswer === 'D' 
                          ? 'bg-green-500 text-white' 
                          : soal.nilai_soal.jawaban === 'D'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      D
                    </div>
                    <p className={`${
                      soal.correctAnswer === 'D' 
                        ? 'text-green-700 dark:text-green-300' 
                        : soal.nilai_soal.jawaban === 'D'
                        ? 'text-red-700 dark:text-red-300'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {soal.optionD}
                    </p>
                  </div>

                    <div 
                      className={`p-3 rounded-lg border flex items-center ${
                        soal.correctAnswer === 'E' && soal.nilai_soal.jawaban === 'E'
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          : soal.correctAnswer === 'E'
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          : soal.nilai_soal.jawaban === 'E'
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div 
                        className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${
                          soal.correctAnswer === 'E' 
                            ? 'bg-green-500 text-white' 
                            : soal.nilai_soal.jawaban === 'E'
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        E
                      </div>
                      <p className={`${
                        soal.correctAnswer === 'E' 
                          ? 'text-green-700 dark:text-green-300' 
                          : soal.nilai_soal.jawaban === 'E'
                          ? 'text-red-700 dark:text-red-300'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {soal.optionE}
                      </p>
                    </div>
                </div>

                {/* Answer summary */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div className="mb-2 sm:mb-0">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Jawaban anda: </span>
                      <span className={`font-medium ${soal.nilai_soal.benar ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {soal.nilai_soal.jawaban}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Jawaban benar: </span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {soal.correctAnswer}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailNilaiSaya;