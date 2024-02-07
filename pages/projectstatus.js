// dream/pages/projectstatus.js
import React, { useEffect, useState, useRef } from 'react';
import styles from '../styles/projectstatus.module.css';
import Chart from 'chart.js/auto';

const ProjectStatus = () => {
  const [acceptedProjects, setAcceptedProjects] = useState([]);
  const chartRefs = useRef([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const sessionId = sessionStorage.getItem('sessionId');
        if (!sessionId) {
          console.error('Session ID is missing.');
          return;
        }

        const response = await fetch('/api/projectstatus', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionId,
          },
        });

        const data = await response.json();

        if (response.ok) {
          console.log('Projects fetched successfully:', data.acceptedProjects);
          setAcceptedProjects(data.acceptedProjects);
        } else {
          console.error('Failed to fetch projects:', data.message);
        }
      } catch (error) {
        console.error('An error occurred during API call:', error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (acceptedProjects.length > 0) {
      chartRefs.current = acceptedProjects.map((project) => {
        const ctx = document.getElementById(`chart-${project._id}`);
        return new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['Completed', 'Yet to Complete'],
            datasets: [
              {
                data: [project.progress, 100 - project.progress],
                backgroundColor: ['rgba(75, 192, 192, 0.9)', 'rgba(255, 99, 132, 0.9)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: false,
              },
            },
          },
        });
      });
    }
  }, [acceptedProjects]);

  return (
    
    <div className={styles.container}>
      <button className={styles.backbutton} onClick={() => (window.location.href = '/clienthome')}>Back</button>
     
     <div className={styles.cardcontainer}>
      {acceptedProjects.length > 0 ? (
        acceptedProjects.map((project, index) => (
          <div key={project._id} className={styles.card}>
            <h2>{project.projectName}</h2>
            <div className={styles.clientchartContainer}>
              <canvas id={`chart-${project._id}`} width='200' height='200'></canvas>
            </div>
            <p>Project Area: {project.projectArea}</p>
            <p>Project Timeline: {project.projectTimeline}</p>
            <p>Budget Range: {project.budgetRange}</p>
            <p>Constructor: {project.constructorName}</p>
          </div>
        ))
      ) : (
        <p>No projects available.</p>
      )}
    </div>
    </div>
  );
};

export default ProjectStatus;
