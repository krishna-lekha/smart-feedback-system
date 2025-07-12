import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Feedback.css";

const Feedback = () => {
  const [name, setName] = useState("");
  const[email,setEmail]=useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");
    if (storedName) setName(storedName);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const handleCategorySelect = (selected) => {
    setCategory(selected);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("name", name);
      formData.append("category", category);
      formData.append("description", description);
      if (image) {
        formData.append("image", image);
      }

      const response = await axios.post("http://localhost:5000/api/feedback", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setMessage("✅ Feedback submitted successfully!");
        setCategory("");
        setDescription("");
        setImage(null);
      } else {
        setMessage("⚠️ Error submitting feedback. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Server error. Please try again later.");
    }
  };

  const handleBack = () => {
    if (category) {
      setCategory("");
      setMessage("");
      setDescription("");
      setImage(null);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="feedback-container">
      <h1>Feedback Form</h1>
      {message && <p className="message">{message}</p>}

      {!category ? (
        <>
          <p style={{ color: "black" }}>Welcome, <strong>{name}</strong></p>
          <p style={{ color: "black" }}>
          <strong>Email:</strong> {email}
          </p>
          <p style={{ color: "black" }}>Select the type of Feedback:</p>
          <div className="category-buttons">
            {["Credit Card", "Loan", "Transaction", "Mobile Banking", "Other"].map((cat) => (
              <button key={cat} onClick={() => handleCategorySelect(cat)}>
                {cat}
              </button>
            ))}
          </div>
          <button onClick={handleBack} className="dashboard-back-button">
            ← Back to Dashboard
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <p style={{ color: "black" }}>
            <strong>Name:</strong> {name}
          </p>
          <p style={{ color: "black" }}>
            <strong>Selected Category:</strong> {category}
          </p>

          <label>
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write your feedback here..."
              required
              rows={5}
            ></textarea>
          </label>

          <label>
            Upload Screenshot (optional):
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>

          <button type="submit">Submit Feedback</button>
          <button type="button" onClick={handleBack} className="back-button">
            ← Back
          </button>
        </form>
      )}
    </div>
  );
};

export default Feedback;
