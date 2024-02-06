// dream/pages/clientfeedback.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Import useRouter from next/router
import styles from '../styles/clientfeedback.module.css';
import '../styles/globalclientfeedback.css';

const ClientFeedbackPage = () => {
  const router = useRouter(); // Use the useRouter hook
  const [constructors, setConstructors] = useState([]);
  const [selectedConstructor, setSelectedConstructor] = useState('');
  const [experience, setExperience] = useState('');
  const [rating, setRating] = useState('');

  useEffect(() => {
    const fetchConstructors = async () => {
      try {
        const response = await fetch('/api/clientfeedback', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('sessionId'),
          },
        });

        const data = await response.json();

        if (response.ok) {
          setConstructors(data.constructors);
        } else {
          console.error('Failed to fetch constructors:', data.message);
        }
      } catch (error) {
        console.error('An error occurred during API call:', error);
      }
    };

    fetchConstructors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/clientfeedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('sessionId'),
        },
        body: JSON.stringify({
          constructorId: selectedConstructor,
          experience,
          rating,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Feedback submitted successfully');
        router.push('/clienthome'); // Use router to navigate to /clienthome
        console.log('Feedback submitted successfully:', data);
        // Optionally, you can redirect the user or perform other actions
      } else {
        console.error('Failed to submit feedback:', data.message);
      }
    } catch (error) {
      console.error('An error occurred during API call:', error);
    }
  };

  return (
    <div className={styles.clientFeedbackContainer}>
      <button className={styles.backbutton} onClick={() => (window.location.href = '/clienthome')}>Back</button>
      <h1 className={styles.heading}>Client Feedback Page</h1>

      {/* Back button as a button */}
      
      
      <form className={styles.feedbackForm} onSubmit={handleSubmit}>
        <div>
          <label>Choose Constructor:</label>
          <select value={selectedConstructor} onChange={(e) => setSelectedConstructor(e.target.value)} required>
            <option value="" disabled>Select Constructor</option>
            {constructors.map((constructor) => (
              <option key={constructor._id} value={constructor._id}>
                {`${constructor.firstname} ${constructor.lastname}`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Your Experience with the Constructor:</label>
          <textarea value={experience} onChange={(e) => setExperience(e.target.value)} required />
        </div>
        <div>
          <label>Rating:</label>
          <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} required />
        </div>
        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default ClientFeedbackPage;
