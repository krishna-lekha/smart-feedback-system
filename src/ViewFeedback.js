// import React, { useEffect, useState } from "react";
// import "./ViewFeedback.css";
// import { useNavigate } from "react-router-dom";

// const ViewFeedback = () => {
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFeedbacks = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/feedback");
//         if (!response.ok) {
//           throw new Error("Failed to fetch feedbacks");
//         }
//         const data = await response.json();
//         setFeedbacks(data);
//       } catch (error) {
//         console.error("Error fetching feedback:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFeedbacks();
//   }, []);

//   if (loading) {
//     return <p>Loading feedback...</p>;
//   }

//   return (
//     <div className="view-feedback-container">
//       <button className="back-button" onClick={() => navigate(-1)}>
//         ← Back
//       </button>

//       <h1>User Feedback Overview</h1>
//       {feedbacks.length > 0 ? (
//         <table className="feedback-table">
//           <thead>
//             <tr>
//               <th>Description</th>
//               <th>Screenshot</th>
//             </tr>
//           </thead>
//           <tbody>
//             {feedbacks.map((feedback) => (
//               <tr key={feedback._id}>
//                 <td>{feedback.description || "No description provided"}</td>
//                 <td>
//                   {feedback.imageUrl ? (
//                     <img
//                       src={feedback.imageUrl}
//                       alt="User Screenshot"
//                       className="feedback-image"
//                       style={{ width: "120px", height: "auto", borderRadius: "6px" }}
//                     />
//                   ) : (
//                     "No image"
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p className="no-feedback-message">No feedback available.</p>
//       )}
//     </div>
//   );
// };

// export default ViewFeedback;

// import React, { useEffect, useState } from "react";
// import "./ViewFeedback.css";
// import { useNavigate } from "react-router-dom";

// const ViewFeedback = () => {
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFeedbacks = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/feedback");
//         if (!response.ok) {
//           throw new Error("Failed to fetch feedbacks");
//         }
//         const data = await response.json();
//         setFeedbacks(data);
//       } catch (error) {
//         console.error("Error fetching feedback:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFeedbacks();
//   }, []);

//   if (loading) {
//     return <p>Loading feedback...</p>;
//   }

//   return (
//     <div className="view-feedback-container">
//       <button className="back-button" onClick={() => navigate(-1)}>
//         ← Back
//       </button>

//       <h1>User Feedback Overview</h1>

//       {feedbacks.length > 0 ? (
//         <table className="feedback-table">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Category</th>
//               <th>Description</th>
//               <th>Screenshot</th>
//               <th>Source</th>
//             </tr>
//           </thead>
//           <tbody>
//             {feedbacks.map((feedback) => (
//               <tr key={feedback._id}>
//                 {/* <td>{feedback.name || "N/A"}</td> */}
//                 {/* <td>{feedback.source === "web" ? feedback.name || "Unknown" : feedback.accountId || "Anonymous"}</td> */}
//                 <td title={feedback.accountId || ""}>
//                     {feedback.name || "Anonymous"}
//                 </td>
//                 <td>{feedback.category || "N/A"}</td>
//                 <td>{feedback.description || "No description"}</td>
//                 <td>
//                   {feedback.imageUrl ? (
//                     <img
//                       src={feedback.imageUrl}
//                       alt="User Screenshot"
//                       className="feedback-image"
//                       style={{ width: "120px", height: "auto", borderRadius: "6px" }}
//                     />
//                   ) : (
//                     "No image"
//                   )}
//                 </td>
//                 <td>{feedback.source || "web"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p className="no-feedback-message">No feedback available.</p>
//       )}
//     </div>
//   );
// };

// export default ViewFeedback;

// import React, { useEffect, useState } from "react";
// import "./ViewFeedback.css";
// import { useNavigate } from "react-router-dom";

// const ViewFeedback = () => {
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [aiResponse, setAiResponse] = useState("");
//   const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);
//   const [generating, setGenerating] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFeedbacks = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/feedback");
//         if (!response.ok) throw new Error("Failed to fetch feedbacks");
//         const data = await response.json();
//         setFeedbacks(data);
//       } catch (error) {
//         console.error("Error fetching feedback:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFeedbacks();
//   }, []);

//   const handleGenerateResponse = async (feedback) => {
//     setGenerating(true);
//     setSelectedFeedbackId(feedback._id);
//     setAiResponse("");

//   try {
//     // 1️⃣ Generate AI response
//     const response = await fetch("http://localhost:5000/api/generate-response", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//     feedbackId: feedback._id, // use ID to look up email
//     feedbackText: feedback.description,
//     category: feedback.category,
//   }),
// });
//   const data = await response.json();

// if (data.success) {
//  const generatedText = data.response;

//   // ✅ Update state to reflect response
//   setFeedbacks((prev) =>
//     prev.map((f) =>
//       f._id === feedback._id
//         ? {
//             ...f,
//             aiResponse: data.response,
//             aiResponseSentAt: new Date().toISOString(),
//           }
//         : f
//     )
//   );
//       setAiResponse(generatedText); // Show to admin
//       alert("✅ Response generated and emailed to user.");
//     } else {
//       setAiResponse("Failed to generate response.");
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     setAiResponse("❌ Error occurred during generation or sending.");
//   } finally {
//     setGenerating(false);
//   }
// };

//   if (loading) return <p>Loading feedback...</p>;

//   return (
//     <div className="view-feedback-container">
//       <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
//       <h1>User Feedback Overview</h1>

//       {feedbacks.length > 0 ? (
//         <table className="feedback-table">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Category</th>
//               <th>Description</th>
//               <th>Screenshot</th>
//               <th>Source</th>
//               <th>LLM Reply</th>
//             </tr>
//           </thead>
//           <tbody>
//             {feedbacks.map((feedback) => (
//               <tr key={feedback._id}>
//                 <td>{feedback.name || "Anonymous"}</td>
//                 <td>{feedback.category || "N/A"}</td>
//                 <td>{feedback.description || "No description"}</td>
//                 <td>
//                   {feedback.imageUrl ? (
//                     <img src={feedback.imageUrl} alt="Screenshot" style={{ width: "100px", borderRadius: "6px" }} />
//                   ) : "No image"}
//                 </td>
//                 <td>{feedback.source || "web"}</td>
//                 <td>
//                   {/* <button
//                     className="generate-button"
//                     onClick={() => handleGenerateResponse(feedback)}
//                     disabled={generating && selectedFeedbackId === feedback._id}
//                   >
//                     {generating && selectedFeedbackId === feedback._id ? "Generating..." : "Generate Response"}
//                   </button> */}
//                   <button
//                     className="generate-button"
//                     onClick={() => handleGenerateResponse(feedback)}
//                     disabled={generating || feedback.aiResponse}
//                   >
//                     {feedback.aiResponse
//                       ? "Response Sent"
//                       : generating && selectedFeedbackId === feedback._id
//                       ? "Generating..."
//                       : "Generate Response"}
//                   </button>
//                   {/* {selectedFeedbackId === feedback._id && aiResponse && (
//                     <div className="ai-response-box">
//                       <strong>Response:</strong>
//                       <p style={{ whiteSpace: "pre-wrap" }}>{aiResponse}</p>
//                     </div>
//                   )} */}
//                   {feedback.aiResponse && (
//                     <div className="ai-response-box">
//                       <strong>Response:</strong>
//                       <p>{feedback.aiResponse}</p>
//                       {feedback.aiResponseSentAt && (
//                         <p className="sent-time">🕒 Sent on: {new Date(feedback.aiResponseSentAt).toLocaleString()}</p>
//                       )}
//                     </div>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>No feedback available.</p>
//       )}
//     </div>
//   );
// };

// export default ViewFeedback;

import React, { useEffect, useState } from "react";
import "./ViewFeedback.css";
import { useNavigate } from "react-router-dom";

const ViewFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [responseOptions, setResponseOptions] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/feedback");
        if (!response.ok) throw new Error("Failed to fetch feedbacks");
        const data = await response.json();
        setFeedbacks(data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  const handleSentiment = async (feedback) => {
    setProcessingId(feedback._id);
    try {
      const response = await fetch("http://localhost:5000/api/get-sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedbackId: feedback._id,
          feedbackText: feedback.description,
        }),
      });
      const data = await response.json();
      if (data.sentiment) {
        setFeedbacks((prev) =>
          prev.map((f) =>
            f._id === feedback._id
              ? {
                  ...f,
                  sentiment: data.sentiment,
                  sentimentExplanation: data.explanation,
                }
              : f
          )
        );
        alert("✅ Sentiment generated successfully.");
      } else {
        alert("Failed to generate sentiment.");
      }
    } catch (err) {
      console.error("Sentiment error:", err);
      alert("Error generating sentiment.");
    } finally {
      setProcessingId(null);
    }
  };

  const renderSentimentEmoji = (sentiment) => {
    const s = sentiment.toLowerCase();
    if (s.includes("positive")) return "🟢 Positive";
    if (s.includes("negative")) return "🔴 Negative";
    if (s.includes("neutral")) return "🟡 Neutral";
    return "⚪ Unknown";
  };
  
  const handleGenerateResponse = async (feedback) => {
    setGenerating(true);
    setSelectedFeedbackId(feedback._id);

    try {
      const options = responseOptions[feedback._id] || { length: "medium", context: "general" };
      const response = await fetch("http://localhost:5000/api/generate-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          feedbackId: feedback._id,
          feedbackText: feedback.description,
          category: feedback.category,
          responseLength: options.length,
          contextStyle: options.context,
        }),
      });

      const data = await response.json();
      console.log("⚠️ Backend response:", data); // Debug log


      if (data.success) {
        const generatedText = data.response;

        // Update feedback with AI response and timestamp
        setFeedbacks((prev) =>
          prev.map((f) =>
            f._id === feedback._id
              ? {
                  ...f,
                  aiResponse: generatedText,
                  aiResponseSentAt: new Date().toISOString(),
                }
              : f
          )
        );

        alert("✅ Response generated successfully. Please click 'Send Email' or 'Reply on Facebook' to deliver it.");
      } else {
        alert("⚠️ Failed to generate response.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error occurred during generation or sending.");
    } finally {
      setGenerating(false);
    }
  };
    const replyToFacebook = async (commentId, replyText) => {
        try {
          const res = await fetch("http://localhost:5000/api/facebook/reply", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              commentId,
              replyText,
            }),
          });

          const data = await res.json();
          if (res.ok) {
            alert("✅ Facebook reply posted!");
              setFeedbacks((prevFeedbacks) =>
                prevFeedbacks.map((f) =>
                  f.commentId === commentId
                    ? {
                        ...f,
                        repliedOnFacebook: true,
                        facebookReplyTime: new Date().toISOString(),
                      }
                    : f
                )
              );
          } else {
            alert("❌ Failed to post: " + data.error?.message);
          }
        } catch (err) {
          console.error(err);
          alert("❌ Error sending Facebook reply.");
        }
      };
  const handleSendEmail = async (feedback) => {
  try {
    const res = await fetch("http://localhost:5000/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        feedbackId: feedback._id,
        email: feedback.email,
        name: feedback.name,
        message: feedback.aiResponse,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Email sent successfully!");
      setFeedbacks((prev) =>
        prev.map((f) =>
          f._id === feedback._id
            ? { ...f,  emailSent: true }
            : f
        )
      );
    } else {
      alert("❌ Email failed to send: " + data.message);
    }
  } catch (err) {
    console.error(err);
    alert("❌ Error sending email.");
  }
};


  if (loading) return <p>Loading feedback...</p>;

  return (
    <div className="view-feedback-container">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      <h1>User Feedback Overview</h1>

      {feedbacks.length > 0 ? (
        <table className="feedback-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Description</th>
              <th>Screenshot</th>
              <th>Source</th>
              <th>Sentiment</th>
              <th>LLM Response Settings 🛠️</th>
              <th>LLM Reply</th>
              <th>Reply/Email</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback) => (
              <tr key={feedback._id}>
                <td style = {{width: "150px"}}> {feedback.name && feedback.name !== "Facebook User"
                    ? feedback.name
                    : "Facebook User (Private Profile)"}</td>
                <td>{feedback.category || "N/A"}</td>
                <td>{feedback.description || "No description"}</td>
                <td>
                  {feedback.imageUrl ? (
                    <img src={feedback.imageUrl} alt="Screenshot" style={{ width: "100px", borderRadius: "6px" }} />
                  ) : "No image"}
                </td>
                {/* <td>{feedback.source || "web"}</td> */}
                <td>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '8px',
                    backgroundColor: {
                      web: '#e0e0e0',
                      email: '#f0d9ff',
                      instagram: '#ffdde1',
                      twitter: '#cceeff',
                      whatsapp: '#ccffcc',
                      facebook: '#d0e7ff'
                    }[feedback.source || 'web'],
                    color: '#333',
                    fontWeight: 'bold',
                    textTransform: 'capitalize',
                    display: 'inline-block',
                    width:'100px'
                  }}>
                    {feedback.source || 'web'}
                  </span>
                </td>
                <td>
                  {feedback.sentiment ? (
                    <div>
                      <strong>{renderSentimentEmoji(feedback.sentiment)}</strong>
                      <br />
                      <small style={{ fontStyle: "italic", color: "#555" }}>
                        {feedback.sentimentExplanation}
                      </small>
                      <br />
                      {feedback.sentimentGeneratedAt && (
                        <small style={{ color: "#999", fontSize: "12px" }}>
                          🕒 {new Date(feedback.sentimentGeneratedAt).toLocaleString()}
                        </small>
                      )}
                      <br />
                      <button
                        className="generate-button"
                        disabled
                        style={{ marginTop: "4px", backgroundColor: "#ccc", cursor: "not-allowed" }}
                      >
                        ✅ Sentiment Generated
                      </button>
                    </div>
                  ) : (
                    <button
                      className="generate-button"
                      onClick={() => handleSentiment(feedback)}
                      disabled={processingId === feedback._id}
                    >
                      {processingId === feedback._id ? "Generating..." : "Generate Sentiment"}
                    </button>
                  )}
                </td>

                {!feedback.aiResponse && (
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div>   
                        <label>Length:</label>
                        <select
                          value={responseOptions[feedback._id]?.length || "medium"}
                          onChange={(e) =>
                            setResponseOptions((prev) => ({
                              ...prev,
                              [feedback._id]: {
                                ...(prev[feedback._id] || {}),
                                length: e.target.value,
                              },
                            }))
                          }
                        >
                          <option value="short">Short</option>
                          <option value="medium">Medium</option>
                          <option value="detailed">Detailed</option>
                        </select>
                        <br />
                      </div>

                      <div>
                        <label>Context:</label>
                        <select
                          value={responseOptions[feedback._id]?.context || "general"}
                          onChange={(e) =>
                            setResponseOptions((prev) => ({
                              ...prev,
                              [feedback._id]: {
                                ...(prev[feedback._id] || {}),
                                context: e.target.value,
                              },
                            }))
                          }
                        >
                          <option value="general">General</option>
                          <option value="apologetic">Apologetic</option>
                          <option value="action-oriented">Action-Oriented</option>
                          <option value="informative">Informative</option>
                        </select>
                      </div>
                    </div>
                  </td>
                )}
                {feedback.aiResponse && <td>✅ Response Sent</td>}

                <td style={{width: "250px"}}>
                  <button
                    className="generate-button"
                    onClick={() => handleGenerateResponse(feedback)}
                    disabled={generating || feedback.aiResponse}
                  >
                    {feedback.aiResponse
                      ? "Response Sent"
                      : generating && selectedFeedbackId === feedback._id
                      ? "Generating..."
                      : "Generate Response"}
                  </button>

                  {feedback.aiResponse && (
                    <div className="ai-response-box">
                      <strong>Response:</strong>
                      <p>{feedback.aiResponse}</p>
                      {feedback.aiResponseSentAt && (
                        <p className="sent-time">
                          🕒 Sent on: {new Date(feedback.aiResponseSentAt).toLocaleString()}
                        </p>
                      )}               
                    </div>
                  )}
                </td>
                <td style={{ width: "250px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {/* ✅ Always show Send Email button for portal/email */}
                  {(feedback.source === "email" || feedback.source === "web") && (
                      feedback.emailSent ? (
                        <button
                          style={{
                            backgroundColor: "green",
                            color: "white",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "4px",
                          }}
                        >
                          ✅ Email Sent
                        </button>
                      ) : (
                    <button
                      style={{
                        backgroundColor: "#1a73e8",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        opacity: feedback.aiResponse  ? 1 : 0.6,
                        cursor: feedback.aiResponse? "pointer" : "not-allowed",
                      }}
                      onClick={() => {
                        console.log("Clicked", feedback);
                        handleSendEmail(feedback);
                      }}
                      disabled={!feedback.aiResponse}
                    >
                      📧 Send Email
                    </button>
                  )
                 )}
{console.log("📌 Facebook commentId for", feedback.name, "=>", feedback.commentId)}
                  {/* ✅ Always show Facebook Reply button if commentId exists */}
                  {feedback.source === "facebook" && feedback.commentId && (
                     feedback.repliedOnFacebook ? (
                      <button
                        style={{
                          backgroundColor: "green",
                          color: "white",
                          border: "none",
                          padding: "5px 10px",
                          borderRadius: "4px",
                        }}
                      >
                        ✅ Facebook Sent
                      </button>
                    ) : (
                    <button
                      style={{
                        backgroundColor: "#4267B2",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        opacity: feedback.aiResponse && !feedback.repliedOnFacebook? 1 : 0.6,
                        cursor: feedback.aiResponse && !feedback.repliedOnFacebook ? "pointer" : "not-allowed",
                      }}
                      onClick={() => replyToFacebook(feedback.commentId, feedback.aiResponse || "")}
                      disabled={!feedback.aiResponse || feedback.repliedOnFacebook}
                    >
                      💬 Reply on Facebook
                    </button>
                  )
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No feedback available.</p>
      )}
    </div>
  );
};

export default ViewFeedback;
