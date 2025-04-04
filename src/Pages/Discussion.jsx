import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";
import { FaArrowUp, FaArrowDown, FaCommentDots, FaPlus, FaSearch, FaUser } from "react-icons/fa";
import { CiPaperplane } from "react-icons/ci";
import { FiMessageSquare, FiTrendingUp, FiUsers, FiFilter, FiClock, FiImage } from "react-icons/fi";
import { useStateContext } from "../contexts/ContextProvider";
import { Button } from "../components";

const questions = [
  {
    id: 1,
    title: "How to solve integration problems",
    description: "I'm struggling with advanced integration techniques in calculus. Could someone explain the method of substitution with a practical example?",
    author: "Parth",
    time: "a few seconds ago",
    upvotes: 0,
    downvotes: 0,
    comments: [],
    tags: ["Mathematics", "Calculus"],
    image: "https://sman1lhokseumawe.sch.id/wp-content/uploads/2022/08/WhatsApp-Image-2022-08-09-at-11.03.20-AM-1-1024x768.jpeg",
  },
  {
    id: 2,
    title: "What is blockchain technology, and how is it used in cryptocurrencies?",
    description: "Discover the revolutionary technology of blockchain and its impact on digital currencies like Bitcoin. I'm particularly interested in understanding the consensus mechanisms.",
    author: "Kartik",
    time: "11 minutes ago",
    upvotes: 0,
    downvotes: 0,
    comments: [{ author: "Alice", content: "Very informative!" }],
    tags: ["Technology", "Blockchain"],
  },
  {
    id: 3,
    title: "Best practices for React component optimization",
    description: "I'm working on a large-scale React application and facing performance issues. What are the best techniques for optimizing React components and preventing unnecessary re-renders?",
    author: "Rohan",
    time: "3 hours ago",
    upvotes: 5,
    downvotes: 1,
    comments: [
      { author: "Vedant", content: "Have you tried using React.memo or useMemo?" },
      { author: "Himanshu", content: "Don't forget to check your dependency arrays in useEffect!" }
    ],
    tags: ["Programming", "React"],
  }
];

const Discussion = () => {
  const { currentColor, currentMode } = useStateContext();
  const [data, setData] = useState(questions);
  const [showCommentForm, setShowCommentForm] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Dynamic styling based on current theme
  const gradientStyle = {
    background: currentMode === 'Dark' 
      ? `linear-gradient(135deg, ${currentColor}20 0%, ${currentColor}40 100%)`
      : `linear-gradient(135deg, ${currentColor}10 0%, ${currentColor}30 100%)`,
  };

  const buttonStyle = {
    backgroundColor: currentColor,
  };

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      console.log("berhasil");
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleVote = (id, type) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, [type]: item[type] + 1 } : item
      )
    );
  };

  const toggleCommentForm = (id) => {
    setShowCommentForm(showCommentForm === id ? null : id);
  };

  const handleAddComment = (id) => {
    if (commentText.trim()) {
      setData((prevData) =>
        prevData.map((item) =>
          item.id === id
            ? {
                ...item,
                comments: [
                  ...item.comments,
                  { author: "You", content: commentText },
                ],
              }
            : item
        )
      );
      setCommentText("");
      setShowCommentForm(null);
    }
  };

  const popularUsers = [
    { name: "Himanshu", posts: 42, avatar: "H" },
    { name: "Rohan", posts: 38, avatar: "R" },
    { name: "Ritika", posts: 35, avatar: "R" },
    { name: "Karan", posts: 31, avatar: "K" },
    { name: "Parth", posts: 29, avatar: "P" },
    { name: "Vedant", posts: 26, avatar: "V" },
    { name: "Kartik", posts: 23, avatar: "K" }
  ];
  
  const filters = ["All", "Popular", "Recent", "Unanswered", "My Questions"];

  return (
    <div className={`flex flex-col min-h-screen ${currentMode === 'Dark' ? 'bg-dark-bg text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Hero section with gradient background */}
      <div className="rounded-xl p-6 mx-6 mt-6 mb-4" style={gradientStyle}>
        <h1 className={`text-3xl font-bold ${currentMode === 'Dark' ? 'text-white' : 'text-gray-800'} mb-2`}>
          Forum Diskusi
        </h1>
        <p className={`${currentMode === 'Dark' ? 'text-gray-300' : 'text-gray-600'} max-w-2xl`}>
          Engage with the community, ask questions, and share your knowledge. Learn from experts and contribute to meaningful discussions.
        </p>
      </div>
      
      <div className="flex flex-1 px-6 pb-6 gap-6">
        {/* Main Content */}
        <main className="flex-1">
          {/* Search and action bar */}
          <div className={`mb-6 flex justify-between items-center ${currentMode === 'Dark' ? 'bg-secondary-dark-bg' : 'bg-white'} p-4 rounded-xl shadow-sm`}>
            <div className="relative flex-1 max-w-lg">
              <input
                type="text"
                placeholder="Search discussions..."
                className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
                  currentMode === 'Dark' 
                    ? 'bg-dark-bg border-gray-600 text-gray-200 focus:border-gray-500' 
                    : 'bg-gray-50 border-gray-200 text-gray-700 focus:border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-opacity-40`}
                style={{ focusRingColor: currentColor }}
              />
              <FaSearch className={`absolute left-3 top-3 ${currentMode === 'Dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            
            <Button
              color="white"
              bgColor={currentColor}
              text="Mulai Bertanya"
              borderRadius="10px"
              icon={<FaPlus />}
              width=""
            />
          </div>
          
          {/* Filters */}
          <div className="flex mb-6 overflow-x-auto gap-2">
            <button className="px-4 py-2 rounded-lg flex items-center shadow-sm"
                    style={{ backgroundColor: currentColor, color: 'white' }}>
              <FiFilter className="mr-2" /> Filter
            </button>
            
            {filters.map((filter) => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeFilter === filter
                    ? currentMode === 'Dark' 
                      ? 'bg-secondary-dark-bg border-2' 
                      : 'bg-white border-2'
                    : currentMode === 'Dark'
                      ? 'bg-dark-bg border border-gray-700 text-gray-300 hover:bg-secondary-dark-bg'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
                style={activeFilter === filter ? { borderColor: currentColor, color: currentColor } : {}}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Discussion Cards */}
          <div className="space-y-6">
            {data.map((question) => (
              <div
                key={question.id}
                className={`rounded-xl overflow-hidden border shadow-md transition-all duration-300 hover:shadow-lg ${
                  currentMode === 'Dark' 
                    ? 'bg-secondary-dark-bg border-gray-700 hover:border-gray-600' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Card Header with color */}
                <div className="h-1" style={{ backgroundColor: currentColor }}></div>
                
                <div className="p-6">
                  {/* Tags */}
                  {question.tags && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {question.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: currentMode === 'Dark' ? `${currentColor}20` : `${currentColor}10`,
                            borderColor: currentMode === 'Dark' ? `${currentColor}40` : `${currentColor}30`,
                            color: currentColor,
                            border: '1px solid'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Title and description */}
                  <h3 className={`text-xl font-bold mb-2 ${currentMode === 'Dark' ? 'text-white' : 'text-gray-800'}`}>
                    {question.title}
                  </h3>
                  <p className={`${currentMode === 'Dark' ? 'text-gray-300' : 'text-gray-600'} mb-4 text-sm`}>
                    {question.description}
                  </p>
                  
                  {/* Image if available */}
                  {question.image && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img
                        src={question.image}
                        alt="Question attachment"
                        className="w-full max-h-64 object-cover"
                      />
                    </div>
                  )}
                  
                  {/* User info and timestamp */}
                  <div className="flex items-center mb-4">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium mr-3"
                      style={{ backgroundColor: currentColor }}
                    >
                      {question.author.charAt(0)}
                    </div>
                    <div>
                      <p className={`font-medium ${currentMode === 'Dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                        {question.author}
                      </p>
                      <p className={`text-xs ${currentMode === 'Dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Posted {question.time}
                      </p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => handleVote(question.id, 'upvotes')} 
                      className={`flex items-center px-3 py-1.5 rounded-lg transition-colors ${
                        currentMode === 'Dark' 
                          ? 'hover:bg-dark-bg text-gray-300' 
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                      style={{ color: question.upvotes > 0 ? currentColor : '' }}
                    >
                      <FaArrowUp className="mr-1" /> 
                      <span>{question.upvotes}</span>
                    </button>
                    
                    <button 
                      onClick={() => handleVote(question.id, 'downvotes')} 
                      className={`flex items-center px-3 py-1.5 rounded-lg transition-colors ${
                        currentMode === 'Dark' 
                          ? 'hover:bg-dark-bg text-gray-300' 
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                      style={{ color: question.downvotes > 0 ? '#ef4444' : '' }}
                    >
                      <FaArrowDown className="mr-1" /> 
                      <span>{question.downvotes}</span>
                    </button>
                    
                    <button 
                      onClick={() => toggleCommentForm(question.id)}
                      className={`flex items-center px-3 py-1.5 rounded-lg transition-colors ${
                        currentMode === 'Dark' 
                          ? 'hover:bg-dark-bg text-gray-300' 
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                      style={{ color: question.comments.length > 0 ? currentColor : '' }}
                    >
                      <FaCommentDots className="mr-1" /> 
                      <span>{question.comments.length} {question.comments.length === 1 ? "reply" : "replies"}</span>
                    </button>
                  </div>
                  
                  {/* Comments */}
                  {question.comments.length > 0 && (
                    <div className={`mt-4 pt-4 border-t ${currentMode === 'Dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                      <h4 className={`text-sm font-medium mb-3 ${currentMode === 'Dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Replies
                      </h4>
                      <div className="space-y-3">
                        {question.comments.map((comment, index) => (
                          <div key={index} className={`p-3 rounded-lg ${currentMode === 'Dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
                            <div className="flex items-center mb-2">
                              <div 
                                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium mr-2"
                                style={{ backgroundColor: currentColor }}
                              >
                                {comment.author.charAt(0)}
                              </div>
                              <span className={`text-sm font-medium ${currentMode === 'Dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                {comment.author}
                              </span>
                            </div>
                            <p className={`text-sm ${currentMode === 'Dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                              {comment.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Comment form */}
                  {showCommentForm === question.id && (
                    <div className={`mt-4 pt-4 border-t ${currentMode === 'Dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        rows="3"
                        className={`w-full p-3 rounded-lg border ${
                          currentMode === 'Dark' 
                            ? 'bg-dark-bg border-gray-600 text-gray-200' 
                            : 'bg-gray-50 border-gray-200 text-gray-700'
                        } focus:outline-none focus:ring-2 focus:ring-opacity-40 mb-2`}
                        style={{ focusRingColor: currentColor }}
                      ></textarea>
                      <div className="flex justify-end">
                        <Button
                          onClick={() => toggleCommentForm(question.id)}
                          color={currentMode === 'Dark' ? 'gray-300' : 'gray-700'}
                          bgColor={currentMode === 'Dark' ? '#3a3a3a' : '#f5f5f5'}
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
        <aside className={`w-1/4 ${currentMode === 'Dark' ? 'bg-secondary-dark-bg border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm overflow-hidden sticky top-6 h-fit`}>
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="p-4" style={{ borderLeftColor: currentColor, borderLeftWidth: '4px' }}>
              <h2 className="text-xl font-semibold" style={{ color: currentColor }}>Top Users</h2>
            </div>
          </div>
          
          <ul className="p-4 space-y-3">
            {popularUsers.map((user, index) => (
              <li key={index} className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                currentMode === 'Dark' ? 'hover:bg-dark-bg' : 'hover:bg-gray-50'
              } cursor-pointer`}>
                <div className="flex items-center">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium mr-3"
                    style={{ backgroundColor: currentColor }}
                  >
                    {user.avatar}
                  </div>
                  <span className={currentMode === 'Dark' ? 'text-gray-200' : 'text-gray-700'}>
                    {user.name}
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  currentMode === 'Dark' 
                    ? 'bg-dark-bg text-gray-300' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {user.posts} posts
                </span>
              </li>
            ))}
          </ul>
          
          {/* Community Stats */}
          <div className={`p-4 border-t ${currentMode === 'Dark' ? 'border-gray-700 bg-dark-bg' : 'border-gray-200 bg-gray-50'}`}>
            <h3 className={`font-medium mb-3 ${currentMode === 'Dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              Community Statistics
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className={`p-3 rounded-lg ${currentMode === 'Dark' ? 'bg-secondary-dark-bg' : 'bg-white'}`}>
                <p className={`text-xs ${currentMode === 'Dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Active Discussions
                </p>
                <p className={`text-lg font-bold ${currentMode === 'Dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  128
                </p>
              </div>
              <div className={`p-3 rounded-lg ${currentMode === 'Dark' ? 'bg-secondary-dark-bg' : 'bg-white'}`}>
                <p className={`text-xs ${currentMode === 'Dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Members Online
                </p>
                <p className={`text-lg font-bold ${currentMode === 'Dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  42
                </p>
              </div>
            </div>
          </div>
          
          {/* Create Post Prompt */}
          <div className="p-4">
            <div className={`p-4 rounded-lg border ${currentMode === 'Dark' ? 'border-gray-700 bg-dark-bg' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: currentColor }}>
                  <FaUser />
                </div>
                <div>
                  <h4 className={`font-medium ${currentMode === 'Dark' ? 'text-white' : 'text-gray-800'}`}>Share Your Thoughts</h4>
                  <p className={`text-xs ${currentMode === 'Dark' ? 'text-gray-400' : 'text-gray-500'}`}>Join the conversation</p>
                </div>
              </div>
              <Button
                color="white"
                bgColor={currentColor}
                text="Create New Post"
                borderRadius="10px"
                width="full"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Discussion;