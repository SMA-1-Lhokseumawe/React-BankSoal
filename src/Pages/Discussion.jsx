import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";
import {
  FaChevronDown,
  FaChevronUp,
  FaCommentDots,
  FaPlus,
  FaSearch,
  FaUser,
  FaTimes,
  FaTrash,
  FaEdit,
  FaEllipsisV,
} from "react-icons/fa";
import { CiPaperplane } from "react-icons/ci";
import { FiFilter } from "react-icons/fi";
import { useStateContext } from "../contexts/ContextProvider";
import { Button } from "../components";

const Discussion = () => {
  const [post, setPost] = useState([]);
  const [postWithoutComment, setPostWithoutComment] = useState([]);
  const [myPost, setMyPost] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [namaProfile, setNamaProfile] = useState("");
  const [urlImageProfile, seturlImageProfile] = useState("");
  const [showCommentForm, setShowCommentForm] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);

  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  const [showReplies, setShowReplies] = useState({});

  // Image modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  const { currentColor, currentMode } = useStateContext();

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Dynamic styling based on current theme
  const gradientStyle = {
    background:
      currentMode === "Dark"
        ? `linear-gradient(135deg, ${currentColor}20 0%, ${currentColor}40 100%)`
        : `linear-gradient(135deg, ${currentColor}10 0%, ${currentColor}30 100%)`,
  };

  const toggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  // Function to open image modal
  const openImageModal = (imageUrl) => {
    setCurrentImage(imageUrl);
    setIsModalOpen(true);
  };

  // Function to close image modal
  const closeImageModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentImage("");
  }, []);

  // Add keyboard event listener for Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closeImageModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isModalOpen, closeImageModal]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Periksa apakah menu aktif dan klik tidak berada di dalam elemen dengan kelas menu-container
      if (activeMenu && !event.target.closest(".menu-container")) {
        setActiveMenu(null);
      }
    };

    // Tambahkan event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Bersihkan event listener saat komponen di-unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenu]);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      getAllPost();
      getAllPostWithoutComment();
      getAllComments();
      getMyPost();
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
      const response = await axios.get("http://localhost:5000/profile-siswa", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.data) {
        const profileData = response.data.data;
        setNamaProfile(profileData.nama);
        seturlImageProfile(profileData.url);
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
      const response = await axios.get("http://localhost:5000/profile-guru", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.data) {
        const profileData = response.data.data;
        setNamaProfile(profileData.nama);
        seturlImageProfile(profileData.url);
      } else {
        console.error("Format data tidak sesuai:", response.data);
      }
    } catch (error) {
      console.error("Error mengambil profile guru:", error);
    }
  };

  const getAllPost = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:5000/all-post", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const transformedPosts = response.data
        .map((post) => ({
          ...post,
          comments: post.comments || [],
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setPost(transformedPosts);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const getAllPostWithoutComment = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:5000/post-nocomment", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const transformedPosts = response.data
        .map((post) => ({
          ...post,
          comments: post.comments || [],
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setPostWithoutComment(transformedPosts);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const getMyPost = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:5000/post", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const transformedPosts = response.data
        .map((post) => ({
          ...post,
          comments: post.comments || [],
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setMyPost(transformedPosts);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  let displayedPosts = [];
  if (activeFilter === "All") {
    displayedPosts = post;
  } else if (activeFilter === "Unanswered") {
    displayedPosts = postWithoutComment;
  } else if (activeFilter === "My Questions") {
    displayedPosts = myPost;
  }

  const toggleCommentForm = (id) => {
    setShowCommentForm(showCommentForm === id ? null : id);
  };

  const toggleReplies = (id) => {
    setShowReplies((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddComment = async (id) => {
    if (commentText.trim()) {
      try {
        const token = localStorage.getItem("accessToken");
        await axios.post(
          "http://localhost:5000/komentar",
          {
            content: commentText,
            postId: id,
            namaProfile: namaProfile,
            urlImageProfile: urlImageProfile,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCommentText("");
        setShowCommentForm(null);
        getAllComments(); // Refresh comments after posting
      } catch (error) {
        console.error("Error posting comment:", error);
        alert("Failed to post comment. Please try again.");
      }
    }
  };

  const getAllComments = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:5000/all-komentar", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const getCommentsForPost = (postId) => {
    return allComments.filter((comment) => comment.postId === postId);
  };

  const handleEditComment = (commentId) => {
    const comment = allComments.find((comment) => comment.id === commentId);
    if (comment) {
      setEditCommentId(commentId);
      setEditCommentText(comment.content);
    }
  };

  const handleUpdateComment = async () => {
    if (editCommentText.trim()) {
      try {
        const token = localStorage.getItem("accessToken");
        await axios.patch(
          `http://localhost:5000/komentar/${editCommentId}`,
          {
            content: editCommentText,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEditCommentId(null);
        setEditCommentText("");
        getAllComments(); // Refresh comments after updating
      } catch (error) {
        console.error("Error updating comment:", error);
        alert("Failed to update comment. Please try again.");
      }
    }
  };

  const handleDeleteComment = async (id) => {
    const token = localStorage.getItem("accessToken");
    await axios.delete(`http://localhost:5000/komentar/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    getAllComments();
  };

  const handleDeletePost = async (id) => {
    const token = localStorage.getItem("accessToken");
    await axios.delete(`http://localhost:5000/post/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    getMyPost();
    getAllPost();
  };

  const handleEditDiscussion = (id) => {
    console.log("Editing discussion with ID:", id);
    navigate(`/diskusi/edit/${id}`);
  };

  const calculateTopUsers = useCallback(() => {
    const calculatedTopUsers = _(post)
      .groupBy("namaProfile")
      .map((posts, name) => ({
        name: name,
        posts: posts.length,
        avatar: name.charAt(0).toUpperCase(),
        urlImageProfile: posts[0].urlImageProfile,
      }))
      .orderBy("posts", "desc")
      .take(7)
      .value();

    setTopUsers(calculatedTopUsers);
  }, [post]);

  useEffect(() => {
    calculateTopUsers();
  }, [calculateTopUsers]);

  const filters = ["All", "Unanswered", "My Questions"];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col min-h-screen mt-5 ${
        currentMode === "Dark"
          ? "bg-dark-bg text-white"
          : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* Hero section with gradient background */}
      <div className="rounded-xl p-6 mx-6 mt-6 mb-4" style={gradientStyle}>
        <h1
          className={`text-3xl font-bold ${
            currentMode === "Dark" ? "text-white" : "text-gray-800"
          } mb-2`}
        >
          Forum Diskusi
        </h1>
        <p
          className={`${
            currentMode === "Dark" ? "text-gray-300" : "text-gray-600"
          } max-w-2xl`}
        >
          Berinteraksilah dengan komunitas, ajukan pertanyaan, dan bagikan
          pengetahuan Anda. Belajarlah dari para ahli dan berkontribusilah pada
          diskusi yang bermakna.
        </p>
      </div>

      <div className="flex flex-1 px-6 pb-6 gap-6">
        {/* Main Content */}
        <main className="flex-1">
          {/* Search and action bar */}
          <div
            className={`mb-6 flex justify-between items-center ${
              currentMode === "Dark" ? "bg-secondary-dark-bg" : "bg-white"
            } p-4 rounded-xl shadow-sm`}
          >
            <div className="relative flex-1 max-w-lg">
              <input
                type="text"
                placeholder="Search discussions..."
                className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
                  currentMode === "Dark"
                    ? "bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-gray-600"
                    : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-500 focus:border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-opacity-40`}
                style={{
                  focusRingColor: currentColor,
                  backgroundColor: currentMode === "Dark" ? "#1F2937" : "", // Explicitly set dark background
                }}
              />
              <FaSearch
                className={`absolute left-3 top-3 ${
                  currentMode === "Dark" ? "text-gray-400" : "text-gray-500"
                }`}
              />
            </div>

            <Button
              color="white"
              bgColor={currentColor}
              text="Mulai Bertanya"
              borderRadius="10px"
              icon={<FaPlus />}
              width=""
              onClick={() => navigate("/add-diskusi")}
            />
          </div>

          {/* Filters */}
          <div className="flex mb-6 overflow-x-auto gap-2">
            <button
              className="px-4 py-2 rounded-lg flex items-center shadow-sm"
              style={{ backgroundColor: currentColor, color: "white" }}
            >
              <FiFilter className="mr-2" /> Filter
            </button>

            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeFilter === filter
                    ? currentMode === "Dark"
                      ? "bg-secondary-dark-bg border-2"
                      : "bg-white border-2"
                    : currentMode === "Dark"
                    ? "bg-dark-bg border border-gray-700 text-gray-300 hover:bg-secondary-dark-bg"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
                style={
                  activeFilter === filter
                    ? { borderColor: currentColor, color: currentColor }
                    : {}
                }
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Discussion Cards */}
          <div className="space-y-6">
            {displayedPosts.map((question) => (
              <div
                key={question.id}
                className={`rounded-xl overflow-hidden border shadow-md transition-all duration-300 hover:shadow-lg ${
                  currentMode === "Dark"
                    ? "bg-secondary-dark-bg border-gray-700 hover:border-gray-600"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Card Header with color */}
                <div
                  className="h-1"
                  style={{ backgroundColor: currentColor }}
                ></div>

                <div className="p-6">
                  {/* Top row with tags and menu */}
                  <div className="flex justify-between items-start mb-3">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {question.kategori &&
                        question.kategori.map((kategori, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor:
                                currentMode === "Dark"
                                  ? `${currentColor}20`
                                  : `${currentColor}10`,
                              borderColor:
                                currentMode === "Dark"
                                  ? `${currentColor}40`
                                  : `${currentColor}30`,
                              color: currentColor,
                              border: "1px solid",
                            }}
                          >
                            {kategori}
                          </span>
                        ))}
                    </div>

                    {/* Three-dot menu - Only show in My Questions filter */}
                    {activeFilter === "My Questions" && (
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(question.id);
                          }}
                          className={`p-2 rounded-full transition-colors ${
                            currentMode === "Dark"
                              ? "hover:bg-dark-bg text-gray-300"
                              : "hover:bg-gray-100 text-gray-600"
                          }`}
                        >
                          <FaEllipsisV size={16} />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenu === question.id && (
                          <div
                            className={`absolute right-0 mt-1 py-2 w-32 rounded-md shadow-lg z-10 menu-container ${
                              currentMode === "Dark"
                                ? "bg-secondary-dark-bg border border-gray-700"
                                : "bg-white border border-gray-200"
                            }`}
                          >
                            <button
                              className={`w-full text-left px-4 py-2 text-sm ${
                                currentMode === "Dark"
                                  ? "text-blue-300 hover:bg-dark-bg"
                                  : "text-blue-700 hover:bg-gray-100"
                              } flex items-center`}
                              onClick={(e) => {
                                e.stopPropagation(); // Mencegah event bubbling
                                handleEditDiscussion(question.id);
                              }}
                            >
                              <FaEdit className="mr-2" size={14} /> Edit
                            </button>
                            <button
                              className={`w-full text-left px-4 py-2 text-sm ${
                                currentMode === "Dark"
                                  ? "text-red-400 hover:bg-dark-bg"
                                  : "text-red-500 hover:bg-gray-100"
                              } flex items-center`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePost(question.id);
                              }}
                            >
                              <FaTrash className="mr-2" size={14} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Title and description */}
                  <h3
                    className={`text-xl font-bold mb-2 ${
                      currentMode === "Dark" ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {question.judul}
                  </h3>
                  <p
                    className={`${
                      currentMode === "Dark" ? "text-gray-300" : "text-gray-600"
                    } mb-4 text-sm`}
                  >
                    {question.content}
                  </p>

                  {/* Image if available */}
                  {question.url && question.url.length > 0 && (
                    <div className="mb-4">
                      {question.url.length === 1 ? (
                        /* Single image display */
                        <div
                          className="rounded-lg overflow-hidden cursor-pointer"
                          onClick={() => openImageModal(question.url[0])}
                        >
                          <img
                            src={question.url[0]}
                            alt="Question attachment"
                            className="w-full max-h-64 object-cover hover:opacity-90 transition-opacity"
                          />
                        </div>
                      ) : (
                        /* Multiple images display */
                        <div className="grid grid-cols-2 gap-2">
                          {question.url.map((imageUrl, idx) => (
                            <div
                              key={idx}
                              className={`rounded-lg overflow-hidden cursor-pointer ${
                                question.url.length === 3 && idx === 2
                                  ? "col-span-2"
                                  : ""
                              }`}
                              onClick={() => openImageModal(imageUrl)}
                            >
                              <img
                                src={imageUrl}
                                alt={`Attachment ${idx + 1}`}
                                className="w-full h-40 object-cover hover:opacity-90 transition-opacity"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* User info and timestamp */}
                  <div className="flex items-center mb-4">
                    {question.urlImageProfile ? (
                      <img
                        src={question.urlImageProfile}
                        alt={`${question.namaProfile}'s profile`}
                        className="w-8 h-8 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium mr-3"
                        style={{ backgroundColor: currentColor }}
                      >
                        {question.namaProfile.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p
                        className={`font-medium ${
                          currentMode === "Dark"
                            ? "text-gray-200"
                            : "text-gray-800"
                        }`}
                      >
                        {question.namaProfile}
                        <span
                          className={`ml-2 text-xs font-normal ${
                            currentMode === "Dark"
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          {question.user.role}
                        </span>
                      </p>
                      <p
                        className={`text-xs ${
                          currentMode === "Dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        Posted {new Date(question.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleCommentForm(question.id)}
                      className={`flex items-center px-3 py-1.5 rounded-lg transition-colors ${
                        currentMode === "Dark"
                          ? "hover:bg-dark-bg text-gray-300"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                      style={{
                        color:
                          getCommentsForPost(question.id).length > 0
                            ? currentColor
                            : "",
                      }}
                    >
                      <FaCommentDots className="mr-1" />
                      <span>
                        {getCommentsForPost(question.id).length}{" "}
                        {getCommentsForPost(question.id).length === 1
                          ? "reply"
                          : "replies"}
                      </span>
                    </button>

                    {/* Show Replies button - this is the new button added */}
                    {getCommentsForPost(question.id).length > 0 && (
                      <button
                        onClick={() => toggleReplies(question.id)}
                        className={`flex items-center px-3 py-1.5 rounded-lg transition-colors ${
                          currentMode === "Dark"
                            ? "hover:bg-dark-bg text-gray-300"
                            : "hover:bg-gray-100 text-gray-600"
                        }`}
                        style={{ color: currentColor }}
                      >
                        {showReplies[question.id] ? (
                          <FaChevronUp className="mr-1" />
                        ) : (
                          <FaChevronDown className="mr-1" />
                        )}
                        <span>
                          {showReplies[question.id] ? "Hide" : "Show"} Replies
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Comments */}
                  {getCommentsForPost(question.id).length > 0 &&
                    showReplies[question.id] && (
                      <div
                        className={`mt-4 pt-4 border-t ${
                          currentMode === "Dark"
                            ? "border-gray-700"
                            : "border-gray-200"
                        }`}
                      >
                        <h4
                          className={`text-sm font-medium mb-3 ${
                            currentMode === "Dark"
                              ? "text-gray-300"
                              : "text-gray-700"
                          }`}
                        >
                          Replies
                        </h4>
                        <div className="space-y-3">
                          {getCommentsForPost(question.id).map((comment) => (
                            <div
                              key={comment.id}
                              className={`p-3 rounded-lg ${
                                currentMode === "Dark"
                                  ? "bg-dark-bg"
                                  : "bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  {comment.urlImageProfile ? (
                                    <img
                                      src={comment.urlImageProfile}
                                      alt={`${
                                        comment.namaProfile ||
                                        comment.user.username
                                      }'s profile`}
                                      className="w-6 h-6 rounded-full object-cover mr-2"
                                    />
                                  ) : (
                                    <div
                                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium mr-2"
                                      style={{
                                        backgroundColor: currentColor,
                                      }}
                                    >
                                      {(
                                        comment.namaProfile ||
                                        comment.user.username
                                      )
                                        .charAt(0)
                                        .toUpperCase()}
                                    </div>
                                  )}
                                  <span
                                    className={`text-sm font-medium ${
                                      currentMode === "Dark"
                                        ? "text-gray-200"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {comment.namaProfile ||
                                      comment.user.username}
                                    <span
                                      className={`ml-2 text-xs font-normal ${
                                        currentMode === "Dark"
                                          ? "text-gray-400"
                                          : "text-gray-500"
                                      }`}
                                    >
                                      {comment.user.role}
                                    </span>
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <span
                                    className={`text-xs ${
                                      currentMode === "Dark"
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {new Date(
                                      comment.createdAt
                                    ).toLocaleString()}
                                  </span>
                                  {comment.user.username === user.username && (
                                    <div className="flex ml-3">
                                      <button
                                        onClick={() =>
                                          handleEditComment(comment.id)
                                        }
                                        className={`p-1.5 rounded-md transition-all flex items-center justify-center ${
                                          currentMode === "Dark"
                                            ? "bg-gray-800 text-gray-300 hover:bg-blue-800 hover:text-blue-300"
                                            : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                                        }`}
                                        title="Edit comment"
                                      >
                                        <FaEdit size={14} />
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDeleteComment(comment.id)
                                        }
                                        className={`p-1.5 rounded-md transition-all flex items-center justify-center ml-2 ${
                                          currentMode === "Dark"
                                            ? "bg-gray-800 text-gray-300 hover:bg-red-900 hover:text-red-300"
                                            : "bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600"
                                        }`}
                                        title="Delete comment"
                                      >
                                        <FaTrash size={14} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                              {editCommentId === comment.id ? (
                                <div>
                                  <textarea
                                    value={editCommentText}
                                    onChange={(e) =>
                                      setEditCommentText(e.target.value)
                                    }
                                    rows="3"
                                    className={`w-full p-3 rounded-lg border ${
                                      currentMode === "Dark"
                                        ? "bg-dark-bg border-gray-600 text-gray-200"
                                        : "bg-gray-50 border-gray-200 text-gray-700"
                                    } focus:outline-none focus:ring-2 focus:ring-opacity-40 mb-2`}
                                    style={{ focusRingColor: currentColor }}
                                  ></textarea>
                                  <div className="flex justify-end mt-2">
                                    <Button
                                      onClick={() => setEditCommentId(null)}
                                      color={
                                        currentMode === "Dark"
                                          ? "gray-300"
                                          : "gray-700"
                                      }
                                      bgColor={
                                        currentMode === "Dark"
                                          ? "#3a3a3a"
                                          : "#f5f5f5"
                                      }
                                      text="Cancel"
                                      borderRadius="10px"
                                      width=""
                                      className="mr-2"
                                    />
                                    <Button
                                      onClick={handleUpdateComment}
                                      color="white"
                                      bgColor={currentColor}
                                      text="Update"
                                      borderRadius="10px"
                                      width=""
                                    />
                                  </div>
                                </div>
                              ) : (
                                <p
                                  className={`text-sm ${
                                    currentMode === "Dark"
                                      ? "text-gray-300"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {comment.content}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Comment form */}
                  {showCommentForm === question.id && (
                    <div
                      className={`mt-4 pt-4 border-t ${
                        currentMode === "Dark"
                          ? "border-gray-700"
                          : "border-gray-200"
                      }`}
                    >
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        rows="3"
                        className={`w-full p-3 rounded-lg border ${
                          currentMode === "Dark"
                            ? "bg-dark-bg border-gray-600 text-gray-200"
                            : "bg-gray-50 border-gray-200 text-gray-700"
                        } focus:outline-none focus:ring-2 focus:ring-opacity-40 mb-2`}
                        style={{ focusRingColor: currentColor }}
                      ></textarea>
                      <div className="flex justify-end">
                        <Button
                          onClick={() => toggleCommentForm(question.id)}
                          color={
                            currentMode === "Dark" ? "gray-300" : "gray-700"
                          }
                          bgColor={
                            currentMode === "Dark" ? "#3a3a3a" : "#f5f5f5"
                          }
                          text="Cancel"
                          borderRadius="10px"
                          width=""
                          className="mr-2"
                        />
                        <Button
                          onClick={() => handleAddComment(question.id)}
                          color="white"
                          bgColor={currentColor}
                          text="Post Comment"
                          borderRadius="10px"
                          icon={<CiPaperplane />}
                          width=""
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside
          className={`w-1/4 ${
            currentMode === "Dark"
              ? "bg-secondary-dark-bg border-gray-700"
              : "bg-white border-gray-200"
          } border rounded-xl shadow-sm overflow-hidden sticky top-6 h-fit`}
        >
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div
              className="p-4"
              style={{ borderLeftColor: currentColor, borderLeftWidth: "4px" }}
            >
              <h2
                className="text-xl font-semibold"
                style={{ color: currentColor }}
              >
                Top Users
              </h2>
            </div>
          </div>

          <ul className="p-4 space-y-3">
            {topUsers.map((user, index) => (
              <li
                key={index}
                className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                  currentMode === "Dark"
                    ? "hover:bg-dark-bg"
                    : "hover:bg-gray-50"
                } cursor-pointer`}
              >
                <div className="flex items-center">
                  {user.urlImageProfile ? (
                    <img
                      src={user.urlImageProfile}
                      alt={`${user.name}'s profile`}
                      className="w-8 h-8 rounded-full object-cover mr-3"
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium mr-3"
                      style={{ backgroundColor: currentColor }}
                    >
                      {user.avatar}
                    </div>
                  )}
                  <span
                    className={
                      currentMode === "Dark" ? "text-gray-200" : "text-gray-700"
                    }
                  >
                    {user.name}
                  </span>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    currentMode === "Dark"
                      ? "bg-dark-bg text-gray-300"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {user.posts} posts
                </span>
              </li>
            ))}
          </ul>

          {/* Create Post Prompt */}
          <div className="p-4">
            <div
              className={`p-4 rounded-lg border ${
                currentMode === "Dark"
                  ? "border-gray-700 bg-dark-bg"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: currentColor }}
                >
                  <FaUser />
                </div>
                <div>
                  <h4
                    className={`font-medium ${
                      currentMode === "Dark" ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Share Your Thoughts
                  </h4>
                  <p
                    className={`text-xs ${
                      currentMode === "Dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Join the conversation
                  </p>
                </div>
              </div>
              <Button
                color="white"
                bgColor={currentColor}
                text="Create New Post"
                borderRadius="10px"
                width="full"
                onClick={() => navigate("/add-diskusi")}
              />
            </div>
          </div>
        </aside>
      </div>

      {/* Image Modal/Lightbox */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeImageModal}
        >
          <div className="relative max-w-4xl max-h-screen p-2">
            <img
              src={currentImage}
              alt="Enlarged view"
              className="max-h-[90vh] max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all"
              onClick={closeImageModal}
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discussion;
