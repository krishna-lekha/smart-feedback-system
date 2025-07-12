// VisualizeAnalysis.js
import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
const COLORS = ["#8BC34A", "#F44336", "#FFEB3B"]; // Positive, Negative, Neutral
const CATEGORIES = ["All", "Credit Card", "Loan", "Transaction", "Mobile Banking", "Other"];

const VisualizeAnalysis = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/feedback")
      .then((res) => res.json())
      .then((data) => setFeedbacks(data))
      .catch((err) => console.error("Error fetching feedbacks:", err));
  }, []);

  const filtered = selectedCategory === "All"
    ? feedbacks
    : feedbacks.filter((f) => f.category === selectedCategory);

  // ✅ Count Sentiments
  const sentimentCount = filtered.reduce(
    (acc, item) => {
      const sentiment = item.sentiment?.trim().toLowerCase();
      if (sentiment === "positive") acc["Positive"] += 1;
      else if (sentiment === "negative") acc["Negative"] += 1;
      else acc["Neutral"] += 1;
      return acc;
    },
    { Positive: 0, Negative: 0, Neutral: 0 }
  );

  const pieData = [
    { name: "Positive", value: sentimentCount.Positive },
    { name: "Negative", value: sentimentCount.Negative },
    { name: "Neutral", value: sentimentCount.Neutral },
  ];

  // ✅ Generate Suggestions
  const suggestions = filtered.map((item, idx) => {
    const raw = item.sentiment?.trim().toLowerCase();
    const sentiment =
    raw === "positive" ? "Positive" :
    raw === "negative" ? "Negative" :
    "Neutral";

    const category = item.category || "Other";
    const description = item.description?.toLowerCase() || "";
    let suggestion = "—";

    if (sentiment === "Negative") {
      if (category === "Credit Card") {
        suggestion = "Escalate issue to credit card support team";
      } else if (category === "Loan") {
        suggestion = "Call back user regarding loan issue";
      } else if (category === "Mobile Banking") {
        if (description.includes("upi")) {
          suggestion = "Investigate UPI failure in mobile app";
        } else if (description.includes("pin")) {
          suggestion = "Guide user to reset or verify UPI PIN";
        } else if (description.includes("otp")) {
          suggestion = "Check OTP service delivery issues";
        } else {
          suggestion = "Investigate mobile app-related complaint";
        }
      } else {
        suggestion = "Assign to customer care for follow-up";
      }

    } else if (sentiment === "Neutral") {
      suggestion = `Monitor ${category} feedback for updates`;

    } else if (sentiment === "Positive") {
      if (category === "Credit Card") {
        suggestion = "Thank user and maintain card services quality";
      } else if (category === "Loan") {
        suggestion = "Acknowledge user's positive loan experience";
      } else {
        suggestion = `Maintain service quality in ${category}`;
      }
    }

    return {
      name: item.name || "Unknown",
      category,
      description: item.description || "",
      sentiment,
      suggestion,
    };
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">📊 Feedback Sentiment Analysis</h2>
        <button
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: "#1a73e8",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            marginBottom: "16px",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
        <div className="flex gap-3" style= {{gap: "10px"}}>
          <button
            onClick={async () => {
              try {
                const res = await fetch("http://localhost:5000/api/export/csv", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(suggestions), // ✅ <— this is where it's used
                });

                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "Filtered_Feedback.csv";
                a.click();
              } catch (err) {
                console.error("Export CSV failed:", err);
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Download CSV
          </button>

          <button
            onClick={() => window.open('http://localhost:5000/api/export/pdf')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Download PDF
          </button>
        </div>
      </div>
      <br>
      </br>
      {/* Category Dropdown */}
      <div className="flex items-center gap-4">
        <label className="font-medium" style = {{color:"black"}}>Select Category:</label>
        <select
          className="border p-2 rounded"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="🔍 Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "10px",
              width: "60%",
              borderRadius: "10px",
              border: "1px solid #ccc",
              fontSize: "15px",
            }}
          />
        </div>
      {/* Pie Chart */}
      {filtered.length === 0 ? (
        <p className="text-gray-500">No feedbacks available for this category.</p>
      ) : (
        <>
          <p style={{ textAlign: "center", marginTop: "10px", marginBottom: "10px",color:"blue"}}>
            Showing <b>{filtered.length}</b> feedback(s) —&nbsp;
            😊 {sentimentCount.Positive || 0} Positive,&nbsp;
            😠 {sentimentCount.Negative || 0} Negative,&nbsp;
            😐 {sentimentCount.Neutral || 0} Neutral
          </p>
      <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
      </div>
          {/* Suggestions Table */}
          <h3 className="text-xl font-semibold mt-6" style={{color:"#1a73e8"}}>📌 Suggestions Based on Sentiment</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border mt-2">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Category</th>
                  <th className="border px-4 py-2">Sentiment</th>
                  <th className="border px-4 py-2">Description</th>
                  <th className="border px-4 py-2">Suggestion</th>
                </tr>
              </thead>
              <tbody>
                {/* {suggestions.map((sug, idx) => ( */}
                {suggestions
                  .filter((s) =>
                    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    s.description.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((sug, idx) => (
                  <tr key={idx}>
                    <td className="border px-4 py-2">{sug.name}</td>
                    <td className="border px-4 py-2">{sug.category}</td>
                    {/* <td className="border px-4 py-2">{sug.sentiment}</td> */}
                    <td>
                      <span
                        style={{
                          backgroundColor:
                            sug.sentiment === "Positive" ? "#d1f7c4" :
                            sug.sentiment === "Negative" ? "#fbdcdc" :
                            "#f7f7a1",
                          padding: "4px 10px",
                          borderRadius: "8px",
                          fontWeight: "bold",
                          display: "inline-block"
                        }}
                      >
                        {sug.sentiment === "Positive" ? "😊 " :
                        sug.sentiment === "Negative" ? "😠 " :
                        "😐 "}
                        {sug.sentiment}
                      </span>
                    </td>
                    <td className="border px-4 py-2">{sug.description}</td>
                    <td className="border px-4 py-2"> {sug.suggestion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default VisualizeAnalysis;
