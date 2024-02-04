// dream/pages/managecrequest.js
import React, { useState, useEffect } from "react";
import styles from "../styles/managecrequest.module.css";

const ManageCRequestPage = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const sessionId = sessionStorage.getItem("sessionId"); //
        if (!sessionId) {
          console.error("Session ID is missing.");
          return;
        } //
        const response = await fetch("/api/managecrequest", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: sessionId,
          },
        });

        const data = await response.json();

        if (response.ok) {
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

  const handleDeleteRequest = async (requestId) => {
    try {
      const response = await fetch("/api/managecrequest", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Deleted succesfully");
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== requestId)
        );
      } else {
        console.error("Failed to delete request:", data.message);
      }
    } catch (error) {
      console.error("An error occurred during API call:", error);
    }
  };
  function confirmDeleteRequest(requestId) {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this request?"
    );

    if (isConfirmed) {
      handleDeleteRequest(requestId);
    }
  }

  return (
    <div className={styles.manageCRequestContainer}>
      <button
        className={styles.backbutton}
        onClick={() => (window.location.href = "/viewconstructor")}
      >
        Back
      </button>
      <h1 className={styles.heading}>MANAGE CLIENT REQUESTS</h1>

      <div className={styles.requestCardsContainer}>
        {requests.map((request) => (
          <div key={request._id} className={styles.requestCard}>
            <p>{`Client: ${request.clientName}`}</p>
            <p>{`Constructor: ${request.constructorName}`}</p>
            <p>{`Project Name: ${request.buildRequestName}`}</p>
            <p>{`Status: ${request.status}`}</p> {/* added by me */}
            <button
              className={styles.deletebutton}
              onClick={() => confirmDeleteRequest(request._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCRequestPage;
