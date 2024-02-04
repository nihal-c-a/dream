// dream/pages/buildrequest.js
import React, { useState, useEffect } from 'react';
import styles from '../styles/buildrequest.module.css';
import { useRouter } from 'next/router';

const NumberToWords = (num) => {
  const units = ['', 'Thousand', 'Lakh', 'Crore'];
  const belowTwenty = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convert = (num) => {
    if (num === 0) return 'Zero';

    let result = '';
    let i = 0;

    do {
      const chunk = num % 100;
      if (chunk !== 0) {
        result = `${convertChunk(chunk)} ${units[i]} ${result}`;
      }
      num = Math.floor(num / 100);
      i++;
    } while (num > 0);

    return result.trim();
  };

  const convertChunk = (num) => {
    if (num === 0) return '';
    if (num < 20) {
      return belowTwenty[num];
    } else {
      return `${tens[Math.floor(num / 10)]} ${belowTwenty[num % 10]}`;
    }
  };

  return `${convert(num)} Rupees`;
};

const BuildRequestPage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [projectArea, setProjectArea] = useState('');
  const [projectTimeline, setProjectTimeline] = useState('');
  const [budgetRange, setBudgetRange] = useState(50000);

  const router = useRouter();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const sessionId = sessionStorage.getItem('sessionId');
        if (!sessionId) {
          console.error('Session ID is missing.');
          return;
        }

        const response = await fetch('/api/buildrequest', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionId,
          },
        });

        const data = await response.json();

        if (response.ok) {
          console.log('User details fetched successfully:', data);
          setUserDetails(data);
        } else {
          console.error('Failed to fetch user details:', data.message);
        }
      } catch (error) {
        console.error('An error occurred during API call:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleBuildRequestSubmit = async (e) => {
    e.preventDefault();

    try {
      const sessionId = sessionStorage.getItem('sessionId');
      if (!sessionId) {
        console.error('Session ID is missing.');
        return;
      }

      const response = await fetch('/api/buildrequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionId,
        },
        body: JSON.stringify({
          projectName,
          projectArea,
          projectTimeline,
          budgetRange,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Build request created successfully");
        window.location.href = '/viewbuildrequest';
        console.log('Build request created successfully:', data);
      } else {
        console.error('Failed to create build request:', data.message);
      }
    } catch (error) {
      console.error('An error occurred during API call:', error);
    }
  };

  const handleBackButtonClick = () => {
    window.location.href = '/clienthome';
  };

  const handleViewBuildRequestClick = () => {
    window.location.href = '/viewbuildrequest';
  };
 
  return (
    <div className={styles.fullpage}>
        <button className={styles.viewrequestbutton} onClick={handleViewBuildRequestClick}>View My Build Requests</button>
        <h1 className={styles.heading}>BUILD REQUEST PAGE</h1>
    <div className={styles.buildRequestContainer}>
      {userDetails ? (
        <div className={styles.userDetailsContainer}>
          <div class="form-container">
              <label className={styles.formlabel}>
                Full Name:
                <input className={styles.forminput} type="text" value={`${userDetails.firstname} ${userDetails.lastname}`} readOnly />
              </label>
              <label className={styles.formlabel}>
                Email ID:
                <input className={styles.forminput} type="text" value={userDetails.email} readOnly />
              </label>
              <label className={styles.formlabel}>
                Phone Number:
                <input className={styles.forminput} type="text" value={userDetails.phoneno} readOnly />
              </label>
              <label className={styles.formlabel}>
                Address:
                <input className={styles.forminput} type="text" value={userDetails.address} readOnly />
              </label>
          </div>

        </div>
      ) : (
        <p>Loading user details...</p>
      )}

      <form className={styles.buildRequestForm} onSubmit={handleBuildRequestSubmit}>
        <div>
          <label>Project Name:</label>
          <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} required />
        </div>
        <div>
          <label>Project Area:</label>
          <input type="text" value={projectArea} onChange={(e) => setProjectArea(e.target.value)} required />
        </div>
        <div>
          <label>Project Timeline:</label>
          <input type="date" value={projectTimeline} onChange={(e) => setProjectTimeline(e.target.value)} required />
        </div>
        <div>
          <label>Budget Range:</label>
          <input type="range" min="20000" max="10000000" step="10000" value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)} />
          <span className={styles.rupees}>{NumberToWords(budgetRange)}</span>
        </div>
        <button type="submit">Create Build Request</button>
        <button onClick={handleBackButtonClick}>Back</button>
      </form>

      
    </div>
    </div>
    
  );
};

export default BuildRequestPage;
