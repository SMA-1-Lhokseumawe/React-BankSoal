import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";
import { format } from 'date-fns';

import { MdDelete, MdCheckCircle, MdOutlineCancel } from "react-icons/md";
import { FiAlertCircle, FiBell } from "react-icons/fi";
import { BsFilter, BsCheckAll } from "react-icons/bs";
import { HiOutlineEye } from "react-icons/hi";
import { useStateContext } from "../contexts/ContextProvider";

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all"); // all, read, unread
  const { currentColor, currentMode } = useStateContext();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    } else if (user) {
      fetchNotifications();
    }
  }, [navigate, user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/notifications', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setNotifications(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications");
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/notifications/${id}/read`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      setNotifications(notifications.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      ));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch('http://localhost:5000/notifications/read-all', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      setNotifications(notifications.filter(notif => notif.id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const deleteAllNotifications = async () => {
    try {
      for (const notif of notifications) {
        await deleteNotification(notif.id);
      }
      setNotifications([]);
    } catch (err) {
      console.error("Error deleting all notifications:", err);
    }
  };

  const handleViewPost = (postId) => {
    navigate(`/diskusi/view/${postId}`);
  };

  const getFilteredNotifications = () => {
    switch (activeFilter) {
      case "read":
        return notifications.filter(notif => notif.isRead);
      case "unread":
        return notifications.filter(notif => !notif.isRead);
      default:
        return notifications;
    }
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  // Custom styles
  const getStatusStyles = (isRead) => {
    return {
      read: {
        bg: currentMode === 'Dark' ? 'bg-gray-700' : 'bg-gray-100',
        text: currentMode === 'Dark' ? 'text-gray-300' : 'text-gray-800'
      },
      unread: {
        bg: currentMode === 'Dark' ? 'bg-yellow-800/30' : 'bg-yellow-100',
        text: currentMode === 'Dark' ? 'text-yellow-300' : 'text-yellow-800'
      }
    }[isRead ? 'read' : 'unread'];
  };

  const getTypeStyles = (type) => {
    const styles = {
      comment: {
        bg: currentMode === 'Dark' ? 'bg-green-800/30' : 'bg-green-100',
        text: currentMode === 'Dark' ? 'text-green-300' : 'text-green-800'
      },
      like: {
        bg: currentMode === 'Dark' ? 'bg-red-800/30' : 'bg-red-100',
        text: currentMode === 'Dark' ? 'text-red-300' : 'text-red-800'
      },
      mention: {
        bg: currentMode === 'Dark' ? 'bg-purple-800/30' : 'bg-purple-100',
        text: currentMode === 'Dark' ? 'text-purple-300' : 'text-purple-800'
      },
      default: {
        bg: currentMode === 'Dark' ? 'bg-blue-800/30' : 'bg-blue-100',
        text: currentMode === 'Dark' ? 'text-blue-300' : 'text-blue-800'
      }
    };
    
    return styles[type] || styles.default;
  };

  // Header gradient style
  const gradientStyle = {
    background: currentMode === "Dark"
      ? `linear-gradient(to right, ${currentColor}30, ${currentColor}10)`
      : `linear-gradient(to right, ${currentColor}20, ${currentColor}05)`,
  };

  return (
    <div className="m-0 p-0">
      {/* Header with gradient background */}
        <div className="rounded-xl p-6 mx-8 mt-6 mb-4" style={gradientStyle}>
        <h1
          className={`text-3xl font-bold ${
            currentMode === "Dark" ? "text-white" : "text-gray-800"
          } mb-2`}
        >
          Halaman Notifikasi
        </h1>
        <p
          className={`${
            currentMode === "Dark" ? "text-gray-300" : "text-gray-600"
          } max-w-2xl`}
        >
          Kelola notifikasi Anda dan tetap perbarui
        </p>
      </div>

      {/* Main content container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Filter and actions card */}
        <div className={`rounded-xl shadow-sm mb-6 ${currentMode === 'Dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              {/* Filter tabs */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    activeFilter === "all" 
                      ? `text-white shadow-sm`
                      : `${currentMode === 'Dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`
                  }`}
                  style={activeFilter === "all" ? { backgroundColor: currentColor } : {}}
                >
                  <BsFilter />
                  All <span className="ml-1 text-sm">({notifications.length})</span>
                </button>
                <button
                  onClick={() => setActiveFilter("unread")}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    activeFilter === "unread" 
                      ? `text-white shadow-sm`
                      : `${currentMode === 'Dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`
                  }`}
                  style={activeFilter === "unread" ? { backgroundColor: currentColor } : {}}
                >
                  <FiBell />
                  Unread <span className="ml-1 text-sm">({unreadCount})</span>
                </button>
                <button
                  onClick={() => setActiveFilter("read")}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    activeFilter === "read" 
                      ? `text-white shadow-sm`
                      : `${currentMode === 'Dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`
                  }`}
                  style={activeFilter === "read" ? { backgroundColor: currentColor } : {}}
                >
                  <MdCheckCircle />
                  Read <span className="ml-1 text-sm">({notifications.length - unreadCount})</span>
                </button>
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="px-4 py-2 text-white rounded-lg flex items-center transition-all duration-200 hover:opacity-90 shadow-sm"
                    style={{ backgroundColor: currentColor }}
                  >
                    <BsCheckAll className="mr-2 text-lg" />
                    Mark all as read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={deleteAllNotifications}
                    className={`px-4 py-2 rounded-lg flex items-center transition-all duration-200 shadow-sm ${
                      currentMode === 'Dark' ? 'bg-red-700 text-white hover:bg-red-800' : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    <MdDelete className="mr-2" />
                    Clear all
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Notifications content area */}
        <div className={`rounded-xl shadow-sm overflow-hidden ${currentMode === 'Dark' ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Loading, error and empty states */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-3 border-t-transparent" style={{ borderColor: currentColor, borderTopColor: 'transparent' }}></div>
                <p className={`mt-4 ${currentMode === 'Dark' ? 'text-gray-400' : 'text-gray-600'}`}>Loading notifications...</p>
              </div>
            </div>
          ) : error ? (
            <div className={`flex flex-col justify-center items-center h-64 ${currentMode === 'Dark' ? 'text-red-400' : 'text-red-500'}`}>
              <FiAlertCircle className="text-3xl mb-2" />
              <p className="mb-4">{error}</p>
              <button 
                className="px-4 py-2 rounded-md text-sm hover:opacity-90 text-white shadow-sm"
                style={{ backgroundColor: currentColor }}
                onClick={fetchNotifications}
              >
                Retry
              </button>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className={`flex flex-col justify-center items-center h-64 ${currentMode === 'Dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              <FiBell className="text-5xl mb-4 opacity-50" />
              <p className="text-lg mb-2">
                {activeFilter === "all" 
                  ? "No notifications yet" 
                  : activeFilter === "unread" 
                    ? "No unread notifications" 
                    : "No read notifications"}
              </p>
              <p className={currentMode === 'Dark' ? 'text-gray-500' : 'text-gray-400'}>
                {activeFilter !== "all" && "Try changing the filter"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className={currentMode === 'Dark' ? 'bg-gray-900/60' : 'bg-gray-50'}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${currentMode === 'Dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Content
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${currentMode === 'Dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Type
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${currentMode === 'Dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Date
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${currentMode === 'Dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Status
                    </th>
                    <th className={`px-6 py-4 text-right text-xs font-medium uppercase tracking-wider ${currentMode === 'Dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${currentMode === 'Dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {filteredNotifications.map((notification) => {
                    const statusStyles = getStatusStyles(notification.isRead);
                    const typeStyles = getTypeStyles(notification.type);
                    
                    return (
                      <tr key={notification.id} 
                          className={`${!notification.isRead 
                            ? currentMode === 'Dark' 
                              ? 'bg-blue-900/20' 
                              : 'bg-blue-50' 
                            : ''} transition-colors hover:${currentMode === 'Dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <td className="px-6 py-4 whitespace-normal">
                          <div className="flex items-start gap-3 max-w-md">
                            {/* Avatar */}
                            <div 
                              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white overflow-hidden shadow-sm`}
                              style={{ 
                                backgroundColor: !notification.isRead 
                                  ? currentColor 
                                  : currentMode === 'Dark' 
                                    ? '#4B5563' 
                                    : '#E5E7EB'
                              }}
                            >
                              {notification.urlImageProfile ? (
                                <img 
                                  src={notification.urlImageProfile} 
                                  alt={notification.sourceUser?.username || "User"} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-lg font-semibold">
                                  {notification.sourceUser?.username?.charAt(0)?.toUpperCase() || "U"}
                                </span>
                              )}
                            </div>
                            
                            {/* Content */}
                            <div 
                              onClick={() => notification.postId && handleViewPost(notification.postId)} 
                              className={`cursor-pointer transition-colors group`}
                            >
                              <p className={`${!notification.isRead ? 'font-medium' : ''} ${
                                currentMode === 'Dark' ? 'text-gray-200' : 'text-gray-900'
                              }`}>
                                {notification.content}
                              </p>
                              {notification.postId && (
                                <p className={`text-xs mt-1 flex items-center gap-1 group-hover:underline`}
                                   style={{ color: currentColor }}>
                                  <HiOutlineEye size={14} /> Lihat Diskusi
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${typeStyles.bg} ${typeStyles.text}`}>
                            {notification.type || 'notification'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm" 
                            style={{ color: currentMode === 'Dark' ? '#9ca3af' : '#6b7280' }}>
                          {format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${statusStyles.bg} ${statusStyles.text}`}>
                            {notification.isRead ? 'Read' : 'Unread'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end items-center space-x-2">
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className={`p-2 rounded-full transition-colors ${
                                  currentMode === 'Dark' 
                                    ? 'text-green-400 hover:bg-green-900/30' 
                                    : 'text-green-600 hover:bg-green-100'
                                }`}
                                title="Mark as read"
                              >
                                <MdCheckCircle className="text-xl" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className={`p-2 rounded-full transition-colors ${
                                currentMode === 'Dark' 
                                  ? 'text-red-400 hover:bg-red-900/30' 
                                  : 'text-red-600 hover:bg-red-100'
                              }`}
                              title="Delete notification"
                            >
                              <MdDelete className="text-xl" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;