// dream/pages/clientrequestnotifications.js
import React, { useState, useEffect } from "react";
import styles from "../styles/clientrequestnotifications.module.css";

const ClientRequestNotifications = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const sessionId = sessionStorage.getItem("sessionId");
        if (!sessionId) {
          console.error("Session ID is missing.");
          return;
        }

        const response = await fetch("/api/clientrequests", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: sessionId,
          },
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Requests fetched successfully:", data.requests);
          setRequests(data.requests);
        } else {
          console.error("Failed to fetch requests:", data.message);
        }
      } catch (error) {
        console.error("An error occurred during API call:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleAcceptReject = async (requestId, status) => {
    try {
      const sessionId = sessionStorage.getItem("sessionId");
      if (!sessionId) {
        console.error("Session ID is missing.");
        return;
      }

      const response = await fetch("/api/clientrequests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionId,
        },
        body: JSON.stringify({ requestId, status }), // Ensure proper payload structure
      });

      const data = await response.json();

      if (response.ok) {
        alert("Request status updated successfully:", data.message);
        window.location.href = "/clientrequestnotifications";
        // Optionally, you can update the state to reflect the change
      } else {
        alert("Failed to update request status:", data.message);
      }
    } catch (error) {
      console.error("An error occurred during API call:", error);
    }
  };

  return (
    <div className={styles.requestContainer}>
      <button
        className={styles.backbutton}
        onClick={() => (window.location.href = "/constructorhome")}
      >
        Back
      </button>

      <h1 className={styles.heading}>Client Request Notifications</h1>
      <div className={styles.cardcontainer}>
        {requests.length > 0 ? (
          requests.map((request) => (
            <div key={request._id} className={styles.requestCard}>
              <h2>{`Client Name: ${request.clientName}`}</h2>
              <p>{`Project Name: ${request.projectName}`}</p>
              <p>{`Project Area: ${request.projectArea}`}</p>
              <p>{`Project Timeline: ${request.projectTimeline}`}</p>
              <p>{`Budget Range: ${request.budgetRange}`}</p>
              {/* {request.status === 'requested' && ( */}
              <div className={styles.buttonContainer}>
                <button
                  className={styles.accept}
                  onClick={() => handleAcceptReject(request._id, "accepted")}
                >
                  Accept
                </button>
                <button
                  className={styles.reject}
                  onClick={() => handleAcceptReject(request._id, "rejected")}
                >
                  Reject
                </button>
              </div>
              {/* )} */}
              {/* {request.status === 'accepted' && (
              <p>Status: Request Accepted</p>
            )}
            {request.status === 'rejected' && (
              <p>Status: Request Rejected</p>
            )} */}
            </div>
          ))
        ) : (
          <p>No client requests available.</p>
        )}
      </div>
    </div>
  );
};

export default ClientRequestNotifications;
