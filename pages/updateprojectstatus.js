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

        const response = await fetch('/api/updateprojectstatus', {
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

  const handleProgressChange = (projectId, newProgress) => {
    // Update the progress in the local state
    setAcceptedProjects((prevProjects) =>
      prevProjects.map((project) =>
        project._id === projectId ? { ...project, progress: newProgress } : project
      )
    );
  };
 
  const handleSubmitProgress = async (projectId, progress) => {
    try {
      const sessionId = sessionStorage.getItem('sessionId');
      
      if (!sessionId) {
        
        console.error('Session ID is missing.');
        return;
      }

      const response = await fetch('/api/updateprojectstatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionId,
        },
        body: JSON.stringify({ projectId, progress }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        console.log('Progress updated successfully:', data.message);
        window.location.href = '/constructorhome'
        // Optionally, you can update the state to reflect the change
      } else {
        console.error('Failed to update progress:', data.message);
      }
    } catch (error) {
      console.error('An error occurred during API call:', error);
    }
  };

  useEffect(() => {
    if (acceptedProjects.length > 0) {
      chartRefs.current = acceptedProjects.map((project) => {
        const ctx = document.getElementById(`chart-${project._id}`);
        const existingChart = Chart.getChart(ctx);

        // Destroy the existing chart if it exists
        if (existingChart) {
          existingChart.destroy();
        }

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
      <button className={styles.backbutton} onClick={() => (window.location.href = '/constructorhome')}>Back</button>
     
      <div className={styles.cardcontainer}>
      {acceptedProjects.length > 0 ? (
        acceptedProjects.map((project, index) => (
          <div key={project._id} className={styles.card}>
            <h2>{project.projectName}</h2>
            <div className={styles.chartContainer}>
              <canvas id={`chart-${project._id}`} width='200' height='200'></canvas>
            </div>
            <input className={styles.range}
              type="range"
              min="0"
              max="100"
              value={project.progress}
              onChange={(e) => handleProgressChange(project._id, e.target.value)}
            />
            <button className={styles.updatebutton} onClick={() => handleSubmitProgress(project._id, project.progress)}>
              Update
            </button>
            <p>Project Area: {project.projectArea}</p>
            <p>Project Timeline: {project.projectTimeline}</p>
            <p>Budget Range: {project.budgetRange}</p>
            <p>Client: {project.constructorName}</p>
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
