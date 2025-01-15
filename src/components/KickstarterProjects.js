import React, { useState, useEffect } from 'react';
import '../styles/KickstarterProjects.css';

const KickstarterProjects = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const projectsPerPage = 5;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('Fetching projects from URL');
        const response = await fetch('https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json');
        
        console.log('Fetch response:', response);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched data:', data);
        
        // Ensure data is an array and has the expected structure
        const validProjects = Array.isArray(data) 
          ? data.filter(project => 
              project && 
              typeof project.percentage_funded !== 'undefined' && 
              typeof project.amount_pledged !== 'undefined'
            )
          : [];

        console.log('Valid projects:', validProjects);

        setProjects(validProjects);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Pagination logic
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

  const totalPages = Math.ceil(projects.length / projectsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div aria-live="polite" className="loading">Loading projects...</div>;
  }

  if (error) {
    return (
      <div aria-live="assertive" className="error">
        Error: {error}
        <p>Unable to fetch Kickstarter projects. Please try again later.</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="no-projects">
        <p>No projects found. The data source might be empty or inaccessible.</p>
        <p>Please check the API endpoint or try again later.</p>
      </div>
    );
  }

  return (
    <div className="kickstarter-projects" aria-labelledby="projects-table-title">
      <h2 id="projects-table-title">Kickstarter Projects</h2>
      <table>
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Percentage Funded</th>
            <th>Amount Pledged</th>
          </tr>
        </thead>
        <tbody>
          {currentProjects.map((project, index) => (
            <tr key={index}>
              <td>{indexOfFirstProject + index + 1}</td>
              <td>{project.percentage_funded}%</td>
              <td>${project.amount_pledged.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination" role="navigation" aria-label="Project pages">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              aria-current={currentPage === pageNumber ? 'page' : 'false'}
              className={currentPage === pageNumber ? 'active' : ''}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default KickstarterProjects;
