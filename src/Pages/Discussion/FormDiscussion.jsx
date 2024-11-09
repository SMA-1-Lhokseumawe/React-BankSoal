import React, { useState } from 'react';
import { FaArrowUp, FaArrowDown, FaCommentDots, FaPlus } from 'react-icons/fa';
import Navbar from "./Navbar/Navbar";

const questions = [
  {
    id: 1,
    title: 'How to solve integration problems',
    description: 'some desc',
    author: 'Parth',
    time: 'a few seconds ago',
    upvotes: 0,
    downvotes: 0,
    comments: [],
  },
  {
    id: 2,
    title: 'What is blockchain technology, and how is it used in cryptocurrencies?',
    description: 'Discover the revolutionary technology of blockchain and its impact on digital currencies like Bitcoin.',
    author: 'Kartik',
    time: '11 minutes ago',
    upvotes: 0,
    downvotes: 0,
    comments: [{ author: 'Alice', content: 'Very informative!' }],
  }
];

const FormDiscussion = () => {
  const [data, setData] = useState(questions);
  const [showCommentForm, setShowCommentForm] = useState(null);
  const [commentText, setCommentText] = useState('');

  const handleVote = (id, type) => {
    setData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, [type]: item[type] + 1 } : item
      )
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
<Navbar />
    
        <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-1/5 p-4 bg-white shadow-lg">
            <h2 className="text-xl font-semibold text-orange-600">Home</h2>
            <ul className="mt-4 space-y-3">
            <li className="text-gray-600 cursor-pointer hover:text-orange-600">Explore Topics</li>
            <li className="text-gray-600 cursor-pointer hover:text-orange-600">Chat</li>
            <li className="text-gray-600 cursor-pointer hover:text-orange-600">My QnA</li>
            </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Discussion Forum</h1>
            <button className="flex items-center bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700">
                <FaPlus className="mr-2" /> Start a New Topic
            </button>
            </div>

            {/* Discussion Cards */}
            {data.map((question) => (
            <div key={question.id} className="p-4 bg-white shadow-lg rounded-lg mb-4">
                <h3 className="text-lg font-semibold mb-1 text-gray-800">{question.title}</h3>
                <p className="text-gray-600 mb-2">{question.description}</p>
                <div className="flex items-center text-gray-500 text-sm mb-2">
                <span>posted by {question.author}</span>
                <span className="mx-2">&bull;</span>
                <span>{question.time}</span>
                </div>
                <div className="flex items-center space-x-4">
                <button onClick={() => handleVote(question.id, 'upvotes')} className="flex items-center text-gray-600 hover:text-orange-600">
                    <FaArrowUp className="mr-1" /> {question.upvotes}
                </button>
                <button onClick={() => handleVote(question.id, 'downvotes')} className="flex items-center text-gray-600 hover:text-orange-600">
                    <FaArrowDown className="mr-1" /> {question.downvotes}
                </button>
                <button className="flex items-center text-gray-600 hover:text-orange-600">
                    <FaCommentDots className="mr-1" /> {question.comments.length} {question.comments.length === 1 ? "reply" : "replies"}
                </button>
                </div>
            </div>
            ))}
        </main>

        {/* Right Sidebar */}
        <aside className="w-1/5 p-4 bg-white shadow-lg">
            <h2 className="text-xl font-semibold text-orange-600">Top Users</h2>
            <ul className="mt-4 space-y-2">
            {["Himanshu", "Rohan", "Ritika", "Karan", "Parth", "Vedant", "Kartik"].map((user, index) => (
                <li key={index} className="text-gray-600 hover:text-orange-600 cursor-pointer">
                <span className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-gray-300"></span>
                    <span>{user}</span>
                </span>
                </li>
            ))}
            </ul>
        </aside>
        </div>
    </div>
  );
};

export default FormDiscussion;
