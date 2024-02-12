import React, { useState, useEffect } from 'react';
import styles from '../styles/viewconstructor.module.css';

const ViewConstructorPage = () => {
  const [constructors, setConstructors] = useState([]);
  const [selectedConstructor, setSelectedConstructor] = useState(null);
  const [selectedConstructor1, setSelectedConstructor1] = useState(null);

  useEffect(() => {
    const fetchConstructors = async () => {
      try {
        const response = await fetch('/api/viewconstructor', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
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

  const fetchFullDetails = async (constructorId) => {
    try {
      const response = await fetch('/api/viewconstructor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ constructorId }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Full details data:', data);
        setSelectedConstructor(data.constructor);
        setSelectedConstructor1(data);
      } else {
        console.error('Failed to fetch full details:', data.message);
      }
    } catch (error) {
      console.error('An error occurred during API call:', error);
    }
  };

  const handleSendRequest = async () => {
    try {
      const sessionId = sessionStorage.getItem('sessionId');
      if (!sessionId) {
        console.error('Session ID is missing.');
        return;
      }

      const response = await fetch('/api/sendrequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionId,
        },
        body: JSON.stringify({ constructorId: selectedConstructor._id }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        if(data.message=== 'No primary build request found for the user')
        {
          window.location.href = '/viewbuildrequest';
        }
        // You can add additional logic here if needed
      } else {
        console.error('Failed to send request:', data.message);
      }
    } catch (error) {
      console.error('An error occurred during API call:', error);
    }
  };

  return (
    <div className={styles.viewConstructorContainer}>
      <button className={styles.backbutton} onClick={() => (window.location.href = '/clienthome')}>Back</button>
      <button
        className={styles.managebutton}
        onClick={() => (window.location.href = '/managecrequest')}
        title="Manage Constructor Request"
      >
        My Requests
      </button>
      
      <h1 className={styles.heading}>Constructor List</h1>

      <div className={styles.constructorCardsContainer}>
        {constructors.map((constructor) => (
          <div key={constructor._id} className={styles.constructorCard} onClick={() => fetchFullDetails(constructor._id)}>
            <img src="/pic/man1profile.png" alt="Profile" className={styles.profilePicture} />
            <div className={styles.basicDetails}>
              <p>{`${constructor.firstname} ${constructor.lastname}`}</p>
              <p>{`Experience: ${constructor.exp} years`}</p>
              <button className={styles.sendrequestbutton} onClick={handleSendRequest}>Send Request</button>
            </div>
          </div>
        ))}
      </div>

      {selectedConstructor && (
        <div className={styles.fullDetailsContainer}>
          <h2>{`${selectedConstructor.firstname} ${selectedConstructor.lastname}`}</h2>
          <p>{`Experience: ${selectedConstructor.exp} years`}</p>
          <p>{`Email: ${selectedConstructor.email}`}</p>
          <p>{`Phone Number: ${selectedConstructor.phoneno}`}</p>
          <p>{`Address: ${selectedConstructor.address}`}</p>

          {/* Display feedback here */}
          <h3>Feedback:</h3>
          {selectedConstructor1.feedback && Array.isArray(selectedConstructor1.feedback) && selectedConstructor1.feedback.length > 0 ? (
            selectedConstructor1.feedback.map((feedback) => (
              <div key={feedback._id}  className={styles.feedbackContainer}>
                <p>{` ${feedback.experience}`}</p>
                <p>{`Rating: ${feedback.rating}`}</p>
              </div>
            ))
          ) : (
            <p>No feedback available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewConstructorPage;
