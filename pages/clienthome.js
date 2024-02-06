// dream/pages/clienthome1.js
import React, { useState, useEffect } from "react";
import styles from "../styles/clienthome.module.css"; // Add your CSS file
import "../styles/globalclienthome.css";
import Link from "next/link";

const ClientHomePage = () => {
  const [clientName, setClientName] = useState("");

  useEffect(() => {
    // Fetch client name from backend
    const fetchClientName = async () => {
      try {
        const sessionId = sessionStorage.getItem("sessionId");

        if (!sessionId) {
          console.error("Session ID is missing.");
          return;
        }

        const response = await fetch("/api/clienthome", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: sessionId,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setClientName(data.clientName);
        } else {
          console.error("Failed to fetch client name:", data.message);
        }
      } catch (error) {
        console.error("An error occurred during API call:", error);
      }
    };

    fetchClientName();
  }, []);

  return (
    <div>
      <h1>{`Hi ${clientName},
      From blueprint to bliss we're here to turn your dream home into reality`}</h1>
      <div className={styles.container}>
        <div className={styles.card}>
          <Link href="/buildrequest">
            <img src="/pic/house.png" alt="Build Request" />
            <h3>Build Request</h3>
            <p>Submit your construction project details.</p>
          </Link>
        </div>

        <div className={styles.card}>
          <Link href="/viewconstructor">
            <img src="/pic/builder.png" alt="View Constructor" />
            <h3>View Constructor</h3>
            <p>Explore and connect with experienced constructors.</p>
          </Link>
        </div>

        <div className={styles.card}>
          <Link href="/projectstatus">
            <img src="/pic/project-status.png" alt="Project Status" />
            <h3>Project Status</h3>
            <p>Check the status of your ongoing construction projects.</p>
          </Link>
        </div>

        <div className={styles.card}>
          <Link href="/clientnotifications">
            <img src="/pic/notification.png" alt="Notifications" />
            <h3>Notifications</h3>
            <p>Stay updated with important notifications.</p>
          </Link>
        </div>

        <div className={styles.card}>
          <Link href="/clientfeedback">
            <img src="/pic/feedback.png" alt="feedback" />
            <h3>Feedback</h3>
            <p>Give valuable feedback.</p>
          </Link>
        </div>

        <div className={styles.card}>
          <Link href="/">
            <img src="/pic/logout.png" alt="Logout" />
            <h3>Logout</h3>
            <p>Sign out from your account.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClientHomePage;
