  /* eslint-disable react-hooks/exhaustive-deps */
  import React, { useState, useEffect } from "react";
  import axios from "axios";
  import { useDispatch } from "react-redux";
  import { useNavigate, useLocation } from "react-router-dom";
  import { getMe } from "../../features/authSlice";
  import { useStateContext } from "../../contexts/ContextProvider";
  import { FiClock, FiAlertCircle, FiCheckCircle, FiX } from "react-icons/fi";

  const StartQuiz = () => {
    const [siswaId, setSiswaId] = useState("")
    const [timeLeft, setTimeLeft] = useState(120 * 30); // 120 minutes in seconds
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showInstructions, setShowInstructions] = useState(true);
    const [userAnswers, setUserAnswers] = useState({});

    // Add state for confirmation modal
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const { currentColor, currentMode } = useStateContext();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const quizData = location.state || {};

    // Format time for display
    const formatTime = (seconds) => {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      return `${hrs.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        dispatch(getMe());
      }, [dispatch]);
    
      useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          getProfileSiswa();
        } else {
          navigate("/");
        }
      }, [navigate]);

    // Timer effect
    useEffect(() => {
      let timer;
      if (quizStarted && timeLeft > 0) {
        timer = setInterval(() => {
          setTimeLeft((prev) => prev - 1);
        }, 1000);
      } else if (timeLeft === 0) {
        // Handle quiz submission when time is up
        handleSubmitQuiz();
      }

      return () => clearInterval(timer);
    }, [quizStarted, timeLeft]);

    const getProfileSiswa = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const apiUrl = process.env.REACT_APP_URL_API;
        const response = await axios.get(`${apiUrl}/profile-siswa`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSiswaId(response.data.data.id)
      } catch (error) {
        console.error("Error fetching siswa profile:", error);
      }
    };

    // Parse questions from the quiz data passed from ListQuiz
    const formatQuestions = () => {
      if (!quizData.soalItems || !quizData.soalItems.length) {
        // Return a default/fallback question if no data is passed
        return [
          {
            id: 1,
            question:
              "Manakah dari opsi berikut yang BUKAN merupakan implementasi komentar dalam bahasa pemrograman Python?",
            options: [
              {
                id: "A",
                text: "# Variabel ini menyimpan nama 'Perseus Evans'\nname = 'Perseus Evans'",
                isCorrect: false,
              },
              {
                id: "B",
                text: "'''\nIni adalah Block Comment,\nTeks ini akan diabaikan oleh Python.\n'''\nprint(\"Hello World!\")",
                isCorrect: false,
              },
              {
                id: "C",
                text: "/*\nVariabel ini menyimpan nama 'Perseus Evans'\n*/\n\nname = Perseus Evans\nprint(name)",
                isCorrect: true,
              },
              {
                id: "D",
                text: 'print("Hello World!") # Menampilkan teks "Hello World!"',
                isCorrect: false,
              },
              { id: "E", text: "None of the above", isCorrect: false },
            ],
            category: "Pengenalan dengan Python",
            correctAnswer: "C",
          },
        ];
      }

      // Format the questions from the API data
      return quizData.soalItems.map((item) => {
        // Parse the soal field if it's in JSON format
        let questionText = item.soal;
        let questionData = null;

        try {
          const parsedQuestion = JSON.parse(item.soal);
          // Store the parsed question data for rendering
          if (parsedQuestion.ops) {
            questionData = parsedQuestion;

            // Also extract plain text for backup
            questionText = parsedQuestion.ops
              .map((op) => {
                if (typeof op.insert === "string") {
                  return op.insert;
                } else if (op.insert && op.insert.image) {
                  return `[Image]`;
                }
                return "";
              })
              .join("");
          }
        } catch (e) {
          // Not JSON, use as is
        }

        return {
          id: item.id,
          question: questionText,
          questionData: questionData, // Store the rich content data
          options: [
            { id: "A", text: item.optionA },
            { id: "B", text: item.optionB },
            { id: "C", text: item.optionC },
            { id: "D", text: item.optionD },
            { id: "E", text: item.optionE },
          ],
          category: item.pelajaran
            ? item.pelajaran.pelajaran
            : quizData.pelajaran,
          correctAnswer: item.correctAnswer,
        };
      });
    };

    const questions = formatQuestions();

    const startQuiz = () => {
      setQuizStarted(true);
      setShowInstructions(false);
    };

    // Modified to show confirmation modal instead of directly submitting
    const confirmSubmitQuiz = () => {
      setShowConfirmModal(true);
    };

    const handleSubmitQuiz = async () => {
      // Close the modal
      setShowConfirmModal(false);
    
      // Calculate score
      let score = 0;
      let totalQuestions = questions.length;
    
      // Collect soalIds of the quiz questions
      const soalIds = questions.map(q => q.id);
    
      questions.forEach((q) => {
        if (userAnswers[q.id] === q.correctAnswer) {
          score++;
        }
      });
    
      const percentage = Math.round((score / totalQuestions) * 100);
    
      try {
        // Get token from localStorage
        const token = localStorage.getItem("accessToken");
    
        let level = "Low";
        if (percentage > 66.66) {
          level = "High";
        } else if (percentage > 33.33) {
          level = "Medium";
        }
    
        // Prepare an array to store detailed answer information
        const detailedAnswers = questions.map(q => ({
          soalId: q.id,
          jawaban: userAnswers[q.id] || null,
          benar: userAnswers[q.id] === q.correctAnswer
        }));
    
        const quizResultData = {
          skor: percentage,
          level: level,
          jumlahSoal: totalQuestions,
          jumlahJawabanBenar: score,
          pelajaranId: quizData.pelajaranId || quizData.soalItems[0]?.pelajaranId,
          kelasId: quizData.kelasId || quizData.soalItems[0]?.kelasId,
          siswaId: siswaId,
          soalIds: soalIds, // Add the array of soal IDs
          detailedAnswers: detailedAnswers // Optional: detailed answer tracking
        };
    
        console.log("Submitting quiz data:", quizResultData);

        const apiUrl = process.env.REACT_APP_URL_API;
        const response = await axios.post(
          `${apiUrl}/nilai`,
          quizResultData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        navigate(`/hasil-quiz/${response.data.nilaiId}`);
      } catch (error) {
        console.error("Error saving quiz results:", error);
        alert(
          `Quiz selesai!\nSkor Anda: ${score} dari ${totalQuestions} (${percentage}%)\n\nTerjadi kesalahan saat menyimpan hasil: ${error.message}`
        );
        navigate("/quiz");
      }
    };

    const handleNextQuestion = () => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        // Show confirmation modal instead of direct submission
        confirmSubmitQuiz();
      }
    };

    const handlePrevQuestion = () => {
      if (currentQuestion > 0) {
        setCurrentQuestion((prev) => prev - 1);
      }
    };

    const renderQuestionContent = (question) => {
      // Check if we have rich content data
      if (question.questionData && question.questionData.ops) {
        return (
          <div className="question-content">
            {question.questionData.ops.map((op, index) => {
              if (typeof op.insert === "string") {
                // Handle text with line breaks
                return (
                  <p key={index} className="mb-2">
                    {op.insert.split("\n").map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < op.insert.split("\n").length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </p>
                );
              } else if (op.insert && op.insert.image) {
                // Handle images
                return (
                  <img
                    key={index}
                    src={op.insert.image}
                    alt="Question visual"
                    className="my-4 rounded-md max-w-full max-h-96 object-contain"
                  />
                );
              }
              return null;
            })}
          </div>
        );
      }
      // Fallback to simple text
      return (
        <p className="text-lg font-medium text-gray-800 dark:text-white">
          {question.question}
        </p>
      );
    };

    const gradientStyle = {
      background:
        currentMode === "Dark"
          ? `linear-gradient(135deg, ${currentColor}20 0%, ${currentColor}40 100%)`
          : `linear-gradient(135deg, ${currentColor}10 0%, ${currentColor}30 100%)`,
    };

    const buttonStyle = {
      backgroundColor: currentColor,
    };

    // Modal overlay styling
    const modalOverlayStyle = {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    };

    // Modal content styling
    const modalStyle = {
      backgroundColor: currentMode === "Dark" ? "#1F2937" : "white",
      borderRadius: "0.75rem",
      padding: "1.5rem",
      width: "100%",
      maxWidth: "28rem",
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    };

    // Confirmation Modal Component
    const ConfirmationModal = () => {
      if (!showConfirmModal) return null;

      return (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Konfirmasi
              </h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 dark:text-gray-300">
                Apakah yakin ingin mengakhiri jawab soal?
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitQuiz}
                className="px-4 py-2 rounded-lg text-white hover:opacity-90 focus:outline-none"
                style={buttonStyle}
              >
                Akhiri
              </button>
            </div>
          </div>
        </div>
      );
    };

    // Instructions Modal
    if (showInstructions) {
      return (
        <div className="p-6 dark:bg-gray-900 min-h-screen">
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div
              className="p-6 border-b border-gray-200 dark:border-gray-700"
              style={gradientStyle}
            >
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Instruksi Quiz
              </h1>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <FiClock
                    className="mr-3 text-xl"
                    style={{ color: currentColor }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      Waktu
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Anda memiliki waktu 120 menit untuk menyelesaikan quiz ini.
                    </p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <FiAlertCircle
                    className="mr-3 text-xl"
                    style={{ color: currentColor }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      Perhatian
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Pastikan koneksi internet stabil selama mengerjakan quiz.
                    </p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <FiCheckCircle
                    className="mr-3 text-xl"
                    style={{ color: currentColor }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      Pengerjaan
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Pilih satu jawaban yang tepat untuk setiap pertanyaan.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                  Informasi Quiz:
                </h3>
                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
                  <li>
                    Mata Pelajaran:{" "}
                    <span className="font-medium">
                      {quizData.pelajaran || "Tidak Tersedia"}
                    </span>
                  </li>
                  <li>
                    Kelas:{" "}
                    <span className="font-medium">
                      {quizData.kelas
                        ? `Kelas ${quizData.kelas}`
                        : "Tidak Tersedia"}
                    </span>
                  </li>
                  <li>
                    Jumlah Soal:{" "}
                    <span className="font-medium">{questions.length} soal</span>
                  </li>
                  <li>
                    Jenis Soal: <span className="font-medium">Pilihan Ganda</span>
                  </li>
                  <li>
                    Waktu: <span className="font-medium">120 menit</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <button
                  onClick={startQuiz}
                  className="px-8 py-3 rounded-lg text-white font-medium shadow-sm hover:opacity-90 transition-all"
                  style={buttonStyle}
                >
                  Mulai Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Quiz interface
    return (
      <div className="p-6 dark:bg-gray-900 min-h-screen">
        {/* Top bar with timer */}
        <div className="max-w-5xl mx-auto mb-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md flex justify-between items-center">
          <div className="flex items-center">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {quizData.pelajaran || "Quiz"}
            </span>
            <span className="mx-2 text-gray-400">|</span>
            <span className="text-gray-500 dark:text-gray-400">
              Soal {currentQuestion + 1} dari {questions.length}
            </span>
          </div>

          <div className="flex items-center">
            <div className="flex items-center bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-lg">
              <FiClock className="mr-2 text-lg" style={{ color: currentColor }} />
              <span
                className="font-mono font-bold"
                style={{ color: timeLeft < 300 ? "#ef4444" : currentColor }}
              >
                {formatTime(timeLeft)}
              </span>
            </div>

            <button
              onClick={confirmSubmitQuiz}
              className="ml-4 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
              style={buttonStyle}
            >
              Selesaikan Quiz
            </button>
          </div>
        </div>

        {/* Question content */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
            {/* Question header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-700 dark:text-gray-300">
                  Soal kategori: {questions[currentQuestion].category}
                </h3>
                <div className="flex space-x-2">
                  {questions.map((_, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 flex items-center justify-center rounded-md border ${
                        index === currentQuestion
                          ? "border-2 font-bold"
                          : "border"
                      } cursor-pointer`}
                      style={
                        index === currentQuestion
                          ? { borderColor: currentColor, color: currentColor }
                          : {}
                      }
                      onClick={() => setCurrentQuestion(index)}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="p-6">
              {renderQuestionContent(questions[currentQuestion])}

              <div className="space-y-4 mt-5">
                {questions[currentQuestion].options.map((option, index) => {
                  const isSelected =
                    userAnswers[questions[currentQuestion].id] === option.id;

                  return (
                    <div
                      key={index}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        isSelected
                          ? `border-2 ${
                              currentMode === "Dark"
                                ? "bg-gray-700"
                                : "bg-gray-50"
                            }`
                          : `border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700`
                      }`}
                      style={isSelected ? { borderColor: currentColor } : {}}
                      onClick={() =>
                        setUserAnswers({
                          ...userAnswers,
                          [questions[currentQuestion].id]: option.id,
                        })
                      }
                    >
                      <div className="flex items-start">
                        <div
                          className={`flex items-center justify-center w-6 h-6 rounded-full mr-3 mt-1 ${
                            isSelected
                              ? "text-white"
                              : "border border-gray-300 dark:border-gray-600"
                          }`}
                          style={
                            isSelected ? { backgroundColor: currentColor } : {}
                          }
                        >
                          <span className="text-sm">{option.id}</span>
                        </div>
                        <pre className="text-gray-700 dark:text-gray-300 font-mono text-sm whitespace-pre-wrap">
                          {option.text}
                        </pre>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-between">
              <button
                onClick={handlePrevQuestion}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  currentQuestion === 0
                    ? "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                disabled={currentQuestion === 0}
              >
                Soal Sebelumnya
              </button>

              <button
                onClick={handleNextQuestion}
                className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
                style={buttonStyle}
              >
                {currentQuestion === questions.length - 1
                  ? "Selesaikan"
                  : "Soal Berikutnya"}
              </button>
            </div>
          </div>
        </div>

        {/* Render the confirmation modal */}
        <ConfirmationModal />
      </div>
    );
  };

  export default StartQuiz;
