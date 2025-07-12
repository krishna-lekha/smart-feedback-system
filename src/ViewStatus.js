import React, { useEffect, useState } from 'react';
import './ViewStatus.css';

const ViewStatus = () => {
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/status/viewstatus')
      .then(res => res.json())
      .then(data => setStatuses(data))
      .catch(err => console.error("Error fetching statuses:", err));
  }, []);

  return (
    <div className="view-status-container">
      <div className="heading-bar">
      <button onClick={() => window.history.back()} className="back-button">⬅ Back</button>
      <h2 className="status-heading">Your Feedback Status</h2>
    </div>
      {statuses.length === 0 ? (
        <p className="no-status-message">No feedback found.</p>
      ) : (
        <table className="status-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Source</th>
              <th>Description</th>
              <th>Status</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {statuses.map((item, index) => (
              <tr key={index}>
                <td>{item.name || "Anonymous"}</td>
                <td>{item.category || "Uncategorized"}</td>
                <td>{item.source || "Web"}</td>
                <td>{item.description}</td>
                <td>{item.status}</td>
                <td>{item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewStatus;
