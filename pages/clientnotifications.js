// dream/pages/clientnotifications.js
import React, { useState, useEffect } from "react";
import styles from "../styles/clientnotifications.module.css";

const ClientNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const sessionId = sessionStorage.getItem("sessionId");
        if (!sessionId) {
          console.error("Session ID is missing.");
          return;
        }

        const response = await fetch("/api/clientnotifications", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: sessionId,
          },
        });

        const data = await response.json();

        if (response.ok) {
          console.log(
            "Notifications fetched successfully:",
            data.notifications
           
          );
          setNotifications(data.notifications);
        } else {
          console.error("Failed to fetch notifications:", data.message);
        }
      } catch (error) {
        console.error("An error occurred during API call:", error);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const sessionId = sessionStorage.getItem("sessionId");
      if (!sessionId) {
        console.error("Session ID is missing.");
        return;
      }

      const response = await fetch("/api/clientnotifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionId,
        },
        body: JSON.stringify({ notificationId }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Notification marked as read successfully:", data.message);
        // Optionally, you can update the state to reflect the change
        window.location.href = '/clientnotifications';
      } else {
        console.error("Failed to mark notification as read:", data.message);
      }
    } catch (error) {
      console.error("An error occurred during API call:", error);
    }
  };

  return (
    <div className={styles.notificationContainer}>
      <button className={styles.backbutton} onClick={() => (window.location.href = '/clienthome')}>Back</button>
      <h1 className={styles.heading}>Client Notifications</h1>
      <div className={styles.cardcontainer}>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div key={notification._id} className={styles.notificationCard}>
              <h3>{`Constructor: ${notification.constructorName}`}</h3>
              <p>{`Project Name: ${notification.buildRequestName}`}</p>
              <p>{`Status: ${notification.status}`}</p>
              {!notification.isRead && (
                <button onClick={() => markAsRead(notification._id)}>
                  Mark as Read
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No notifications available.</p>
        )}
    </div>
  </div>
  );
};

export default ClientNotifications;
