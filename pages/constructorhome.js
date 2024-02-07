// dream/pages/constructorhome.js
import React, { useState, useEffect } from 'react';
import styles from '../styles/constructorhome.module.css'; // Add your CSS file
import '../styles/globalclienthome.css';
import Link from 'next/link';

const ConstructorHomePage = () => {
  const [constructorName, setConstructorName] = useState('');

  useEffect(() => {
    // Fetch constructor name from backend
    const fetchConstructorName = async () => {
      try {
        const sessionId = sessionStorage.getItem('sessionId');

        if (!sessionId) {
          console.error('Session ID is missing.');
          return;
        }

        const response = await fetch('/api/constructorhome', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionId,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setConstructorName(data.constructorName);
        } else {
          console.error('Failed to fetch constructor name:', data.message);
        }
      } catch (error) {
        console.error('An error occurred during API call:', error);
      }
    };

    fetchConstructorName();
  }, []);

  return (
    <div>
      <h1>{`Hi ${constructorName}, Welcome to Constructor Home`}</h1>
      <div className={styles.container}>
        <div className={styles.card}>
          <Link href="/clientrequestnotifications">
            <img src="/pic/notification.png" alt="Client Request Notifications" />
            <h3>Client Request Notifications</h3>
            <p>View and manage client requests.</p>
          </Link>
        </div>

        <div className={styles.card}>
          <Link href="/feedbacks">
            <img src="/pic/feedback.png" alt="View Feedbacks" />
            <h3>View Feedbacks</h3>
            <p>Check feedback from clients.</p>
          </Link>
        </div>

        <div className={styles.card}>
          <Link href="/updateprojectstatus">
            <img src="/pic/project-status.png" alt="Update Project Status" />
            <h3>Update Project Status</h3>
            <p>Update the status of ongoing projects.</p>
          </Link>
        </div>

        <div className={styles.card}>
          <Link href="/">
            <img src="/pic/logout.png" alt="Logout" />
            <h3>Logout</h3>
            <p>Sign out from your account.</p>
          </Link>
        </div>

        {/* <div className={styles.card}>
          <Link href="/manage project">
            <img src="/pic/manage project.png" alt="Manage My Projects" />
            <h3>Manage My Projects</h3>
            <p>View and manage your construction projects.</p>
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default ConstructorHomePage;
