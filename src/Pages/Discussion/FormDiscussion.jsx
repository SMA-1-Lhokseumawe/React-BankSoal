import React, { useState } from 'react';
import { FaArrowUp, FaArrowDown, FaCommentDots, FaPlus, FaSearch } from 'react-icons/fa';
import { FiMessageSquare, FiTrendingUp, FiUsers, FiFilter, FiClock } from 'react-icons/fi';
import Navbar from "./Navbar/Navbar";
import { useStateContext } from "../../contexts/ContextProvider";

const questions = [
  {
    id: 1,
    title: 'How to solve integration problems',
    description: 'I\'m struggling with advanced integration techniques in calculus. Could someone explain the method of substitution with a practical example?',
    author: 'Parth',
    time: 'a few seconds ago',
    upvotes: 0,
    downvotes: 0,
    comments: [],
    tags: ['Mathematics', 'Calculus']
  },
  {
    id: 2,
    title: 'What is blockchain technology, and how is it used in cryptocurrencies?',
    description: 'Discover the revolutionary technology of blockchain and its impact on digital currencies like Bitcoin. I\'m particularly interested in understanding the consensus mechanisms.',
    author: 'Kartik',
    time: '11 minutes ago',
    upvotes: 0,
    downvotes: 0,
    comments: [{ author: 'Alice', content: 'Very informative!' }],
    tags: ['Technology', 'Blockchain']
  },
  {
    id: 3,
    title: 'Best practices for React component optimization',
    description: 'I\'m working on a large-scale React application and facing performance issues. What are the best techniques for optimizing React components and preventing unnecessary re-renders?',
    author: 'Rohan',
    time: '3 hours ago',
    upvotes: 5,
    downvotes: 1,
    comments: [
      { author: 'Vedant', content: 'Have you tried using React.memo or useMemo?' },
      { author: 'Himanshu', content: 'Don\'t forget to check your dependency arrays in useEffect!' }
    ],
    tags: ['Programming', 'React']
  },
  {
    id: 4,
    title: 'Understanding machine learning algorithms for beginners',
    description: 'I\'m new to the field of machine learning and finding it overwhelming. Can anyone recommend a structured approach to understanding fundamental ML algorithms?',
    author: 'Ritika',
    time: '1 day ago',
    upvotes: 12,
    downvotes: 0,
    comments: [],
    tags: ['AI', 'Machine Learning']
  }
];

const FormDiscussion = () => {
  const [data, setData] = useState(questions);
  const [showCommentForm, setShowCommentForm] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Import context for dynamic styling
  const { currentColor, currentMode } = useStateContext();

  // Dynamic styling based on current theme
  const gradientStyle = {
    background: currentMode === 'Dark' 
      ? `linear-gradient(135deg, ${currentColor}20 0%, ${currentColor}40 100%)`
      : `linear-gradient(135deg, ${currentColor}10 0%, ${currentColor}30 100%)`,
  };

  const buttonStyle = {
    backgroundColor: currentColor,
  };

  const handleVote = (id, type) => {
    setData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, [type]: item[type] + 1 } : item
      )
    );
  };

  const handleAddComment = (id) => {
    if (commentText.trim() === '') return;
    
    setData(prevData =>
      prevData.map(item =>
        item.id === id ? { 
          ...item, 
          comments: [...item.comments, { author: 'You', content: commentText }] 
        } : item
      )
    );
    setCommentText('');
    setShowCommentForm(null);
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
  
  const filters = ['All', 'Popular', 'Recent', 'Unanswered', 'My Questions'];

  return (
    <div className={`flex flex-col min-h-screen ${currentMode === 'Dark' ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
      <Navbar />
      
      {/* Hero section with gradient background */}
      <div className="rounded-xl p-6 mx-6 mt-6 mb-4" style={gradientStyle}>
        <h1 className={`text-3xl font-bold ${currentMode === 'Dark' ? 'text-white' : 'text-gray-800'} mb-2`}>
          Discussion Forum
        </h1>
        <p className={`${currentMode === 'Dark' ? 'text-gray-300' : 'text-gray-600'} max-w-2xl`}>
          Engage with the community, ask questions, and share your knowledge. Learn from experts and contribute to meaningful discussions.
        </p>
      </div>
      
      <div className="flex flex-1 px-6 pb-6 gap-6">
        {/* Sidebar */}
        <aside className={`w-1/5 ${currentMode === 'Dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm overflow-hidden sticky top-6 h-fit`}>
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="p-4" style={{ borderLeftColor: currentColor, borderLeftWidth: '4px' }}>
              <h2 className="text-xl font-semibold" style={{ color: currentColor }}>Navigation</h2>
            </div>
          </div>
          
          <ul className="p-4 space-y-2">
            <li className={`p-3 rounded-lg flex items-center ${currentMode === 'Dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} cursor-pointer transition-all`}
                style={{ color: currentColor }}>
              <FiMessageSquare className="mr-3" />
              <span className="font-medium">All Discussions</span>
            </li>
            <li className={`p-3 rounded-lg flex items-center ${currentMode === 'Dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-50 text-gray-600'} cursor-pointer transition-all`}>
              <FiTrendingUp className="mr-3" />
              <span>Trending Topics</span>
            </li>
            <li className={`p-3 rounded-lg flex items-center ${currentMode === 'Dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-50 text-gray-600'} cursor-pointer transition-all`}>
              <FiUsers className="mr-3" />
              <span>My Network</span>
            </li>
            <li className={`p-3 rounded-lg flex items-center ${currentMode === 'Dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-50 text-gray-600'} cursor-pointer transition-all`}>
              <FiClock className="mr-3" />
              <span>Recent Activity</span>
            </li>
          </ul>
          
          <div className={`p-4 mt-4 ${currentMode === 'Dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h3 className="font-medium mb-2">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-xs ${currentMode === 'Dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                Mathematics
              </span>
              <span className={`px-3 py-1 rounded-full text-xs ${currentMode === 'Dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                Programming
              </span>
              <span className={`px-3 py-1 rounded-full text-xs ${currentMode === 'Dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                Science
              </span>
              <span className={`px-3 py-1 rounded-full text-xs ${currentMode === 'Dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                Technology
              </span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Search and filter bar */}
          <div className={`p-4 mb-4 ${currentMode === 'Dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm flex justify-between items-center`}>
            <div className="relative flex-1 max-w-lg">
              <input
                type="text"
                placeholder="Search discussions..."
                className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
                  currentMode === 'Dark' 
                    ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-gray-500' 
                    : 'bg-gray-50 border-gray-200 text-gray-700 focus:border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-opacity-40`}
                style={{ focusRingColor: currentColor }}
              />
              <FaSearch className={`absolute left-3 top-3 ${currentMode === 'Dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            
            <button 
              className="flex items-center px-5 py-2.5 rounded-lg text-white font-medium shadow-sm hover:shadow-md transition-all ml-4"
              style={buttonStyle}
            >
              <FaPlus className="mr-2" /> New Discussion
            </button>
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
                      ? 'bg-gray-700 border-2' 
                      : 'bg-white border-2'
                    : currentMode === 'Dark'
                      ? 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
                style={activeFilter === filter ? { borderColor: currentColor, color: currentColor } : {}}
              >
                {filter}
              </button>
            ))}
          </div>
          
          {/* Discussion Cards */}
          <div className="space-y-4">
            {data.map((question) => (
              <div 
                key={question.id} 
                className={`rounded-xl overflow-hidden border shadow-sm transition-all duration-300 hover:shadow-md ${
                  currentMode === 'Dark' 
                    ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Card Header with color */}
                <div className="h-1" style={{ backgroundColor: currentColor }}></div>
                
                <div className="p-6">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {question.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          currentMode === 'Dark' 
                            ? `bg-${currentColor.replace('#', '')}-900 bg-opacity-30 text-${currentColor.replace('#', '')}-300 border border-${currentColor.replace('#', '')}-800`
                            : `bg-${currentColor.replace('#', '')}-100 text-${currentColor.replace('#', '')}-800 border border-${currentColor.replace('#', '')}-200`
                        }`}
                        style={{ 
                          backgroundColor: currentMode === 'Dark' ? `${currentColor}20` : `${currentColor}10`,
                          borderColor: currentMode === 'Dark' ? `${currentColor}40` : `${currentColor}30`,
                          color: currentColor
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Title and description */}
                  <h3 className={`text-xl font-bold mb-2 ${currentMode === 'Dark' ? 'text-white' : 'text-gray-800'}`}>
                    {question.title}
                  </h3>
                  <p className={`${currentMode === 'Dark' ? 'text-gray-300' : 'text-gray-600'} mb-4 text-sm`}>
                    {question.description}
                  </p>
                  
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
                          ? 'hover:bg-gray-700 text-gray-300' 
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <FaArrowUp className="mr-1" style={{ color: question.upvotes > 0 ? currentColor : 'inherit' }} /> 
                      <span>{question.upvotes}</span>
                    </button>
                    
                    <button 
                      onClick={() => handleVote(question.id, 'downvotes')} 
                      className={`flex items-center px-3 py-1.5 rounded-lg transition-colors ${
                        currentMode === 'Dark' 
                          ? 'hover:bg-gray-700 text-gray-300' 
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <FaArrowDown className="mr-1" style={{ color: question.downvotes > 0 ? '#ef4444' : 'inherit' }} /> 
                      <span>{question.downvotes}</span>
                    </button>
                    
                    <button 
                      onClick={() => setShowCommentForm(showCommentForm === question.id ? null : question.id)}
                      className={`flex items-center px-3 py-1.5 rounded-lg transition-colors ${
                        currentMode === 'Dark' 
                          ? 'hover:bg-gray-700 text-gray-300' 
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <FaCommentDots className="mr-1" /> 
                      <span>{question.comments.length} {question.comments.length === 1 ? "reply" : "replies"}</span>
                    </button>
                  </div>
                  
                  {/* Comments section */}
                  {question.comments.length > 0 && (
                    <div className={`mt-4 pt-4 border-t ${currentMode === 'Dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                      <h4 className={`text-sm font-medium mb-3 ${currentMode === 'Dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Replies
                      </h4>
                      <div className="space-y-3">
                        {question.comments.map((comment, index) => (
                          <div key={index} className={`p-3 rounded-lg ${currentMode === 'Dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
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
                        placeholder="Add a reply..."
                        className={`w-full p-3 rounded-lg border ${
                          currentMode === 'Dark' 
                            ? 'bg-gray-700 border-gray-600 text-gray-200' 
                            : 'bg-gray-50 border-gray-200 text-gray-700'
                        } focus:outline-none focus:ring-2 focus:ring-opacity-40 min-h-20`}
                        style={{ focusRingColor: currentColor }}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      ></textarea>
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => setShowCommentForm(null)}
                          className={`px-4 py-2 rounded-lg mr-2 ${
                            currentMode === 'Dark' 
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleAddComment(question.id)}
                          className="px-4 py-2 rounded-lg text-white font-medium hover:opacity-90"
                          style={buttonStyle}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className={`w-1/5 ${currentMode === 'Dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm overflow-hidden sticky top-6 h-fit`}>
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="p-4" style={{ borderLeftColor: currentColor, borderLeftWidth: '4px' }}>
              <h2 className="text-xl font-semibold" style={{ color: currentColor }}>Top Contributors</h2>
            </div>
          </div>
          
          <ul className="p-4 space-y-3">
            {popularUsers.map((user, index) => (
              <li key={index} className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                currentMode === 'Dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
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
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {user.posts} posts
                </span>
              </li>
            ))}
          </ul>
          
          {/* Engagement Statistics */}
          <div className={`p-4 border-t ${currentMode === 'Dark' ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
            <h3 className={`font-medium mb-3 ${currentMode === 'Dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              Community Statistics
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className={`p-3 rounded-lg ${currentMode === 'Dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <p className={`text-xs ${currentMode === 'Dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Active Discussions
                </p>
                <p className={`text-lg font-bold ${currentMode === 'Dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  128
                </p>
              </div>
              <div className={`p-3 rounded-lg ${currentMode === 'Dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <p className={`text-xs ${currentMode === 'Dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Members Online
                </p>
                <p className={`text-lg font-bold ${currentMode === 'Dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  42
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FormDiscussion;