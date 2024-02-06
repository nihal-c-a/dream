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
  
  const getStarRating = (rating) => {
   
    const roundedRating = Math.round(rating); // Round the rating to the nearest whole number
    const stars = [];
  
    for (let i = 1; i <= roundedRating; i++) {
      // Use star.jpg if the current iteration is less than or equal to the rounded rating, otherwise, use empty-star.jpg
      const starImage = i <= roundedRating ? '/pic/star.png' : '/pic/star.png';
      stars.push(
        <img
          key={i}
          src={starImage}
          alt={`Star ${i}`}
          className="starImage"
          style={{ width: '18px', height: '18px' }} // Set a fixed width and height for the stars
        />

      );
      
    }
    stars.push(
      // <span style={{ padding: '5px', paddingRight: '10px', fontSize: '12px',color:'grey'}}>{roundedRating}/5</span>
    )
  
    return stars;
  };

  return (
    <div className={styles.feedbackContainer}>
      <button className={styles.backbutton} onClick={() => (window.location.href = '/constructorhome')}>Back</button>
      <h1 className={styles.heading}>Feedback Received</h1>
      <div className={styles.cardcontainer}>
      {feedbackList.length > 0 ? (
  feedbackList.map((feedback) => (
    
    <div key={feedback._id} className={styles.feedbackCard}>
      <div className={`${styles.profile} ${styles.profileContainer}`}>
        <img src="/pic/man1profile.png" alt="Profile" className={styles.profilePicture} />
        <h4>{` ${feedback.clientName}`}</h4>
      </div>
      <div className={styles.ratings}>
        {getStarRating(feedback.rating)}
        <span className={styles.totratings}>{`${feedback.rating}/5`}</span>
      </div>
      <h5>{` ${feedback.experience}`}</h5>
      
    </div>
    
  ))
) : (
  <p>No feedback received yet.</p>
)}
    </div>
    </div>
  );
};

export default ConstructorFeedbackPage;
