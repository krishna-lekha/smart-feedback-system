import React, { useEffect, useState } from 'react';
import './StatusPage.css';

const StatusPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({});

  useEffect(() => {
    fetch('http://localhost:5000/api/status/all')
      .then(res => res.json())
      .then(data => setFeedbacks(data))
      .catch(err => console.error("Error:", err));
  }, []);

  const handleChange = (id, value) => {
    setStatusUpdates(prev => ({ ...prev, [id]: value }));
  };

  const handleUpdate = async (id) => {
    const status = statusUpdates[id];
    if (!status) return alert("Please select a status before updating.");

    try {
      const res = await fetch(`http://localhost:5000/api/status/update/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        alert("✅ Status updated!");
        window.location.reload();
      } else {
        alert("❌ Failed to update status.");
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div className="StatusPage">
      <button className="back-button" onClick={() => window.history.back()}>⬅ Back</button>
      <h2 className="status-heading">🛠️ Admin Feedback Status Panel</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Description</th>
            <th>Source</th>
            <th>Status</th>
            <th>Updated At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map(fb => (
            <tr key={fb._id}>
              <td>{fb.name || "Unknown"}</td>
              <td>{fb.category || "Not specified"}</td>
              <td>{fb.description}</td>
              <td>{fb.source}</td>
              <td>{fb.status || "Yet to Begin"}</td>
              <td>{fb.updatedAt ? new Date(fb.updatedAt).toLocaleString() : "—"}</td>
              <td>
                <select onChange={(e) => handleChange(fb._id, e.target.value)} defaultValue="">
                  <option value="" disabled>Update status</option>
                  <option value="Yet to Begin">Yet to Begin</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <button onClick={() => handleUpdate(fb._id)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatusPage;
