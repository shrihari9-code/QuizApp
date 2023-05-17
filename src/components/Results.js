import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function Results() {
  const location = useLocation();
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`/api/users/${location.search}`);
        setResults(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchResults();
  }, []);

  return (
    <div>
      <h2>Results</h2>
      {results ? (
        <div>
          <p>Score: {results.score}</p>
          {/* Render any other relevant result information */}
        </div>
      ) : (
        <p>Loading results...</p>
      )}
    </div>
  );
}

export default Results;
