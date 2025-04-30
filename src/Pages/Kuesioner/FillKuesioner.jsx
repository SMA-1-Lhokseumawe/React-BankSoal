import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/authSlice";
import { useStateContext } from "../../contexts/ContextProvider";

const FillKuesioner = () => {
  const [siswaId, setSiswaId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState({});
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState({ A: 0, B: 0, C: 0 });
  const [percentages, setPercentages] = useState({ Visual: 0, Auditori: 0, Kinestetik: 0 });
  const [learningStyle, setLearningStyle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPages = 3;

  const dispatch = useDispatch();
  const { currentColor } = useStateContext();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      getProfileSiswa();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    // Calculate progress based on current page
    setProgress((currentPage / totalPages) * 100);
  }, [currentPage]);

  useEffect(() => {
    // Calculate results when showing results
    if (showResults) {
      calculateResults();
    }
  }, [showResults]);

  const getProfileSiswa = async () => {
    setIsLoading(true);
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
      } else {
        console.error("Format data tidak sesuai:", response.data);
      }
    } catch (error) {
      console.error("Error mengambil profile siswa:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSiswa = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("gayaBelajar", learningStyle);
    formData.append("persentaseVisual", percentages.Visual);
    formData.append("persentaseAuditori", percentages.Auditori);
    formData.append("persentaseKinestetik", percentages.Kinestetik);

    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.REACT_APP_URL_API;
      await axios.patch(`${apiUrl}/siswa/${siswaId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/hasil-tes");
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  const allQuestions = [
    // Page 1
    [
      {
        id: 1,
        question: "Ketika saya mengoperasikan peralatan baru, saya biasanya :",
        options: {
          A: "Membaca petunjuknya terlebih dahulu",
          B: "Mendengarkan penjelasan dari seseorang yang pernah menggunakannya",
          C: "Menggunakannya langsung, saya bisa belajar ketika menggunakannya",
        },
      },
      {
        id: 2,
        question: "Ketika saya perlu petunjuk untuk bepergian, saya biasanya :",
        options: {
          A: "Melihat map atau peta",
          B: "Bertanya denah atau arah ke orang lain",
          C: "Menggunakan kompas dan mengikutinya",
        },
      },
      {
        id: 3,
        question: "Ketika saya baru memasak, saya biasanya melakukan :",
        options: {
          A: "Mengikuti petunjuk resep tertulis",
          B: "Meminta penjelasan kepada seorang teman",
          C: "Mengikuti naluri, mencicipi selagi memasaknya",
        },
      },
      {
        id: 4,
        question:
          "Jika saya mengajar seseorang tentang sesuatu yang baru, saya cenderung untuk :",
        options: {
          A: "Menulis instruksi untuk mereka",
          B: "Memberikan penjelasan secara lisan",
          C: "Memperagakan terlebih dahulu, kemudian meminta mereka untuk mempraktekkannya",
        },
      },
      {
        id: 5,
        question: "Saya cenderung mengatakan:",
        options: {
          A: "Lihat bagaimana saya melakukannya",
          B: "Dengarkan penjelasan saya",
          C: "Silahkan dikerjakan",
        },
      },
      {
        id: 6,
        question: "Selama waktu luang, saya paling menikmati saat :",
        options: {
          A: "Pergi ke museum atau perpustakaan",
          B: "Mendengarkan musik dan berbincang dengan teman-teman saya",
          C: "Berolahraga atau mengerjakan apa saja",
        },
      },
      {
        id: 7,
        question:
          "Ketika saya pergi berbelanja pakaian, saya cenderung untuk :",
        options: {
          A: "Membayangkan apakah pakaian tersebut cocok untuk saya",
          B: "Meminta rekomendasi dengan karyawan toko",
          C: "Mencoba pakaian dan melihat kecocokannya",
        },
      },
      {
        id: 8,
        question: "Saat merencanakan liburan, saya biasanya :",
        options: {
          A: "Membaca banyak informasi tempat berlibur di internet atau brosur",
          B: "Meminta rekomendasi dari teman-teman",
          C: "Membayangkan akan seperti apa jika berada di sana",
        },
      },
      {
        id: 9,
        question: "Jika saya ingin membeli mobil baru, saya akan :",
        options: {
          A: "Membaca ulasan di internet, koran, dan majalah",
          B: "Membahas apa yang saya butuhkan dengan teman-teman",
          C: "Mencoba banyak jenis mobil yang berbeda",
        },
      },
      {
        id: 10,
        question:
          "Ketika saya sedang belajar keterampilan baru, saya paling senang :",
        options: {
          A: "Melihat apa yang pengajar lakukan",
          B: "Menanyakan ke pengajar tentang apa yang seharusnya saya lakukan",
          C: "Mencoba dan mempraktekkannya secara langsung",
        },
      },
    ],
    // Page 2
    [
      {
        id: 11,
        question:
          "Jika saya memilih makanan pada daftar menu, saya cenderung untuk :",
        options: {
          A: "Membayangkan makanannya akan seperti apa",
          B: "Menanyakan rekomendasi menu",
          C: "Membayangkan seperti apa rasa makanan itu",
        },
      },
      {
        id: 12,
        question:
          "Ketika saya mendengarkan pertunjukan sebuah band, saya cenderung untuk :",
        options: {
          A: "Melihat anggota band dan orang lain di antara para penonton",
          B: "Mendengarkan lirik dan nada",
          C: "Terbawa dalam suasana dan musik",
        },
      },
      {
        id: 13,
        question: "Ketika saya berkonsentrasi, saya paling sering :",
        options: {
          A: "Fokus pada kata-kata atau gambar-gambar di depan saya",
          B: "Membahas masalah dan memikirkan solusi yang mungkin dapat dilakukan",
          C: "Banyak bergerak, bermain dengan pena dan pensil, atau menyentuh sesuatu",
        },
      },
      {
        id: 14,
        question: "Saya memilih peralatan rumah tangga, berdasarkan :",
        options: {
          A: "Warnanya dan bagaimana penampilannya",
          B: "Penjelasan dari salesnya",
          C: "Tekstur peralatan tersebut dan bagaimana rasanya ketika menyentuhnya",
        },
      },
      {
        id: 15,
        question: "Saya mudah mengingat dan memahami sesuatu, dengan cara :",
        options: {
          A: "Melihat sesuatu",
          B: "Mendengarkan sesuatu",
          C: "Melakukan sesuatu",
        },
      },
      {
        id: 16,
        question: "Ketika saya cemas, saya akan :",
        options: {
          A: "Membayangkan kemungkinan terburuk",
          B: "Memikirkan hal yang paling mengkhawatirkan",
          C: "Tidak bisa duduk tenang, terus menerus berkeliling, dan memegang sesuatu",
        },
      },
      {
        id: 17,
        question: "Saya dapat mengingat orang lain, karena :",
        options: {
          A: "Penampilan mereka",
          B: "Apa yang mereka katakan kepada saya",
          C: "Bagaimana cara mereka memperlakukan saya",
        },
      },
      {
        id: 18,
        question: "Saat gagal ujian, saya biasanya :",
        options: {
          A: "Menulis banyak catatan perbaikan",
          B: "Membahas catatan saya sendiri atau dengan orang lain",
          C: "Membuat kemajuan belajar dengan memperbaiki jawaban",
        },
      },
      {
        id: 19,
        question: "Ketika menjelaskan sesuatu, saya cenderung :",
        options: {
          A: "Menunjukkan kepada mereka apa yang saya maksud",
          B: "Menjelaskan kepada mereka dengan berbagai cara sampai mereka mengerti",
          C: "Memotivasi mereka untuk mencoba dan menyampaikan ide saya ketika mereka mengerjakan",
        },
      },
      {
        id: 20,
        question: "Saya sangat suka :",
        options: {
          A: "Menonton film, fotografi, melihat seni atau mengamati orang-orang sekitar",
          B: "Mendengarkan musik, radio atau bincang-bincang dengan teman-teman",
          C: "Berperan serta dalam kegiatan olahraga, menikmati makanan yang disajikan, atau menari",
        },
      },
    ],
    // Page 3
    [
      {
        id: 21,
        question: "Sebagian besar waktu luang, saya habiskan :",
        options: {
          A: "Menonton televisi atau menonton film",
          B: "Mengobrol dengan teman-teman",
          C: "Melakukan aktivitas fisik atau membuat sesuatu",
        },
      },
      {
        id: 22,
        question: "Ketika pertama kali bertemu orang baru, saya biasanya :",
        options: {
          A: "Membayangkan kegiatan yang akan dilakukan",
          B: "Berbicara dengan mereka melalui telepon",
          C: "Mencoba melakukan sesuatu bersama-sama, misalnya suatu kegiatan atau makan bersama",
        },
      },
      {
        id: 23,
        question: "Saya memperhatikan seseorang, melalui :",
        options: {
          A: "Tampilannya dan pakaiannya",
          B: "Suara dan cara berbicaranya",
          C: "Tingkah lakunya",
        },
      },
      {
        id: 24,
        question: "Jika saya marah, saya cenderung untuk :",
        options: {
          A: "Terus mengingat hal yang membuat saya marah",
          B: "Menyampaikan ke orang-orang sekitar tentang perasaan saya",
          C: "Menunjukkan kemarahan saya, misalnya : menghentakkan kaki, membanting pintu, dan lainnya",
        },
      },
      {
        id: 25,
        question: "Saya merasa lebih mudah untuk mengingat :",
        options: {
          A: "Wajah",
          B: "Nama",
          C: "Hal-hal yang telah saya lakukan",
        },
      },
      {
        id: 26,
        question:
          "Saya dapat mengetahui seseorang melakukan kebohongan, jika :",
        options: {
          A: "Mereka menghindari kontak mata",
          B: "Perubahan suara mereka",
          C: "Mereka menunjukkan perilaku yang aneh",
        },
      },
      {
        id: 27,
        question: "Ketika saya bertemu dengan teman lama :",
        options: {
          A: `Saya berkata "Senang bertemu denganmu!"`,
          B: `Saya berkata "Senang mendengar kabar tentangmu!"`,
          C: "Saya memberi mereka pelukan atau jabat tangan",
        },
      },
      {
        id: 28,
        question: "Saya mudah mengingat sesuatu, dengan cara :",
        options: {
          A: "Menulis catatan atau menyimpan materi",
          B: "Mengucapkan dan mengulang poin penting di pikiran saya",
          C: "Melakukan dan mempraktikkan secara langsung",
        },
      },
      {
        id: 29,
        question:
          "Jika saya mengeluh tentang barang rusak yang sudah dibeli, saya akan memilih untuk :",
        options: {
          A: "Menulis surat pengaduan",
          B: "Menyampaikan keluhan melalui telepon",
          C: "Mengembalikannya ke toko atau mengirimkannya ke kantor pusat",
        },
      },
      {
        id: 30,
        question: "Saya cenderung mengatakan :",
        options: {
          A: "Saya paham apa yang anda maksud",
          B: "Saya mendengar apa yang anda katakan",
          C: "Saya tahu bagaimana yang Anda rasakan",
        },
      },
    ],
  ];

  // Get current questions based on page
  const currentQuestions = allQuestions[currentPage - 1] || [];

  // Handle answer selection
  const handleAnswerSelect = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  // Handle next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    } else {
      setShowResults(true);
    }
  };

  // Calculate final results with percentages
  const calculateResults = () => {
    const counts = { A: 0, B: 0, C: 0 };

    Object.values(answers).forEach((answer) => {
      counts[answer] = (counts[answer] || 0) + 1;
    });

    setResults(counts);

    // Calculate percentages
    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    const calculatedPercentages = {
      Visual: Math.round((counts.A / total) * 100),
      Auditori: Math.round((counts.B / total) * 100),
      Kinestetik: Math.round((counts.C / total) * 100)
    };
    
    setPercentages(calculatedPercentages);

    // Determine dominant learning style
    const maxCount = Math.max(counts.A, counts.B, counts.C);
    if (maxCount === counts.A) {
      setLearningStyle("Visual");
    } else if (maxCount === counts.B) {
      setLearningStyle("Auditori");
    } else {
      setLearningStyle("Kinestetik");
    }
  };

  // Check if current page questions are all answered
  const isCurrentPageComplete = () => {
    const questionIds = currentQuestions.map((q) => q.id);
    return questionIds.every((id) => answers[id]);
  };

  // Progress bar style
  const progressBarStyle = {
    width: `${progress}%`,
    backgroundColor: currentColor,
  };

  // Button style
  const buttonStyle = {
    backgroundColor: currentColor,
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              Tes Gaya Belajar
            </h1>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
              Jawablah pertanyaan berikut ini sesuai dengan tingkat kecocokan
              berdasarkan kondisimu saat ini
            </p>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="relative">
                <div className="overflow-hidden h-3 text-xs flex rounded-full bg-blue-200 dark:bg-gray-700">
                  <div
                    style={progressBarStyle}
                    className="rounded-full transition-all duration-500 ease-in-out"
                  ></div>
                </div>
                <div className="text-right mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {currentPage}/{totalPages}
                </div>
              </div>
            </div>
          </div>

          {/* Results Container */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 text-center">
              {/* Trophy Icon */}
              <div className="flex justify-center mb-6">
                <img
                  src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmYzEwNyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItYXdhcmQiPjxjaXJjbGUgY3g9IjEyIiBjeT0iOCIgcj0iNyI+PC9jaXJjbGU+PHBhdGggZD0iTTguMjEgMTMuODlMNyAyM2w1LTMgNSAzLTEuMjEtOS4xMiI+PC9wYXRoPjwvc3ZnPg=="
                  alt="Trophy"
                  className="w-24 h-24"
                />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Hore! Kamu telah berhasil menyelesaikan Tes Gaya Belajar, yuk
                cari tahu hasilnya!
              </h2>

              {/* View Results Button */}
              <button
                onClick={updateSiswa}
                className="px-8 py-3 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                style={buttonStyle}
              >
                Lihat Hasil
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Tes Gaya Belajar
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            Jawablah pertanyaan berikut ini sesuai dengan tingkat kecocokan
            berdasarkan kondisimu saat ini
          </p>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="relative">
              <div className="overflow-hidden h-3 text-xs flex rounded-full bg-blue-200 dark:bg-gray-700">
                <div
                  style={progressBarStyle}
                  className="rounded-full transition-all duration-500 ease-in-out"
                ></div>
              </div>
              <div className="text-right mt-1 text-sm text-gray-600 dark:text-gray-400">
                {currentPage}/{totalPages}
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-10">
          {currentQuestions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
            >
              <h2 className="text-xl font-medium text-gray-800 dark:text-white mb-6">
                {index + 1}. {question.question}
              </h2>

              <div className="space-y-4">
                {Object.entries(question.options).map(([key, value]) => (
                  <div key={key} className="flex items-start">
                    <div className="mr-4">
                      <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        {key}.
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 dark:text-gray-300">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Option Buttons */}
              <div className="flex justify-center mt-8 space-x-4">
                {Object.keys(question.options).map((key) => (
                  <button
                    key={key}
                    className={`w-16 h-16 rounded-lg font-bold text-xl transition-all duration-300 ${
                      answers[question.id] === key
                        ? `text-white shadow-lg transform scale-105`
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                    style={
                      answers[question.id] === key
                        ? { backgroundColor: currentColor }
                        : {}
                    }
                    onClick={() => handleAnswerSelect(question.id, key)}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Next Button */}
        <div className="flex justify-center mt-10 mb-16">
          <button
            onClick={handleNextPage}
            disabled={!isCurrentPageComplete()}
            className={`px-8 py-3 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ${
              isCurrentPageComplete()
                ? "transform hover:scale-105"
                : "opacity-50 cursor-not-allowed"
            }`}
            style={buttonStyle}
          >
            {currentPage < totalPages ? "SELANJUTNYA" : "SELESAI"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FillKuesioner;