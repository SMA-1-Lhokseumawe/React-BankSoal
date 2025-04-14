import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";
import { format, formatDistanceToNow } from 'date-fns';

import { MdOutlineCancel } from "react-icons/md";
import { RiNotification3Line } from "react-icons/ri";
import { FaRegCheckCircle } from "react-icons/fa";

import { Button } from ".";
import { useStateContext } from "../contexts/ContextProvider";

const Notification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { currentColor, setIsClicked, initialState } = useStateContext();

  // Get current user
  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate, user]);

  // Fetch notifications
  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [user]);

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
      setError(`Failed to load notifications. Error: ${err.response ? err.response.status : 'Unknown'}`);
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/notifications/unread-count', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setUnreadCount(response.data.count);
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/notifications/${id}/read`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      // Update the local state to mark this notification as read
      setNotifications(notifications.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      ));
      
      // Decrement the unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
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
      
      // Update all notifications in the local state
      setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
      
      // Reset unread count
      setUnreadCount(0);
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
      
      // Remove the deleted notification from the list
      const updatedNotifications = notifications.filter(notif => notif.id !== id);
      setNotifications(updatedNotifications);
      
      // Update unread count if the deleted notification was unread
      const deletedNotification = notifications.find(notif => notif.id === id);
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  // Format the date for display
  const formatDate = (date) => {
    const notificationDate = new Date(date);
    const now = new Date();
    
    // If it's today, show relative time
    if (notificationDate.toDateString() === now.toDateString()) {
      return formatDistanceToNow(notificationDate, { addSuffix: true });
    }
    
    // Otherwise, show the date
    return format(notificationDate, 'MMM dd, yyyy');
  };

  const handleClose = () => {
    setIsClicked(initialState);
  };

  return (
    <div className="nav-item absolute right-5 md:right-40 top-16 bg-white dark:bg-[#42464D] p-5 rounded-lg w-96 shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 pb-3">
        <div className="flex gap-2 items-center">
          <p className="font-semibold text-lg dark:text-gray-200">
            Notifications
          </p>
          {unreadCount > 0 && (
            <span
              className="text-white text-xs rounded-full py-1 px-2"
              style={{ backgroundColor: currentColor }}
            >
              {unreadCount} New
            </span>
          )}
        </div>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
          onClick={handleClose}
        />
      </div>
      
      {/* Notification List */}
      <div className="mt-3 max-h-80 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="w-6 h-6 border-2 border-t-2 rounded-full animate-spin" style={{ borderTopColor: currentColor }}></div>
            <p className="ml-2 text-gray-500 dark:text-gray-400">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
            <button 
              className="mt-2 text-sm hover:underline" 
              style={{ color: currentColor }}
              onClick={fetchNotifications}
            >
              Retry
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
            <RiNotification3Line className="text-4xl mb-2 opacity-50" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`relative flex items-start gap-4 p-3 border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                !notification.isRead ? "bg-blue-50 dark:bg-blue-900/20" : ""
              }`}
              onClick={() => !notification.isRead && markAsRead(notification.id)}
            >
              {/* Side indicator for unread */}
              {!notification.isRead && (
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-md" style={{ backgroundColor: currentColor }}></div>
              )}
              
              {/* User image */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
                   style={{ backgroundColor: notification.isRead ? "#9ca3af" : currentColor }}>
                {notification.urlImageProfile ? (
                  <img
                    className="h-full w-full object-cover"
                    src={notification.urlImageProfile}
                    alt={notification.sourceUser?.username || "User"}
                  />
                ) : (
                  <div className="text-white text-lg font-semibold">
                    {notification.sourceUser?.username?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="flex-grow">
                <div className="flex justify-between">
                  <p 
                    className={`font-medium dark:text-gray-200 text-sm leading-snug ${
                      !notification.isRead ? "font-semibold" : ""
                    }`}
                  >
                    <span className="font-bold">{notification.sourceUser?.username}</span>{" "}
                    {notification.content}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 ml-2 flex-shrink-0"
                  >
                    <MdOutlineCancel />
                  </button>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-500 text-xs dark:text-gray-400">
                    {formatDate(notification.createdAt)}
                  </p>
                  {!notification.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      className="text-sm hover:opacity-80 transition-opacity"
                      style={{ color: currentColor }}
                    >
                      <FaRegCheckCircle />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Footer / Actions */}
      {notifications.length > 0 && !loading && !error && (
        <div className="mt-4 flex justify-between">
          <Button
            color="white"
            bgColor={currentColor}
            text="Mark all as read"
            borderRadius="10px"
            size="sm"
            onClick={markAllAsRead}
          />
          <Button
            color="white"
            bgColor={currentColor}
            icon={<RiNotification3Line />}
            text="See all"
            borderRadius="10px"
            size="sm"
            onClick={() => navigate('/notifications')}
          />
        </div>
      )}
    </div>
  );
};

export default Notification;