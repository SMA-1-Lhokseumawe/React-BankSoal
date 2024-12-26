import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

import { FaArrowUp, FaArrowDown, FaCommentDots, FaPlus } from "react-icons/fa";
import { CiPaperplane } from "react-icons/ci";
import { useStateContext } from "../contexts/ContextProvider";
import { Button } from "../components";

const questions = [
  {
    id: 1,
    title: "How to solve integration problems",
    description: "some desc",
    author: "Parth",
    time: "a few seconds ago",
    upvotes: 0,
    downvotes: 0,
    comments: [],
    image:
      "https://sman1lhokseumawe.sch.id/wp-content/uploads/2022/08/WhatsApp-Image-2022-08-09-at-11.03.20-AM-1-1024x768.jpeg",
  },
  {
    id: 2,
    title:
      "What is blockchain technology, and how is it used in cryptocurrencies?",
    description:
      "Discover the s revolutionary technology of blockchain and its impact on digital currencies like Bitcoin.",
    author: "Kartik",
    time: "11 minutes ago",
    upvotes: 0,
    downvotes: 0,
    comments: [{ author: "Alice", content: "Very informative!" }],
  },
];

const Discussion = () => {
  const { currentColor } = useStateContext();
  const [data, setData] = useState(questions);
  const [showCommentForm, setShowCommentForm] = useState(null);
  const [commentText, setCommentText] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
  }, [isError, navigate]);

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

  return (
    <div className="flex dark:text-white dark:bg-dark-bg">
      {/* Main Content */}
      <main className="flex-1 p-6 ">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Forum Diskusi</h1>

          <Button
            color="white"
            bgColor={currentColor}
            borderRadius="10px"
            icon={<FaPlus />}
            text="Mulai Bertanya"
            width="full"
          />
        </div>

        {/* Discussion Cards */}
        {data.map((question) => (
          <div
          key={question.id}
          className="p-4 bg-white border border-gray-300 rounded-lg mb-4 dark:text-white dark:bg-secondary-dark-bg shadow-xl" // Add shadow-xl for all sides
        >
          <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-white">
            {question.title}
          </h3>
          <p className="text-gray-600 mb-2 dark:text-gray-100">
            {question.description}
          </p>
        
          {/* Conditionally render the image if it exists */}
          {question.image && (
            <div className="mt-4">
              <img
                src={question.image}
                alt="question image"
                className="w-full h-auto rounded-md"
                style={{ width: "400px", height: "250px" }}
              />
            </div>
          )}
        
          <div className="flex items-center text-gray-500 text-sm mb-2 dark:text-gray-300">
            <span>posted by {question.author}</span>
            <span className="mx-2">&bull;</span>
            <span>{question.time}</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleVote(question.id, "upvotes")}
              className="flex items-center text-gray-500"
              style={{ hover: currentColor }}
              onMouseEnter={(e) => (e.target.style.color = currentColor)}
              onMouseLeave={(e) => (e.target.style.color = "gray")}
            >
              <FaArrowUp className="mr-1" /> {question.upvotes}
            </button>
            <button
              onClick={() => handleVote(question.id, "downvotes")}
              className="flex items-center text-gray-500"
              style={{ hover: currentColor }}
              onMouseEnter={(e) => (e.target.style.color = currentColor)}
              onMouseLeave={(e) => (e.target.style.color = "gray")}
            >
              <FaArrowDown className="mr-1" /> {question.downvotes}
            </button>
            <button
              onClick={() => toggleCommentForm(question.id)}
              className="flex items-center text-gray-500"
              style={{ hover: currentColor }}
              onMouseEnter={(e) => (e.target.style.color = currentColor)}
              onMouseLeave={(e) => (e.target.style.color = "gray")}
            >
              <FaCommentDots className="mr-1" /> {question.comments.length}{" "}
              {question.comments.length === 1 ? "reply" : "replies"}
            </button>
          </div>
          {showCommentForm === question.id && (
            <div className="mt-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                rows="3"
                className="w-full border border-gray-300 rounded-md p-2 mb-2 dark:bg-secondary-dark-bg"
              ></textarea>
              <Button
                onClick={() => handleAddComment(question.id)}
                color="white"
                bgColor={currentColor}
                borderRadius="10px"
                icon={<CiPaperplane />}
                text="Post Comment"
                width="full"
              />
            </div>
          )}
          {question.comments.length > 0 && (
            <div className="mt-4 space-y-2">
              {question.comments.map((comment, index) => (
                <div
                  key={index}
                  className="text-gray-700 border-t border-gray-200 pt-2 dark:text-gray-300"
                >
                  <strong>{comment.author}:</strong> {comment.content}
                </div>
              ))}
            </div>
          )}
        </div>
        
        ))}
      </main>

      {/* Right Sidebar */}
      <aside className="w-1/5 p-4 bg-white shadow-lg dark:text-gray-100 dark:bg-secondary-dark-bg">
        <h2 className="text-xl font-semibold text-purple-600">Top Users</h2>
        <ul className="mt-4 space-y-2">
          {[
            "Himanshu",
            "Rohan",
            "Ritika",
            "Karan",
            "Parth",
            "Vedant",
            "Kartik",
          ].map((user, index) => (
            <li
              key={index}
              className="text-gray-600 dark:text-gray-100 hover:text-purple-600 cursor-pointer"
            >
              <span className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-gray-300"></span>
                <span>{user}</span>
              </span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default Discussion;
