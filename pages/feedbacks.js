// dream/pages/constructorfeedback.js
import React, { useState, useEffect } from 'react';
import styles from '../styles/feedbacks.module.css';

const ConstructorFeedbackPage = () => {
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const sessionId = sessionStorage.getItem('sessionId');
        if (!sessionId) {
          console.error('Session ID is missing.');
          return;
        }

        const response = await fetch('/api/feedbacks', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionId,
          },
        });

        const data = await response.json();

        if (response.ok) {
          console.log('Feedback list fetched successfully:', data.feedbackList);
          setFeedbackList(data.feedbackList);
        } else {
          console.error('Failed to fetch feedback list:', data.message);
        }
      } catch (error) {
        console.error('An error occurred during API call:', error);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <div className={styles.feedbackContainer}>
      <h1>Feedback Received</h1>

      {feedbackList.length > 0 ? (
  feedbackList.map((feedback) => (
    <div key={feedback._id} className={styles.feedbackCard}>
      <h2>{`Client Name: ${feedback.clientName}`}</h2>
      <h3>{`Experience: ${feedback.experience}`}</h3>
      <h4>{`Rating: ${feedback.rating}`}</h4>
    </div>
  ))
) : (
  <p>No feedback received yet.</p>
)}
    </div>
  );
};

export default ConstructorFeedbackPage;
