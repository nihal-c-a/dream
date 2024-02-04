// dream/pages/projectstatus.js
import React, { useState, useEffect } from "react";
import styles from "../styles/projectstatus.module.css";

const ProjectStatus = () => {
  const [acceptedProjects, setAcceptedProjects] = useState([]);

  useEffect(() => {
    const fetchAcceptedProjects = async () => {
      try {
        const sessionId = sessionStorage.getItem("sessionId");
        if (!sessionId) {
          console.error("Session ID is missing.");
          return;
        }

        const response = await fetch("/api/projectstatus", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: sessionId,
          },
        });

        const data = await response.json();

        if (response.ok) {
          console.log(
            "Accepted projects fetched successfully:",
            data.acceptedProjects
          );
          setAcceptedProjects(data.acceptedProjects);
        } else {
          console.error("Failed to fetch accepted projects:", data.message);
        }
      } catch (error) {
        console.error("An error occurred during API call:", error);
      }
    };

    fetchAcceptedProjects();
  }, []);

  return (
    <div className={styles.projectStatusContainer}>
      <h1>Project Status</h1>

      {acceptedProjects.length > 0 ? (
        acceptedProjects.map((project) => (
          <div key={project._id} className={styles.projectCard}>
            <h2>{`Project Name: ${project.projectName}`}</h2>
            <p>{`Project Area: ${project.projectArea}`}</p>
            <p>{`Project Timeline: ${project.projectTimeline}`}</p>
            <p>{`Budget Range: ${project.budgetRange}`}</p>
            <p>{`constructor Name : ${project.constructorName}`}</p>
            <p>{`Progress: ${project.progress}%`}</p>
          </div>
        ))
      ) : (
        <p>No accepted projects available.</p>
      )}
    </div>
  );
};

export default ProjectStatus;
