import React, { useState, useEffect } from 'react';
import styles from '../styles/viewbuildrequest.module.css';

const ViewBuildRequestPage = () => {
  const [buildRequests, setBuildRequests] = useState([]);

  useEffect(() => {
    const fetchBuildRequests = async () => {
      try {
        const sessionId = sessionStorage.getItem('sessionId');
        if (!sessionId) {
          console.error('Session ID is missing.');
          return;
        }

        const response = await fetch('/api/viewbuildrequest', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionId,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setBuildRequests(data.buildRequests);
        } else {
          console.error('Failed to fetch build requests:', data.message);
        }
      } catch (error) {
        console.error('An error occurred during API call:', error);
      }
    };

    fetchBuildRequests();
  }, []);

  const handleSetPrimary = async (buildRequestId, isPrimary) => {
    if (isPrimary) {
      // If already set as primary, do nothing
      return;
    }

    try {
      const sessionId = sessionStorage.getItem('sessionId');
      if (!sessionId) {
        console.error('Session ID is missing.');
        return;
      }

      const response = await fetch('/api/viewbuildrequest', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionId,
        },
        body: JSON.stringify({ buildRequestId }),
      });

      const data = await response.json();

      if (response.ok) {
        // alert('Build request set as primary successfully.');
        // Refresh the build requests list
        window.location.href='/viewbuildrequest';
        // fetchBuildRequests();
      } else {
        console.error('Failed to set build request as primary:', data.message);
      }
    } catch (error) {
      console.error('An error occurred during API call:', error);
    }
  };

  const handleDeleteBuildRequest = async (buildRequestId) => {
    try {
      const sessionId = sessionStorage.getItem('sessionId');
      if (!sessionId) {
        console.error('Session ID is missing.');
        return;
      }

      const response = await fetch('/api/deletebuildrequest', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionId,
        },
        body: JSON.stringify({ buildRequestId }),
      });

      const data = await response.json();

      if (response.ok) {
        
        alert('Build request deleted successfully.');
        window.location.href='/viewbuildrequest';

        // Refresh the build requests list
        fetchBuildRequests();
      } else {
        console.error('Failed to delete build request:', data.message);
      }
    } catch (error) {
      console.error('An error occurred during API call:', error);
    }
  };
 
  return (
    <div className={styles.viewBuildRequestContainer}>
      <button className={styles.backbutton} onClick={() => (window.location.href = '/clienthome')}>Back</button>
      <h1 className={styles.heading}>VIEW BUILD REQUESTS</h1>

      <div className={styles.buildRequestCardsContainer}>
        {buildRequests.map((buildRequest) => (
          <div key={buildRequest._id} className={styles.buildRequestCard}>
            <p>{`Project Name: ${buildRequest.projectName}`}</p>
            <p>{`Project Area: ${buildRequest.projectArea}`}</p>
            <p>{`Project Timeline: ${buildRequest.projectTimeline}`}</p>
            <p>{`Budget Range: ${buildRequest.budgetRange}`}</p>
            <p>{`Request Status: ${buildRequest.status}`}</p>
            
            <button className={styles.primarybutton}
              onClick={() => handleSetPrimary(buildRequest._id, buildRequest.isPrimary)}
              disabled={buildRequest.isPrimary}
              style={{ backgroundColor: buildRequest.isPrimary ? 'grey' : 'green' }}
            >
              Set as Primary
            </button>
            <button className={styles.deletebutton} onClick={() => handleDeleteBuildRequest(buildRequest._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewBuildRequestPage;
