const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const nodemailer = require("nodemailer");
require("dotenv").config();
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✔️ loaded" : "❌ not loaded");
const Feedback = require("./models/Feedback");
const statusRoutes = require("./routes/status");
const fetchEmails  = require('./fetchEmails'); // <== ✅ Add this line
const exportRoutes = require('./routes/exportRoutes');
const fetchRoutes = require('./routes/fetch');

//new change is added here to check 
//const externalFeedbackRoutes = require('./routes/externalFeedback');

//app.use("/api/status", require("./routes/status"));

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/api/status", statusRoutes);
app.use("/api", exportRoutes);
app.use('/api/facebook', fetchRoutes);

//app.use('/api/external-feedback', externalFeedbackRoutes);
const { OpenAI } = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user:process.env.EMAIL_USER,       // your_email@gmail.com
    pass:process.env.EMAIL_PASS,   // app password (not your Gmail password)
  },
});

app.post("/api/get-sentiment", async (req, res) => {
  const { feedbackId, feedbackText } = req.body;
  try {
    // ✅ Step 1: Check if sentiment already exists
    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) return res.status(404).json({ error: "Feedback not found" });

    if (feedback.sentiment && feedback.sentimentExplanation) {
      // Already analyzed
      return res.json({
        sentiment: feedback.sentiment,
        explanation: feedback.sentimentExplanation,
        alreadyExists: true,
      });
    }

    // ✅ Step 2: Analyze using OpenAI
    const sentimentPrompt = [
      {
        role: "system",
        content:
          "You are a sentiment analysis assistant. Given a feedback, classify the sentiment as Positive, Negative, or Neutral.  Also provide a **one-line explanation** for why you classified it that way.",
      },
      { role: "user", content: `Feedback: "${feedbackText}"` },
    ];

    const result = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: sentimentPrompt,
      max_tokens: 30,
    });

    const content = result.choices[0].message.content.trim();
    const [sentimentLine, ...explanationLines] = content.split("\n");

    const sentiment = sentimentLine.replace(/^Sentiment:\s*/i, "").trim();
    const explanation = explanationLines.join(" ").replace(/^Explanation:\s*/i, "").trim();

    // ✅ Step 3: Save to DB (permanently)
    feedback.sentiment = sentiment;
    feedback.sentimentExplanation = explanation;
    feedback.sentimentGeneratedAt = new Date();
    await feedback.save();

    res.json({ sentiment, explanation, alreadyExists: false });
  } catch (err) {
    console.error("Sentiment API error:", err);
    res.status(500).json({ error: "Failed to analyze sentiment" });
  }
});


app.post("/api/generate-response", async (req, res) => {
  try {
    const { feedbackId, feedbackText, category,responseLength, contextStyle } = req.body;

    // 1. 🔍 Get feedback from DB to fetch email
    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ success: false, error: "Feedback not found." });
    }

    // 2. 📬 Extract email safely
    let userEmail = feedback.email;

    if (!userEmail && feedback.accountId) {
      // Try to extract from "Name <email@example.com>" format
      const match = feedback.accountId.match(/<([^>]+)>/);
      userEmail = match ? match[1] : null;
    }

    if (!userEmail) {
      return res.status(400).json({ success: false, error: "User email not found." });
    }

    // 3. 🧠 Generate AI response using OpenAI
    const systemPrompt = {
      role: "system",
      content: `You are a helpful assistant handling customer feedback in the category: ${category || "general"}.
      Response should be ${responseLength || "medium"} in length and ${contextStyle || "general"} in tone.
      Do not provide account or transactional support.
      Respond kindly, thank the user for their feedback, acknowledge their concern, and let them know it's being considered.
      Never ask for personal or sensitive details. Keep the tone polite and supportive.Even if the feedback contains typos or is written informally, do your best to interpret it correctly.`,
    };

    const userPrompt = {
      role: "user",
      content: feedbackText,
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [systemPrompt, userPrompt],
      max_tokens: 100,
    });

    const aiMessage = completion.choices[0].message.content;
    console.log("🧠 LLM Message:", aiMessage);
    console.log("✅ Response generated for:", userEmail);
    
      await Feedback.findByIdAndUpdate(feedbackId, {
        aiResponse: aiMessage,
        aiResponseSentAt: new Date()
      });

      // ✅ Return response to frontend

    console.log("✅ AI Response Genrated for:", userEmail);
    res.json({ success: true, response: aiMessage });

  } catch (err) {
    console.error("LLM/Email Error:", err);
    res.status(500).json({ success: false, error: "Failed to generate or send response." });
  }
});
app.post("/api/analyze-feedback", async (req, res) => {
  const { category, description } = req.body;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: `You are a helpful assistant analyzing feedback about ${category}.` },
        { role: "user", content: description },
      ],
    });

    res.status(200).json({ result: response.choices[0].message.content });
  } catch (err) {
    console.error("OpenAI Error:", err.message);
    res.status(500).json({ error: "Failed to analyze feedback." });
  }
});
app.post("/api/send-email", async (req, res) => {
  try {
    const { feedbackId } = req.body;

    const feedback = await Feedback.findById(feedbackId);
    if (!feedback || !feedback.aiResponse) {
      return res.status(404).json({ success: false, error: "Feedback or AI response not found." });
    }

    // Get user email from feedback
    let userEmail = feedback.email;
    if (!userEmail && feedback.accountId) {
      const match = feedback.accountId.match(/<([^>]+)>/);
      userEmail = match ? match[1] : null;
    }

    if (!userEmail) {
      return res.status(400).json({ success: false, error: "User email not found." });
    }

    // 📧 Email content
    const aiMessage = feedback.aiResponse;
    const feedbackText = feedback.description;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #1a73e8;">📬 Smart Feedback System</h2>
        <p>Dear User,</p>
        <p>Thank you for reaching out. Here's a summary of your feedback and our response:</p>
        <div style="border-left: 4px solid #1a73e8; margin: 10px 0; padding-left: 10px;">
          <p><strong>Your Feedback:</strong><br/>"${feedbackText}"</p>
        </div>
        <div style="border-left: 4px solid #28a745; margin: 10px 0; padding-left: 10px; background-color: #f6f6f6;">
          <p><strong>Our Response:</strong><br/>${aiMessage}</p>
        </div>
        <p>Kindly reach out again if you need further assistance.</p>
        <p>Warm regards,<br/><strong>Smart Feedback System Team</strong></p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Response to Your Feedback - Smart Feedback System",
      html: emailHtml,
    });
     await Feedback.findByIdAndUpdate(feedbackId, {
      emailSent: true,
    });
    res.status(200).json({ success: true, message: "Email sent successfully." });
  } catch (err) {
    console.error("Send Email Error:", err);
    res.status(500).json({ success: false, error: "Failed to send email." });
  }
});

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/complaint", {
  
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Models
const User = mongoose.model("User", new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}));

const Admin = mongoose.model("Admin", new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}));
// User Routes


app.post("/user/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.email === email ? "Email already registered" : "Username already taken" 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User signup successful!" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Signup failed. Please try again." });
  }
});

app.post("/user/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      user = new User({ username, password, email });
      await user.save();
      return res.status(401).json({ error: "Invalid username" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.status(200).json({ message: "Login successful!" ,name: user.username  });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// Admin Routes
app.post('/admin/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email domain
    if (!email.endsWith('@admin.com')) {
      return res.status(400).json({ error: 'Email must end with @admin.com' });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });
    if (existingAdmin) {
      if (existingAdmin.email === email) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      return res.status(400).json({ error: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin signup successful!' });
  } catch (error) {
    console.error('Admin Signup Error:', error);
    res.status(500).json({ error: 'Admin signup failed. Please try again.' });
  }
});

app.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid username' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    res.status(200).json({ message: 'Admin login successful!' });
  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

app.post("/api/feedback", upload.single("image"), async (req, res) => {
  try {
     console.log("Incoming Feedback Body:", req.body); // 👈 ADD THIS
    console.log("Incoming File:", req.file);           // 👈 AND THIS

    const { name,email, category, description,source = "web" } = req.body;
    
      if (!name || !category || !description) {
      return res.status(400).json({ success: false, error: "Missing required fields." });
    }
    const feedbackData = {
      name,
      email,
      category,
      description,
      source,
    };

    if (req.file) {
      feedbackData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const feedback = new Feedback(feedbackData);
    await feedback.save();

    res.status(201).json({ success: true, message: "Feedback submitted successfully!" });
  } catch (error) {
    console.error("Feedback Submission Error:", error);
    res.status(500).json({ success: false, error: "Failed to submit feedback" });
  }
});

app.get("/api/feedback", async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    //const ExternalFeedback = require('./models/externalFeedback');

    const formattedFeedbacks = feedbacks.map((feedback) => {
      let imageUrl = null;
      if (feedback.image && feedback.image.data) {
        const base64Image = feedback.image.data.toString("base64");
        imageUrl = `data:${feedback.image.contentType};base64,${base64Image}`;
      }

      return {
        _id: feedback._id,
        name: feedback.name || "Unknown",
        category: feedback.category || "Other",
        description: feedback.description,
        imageUrl,
        source: feedback.source || "web",
        date: feedback.createdAt,
        aiResponse: feedback.aiResponse || null,
        aiResponseSentAt: feedback.aiResponseSentAt || null,
        sentiment: feedback.sentiment || null, // ✅ Add this
        sentimentExplanation: feedback.sentimentExplanation || null, 
        sentimentGeneratedAt: feedback.sentimentGeneratedAt || null,
        emailSent: feedback.emailSent || false,
        repliedOnFacebook: feedback.repliedOnFacebook || false,
        facebookReplyTime: feedback.facebookReplyTime || null,
        commentId: feedback.commentId || null, // ✅ Add this!
      };
    });

    res.status(200).json(formattedFeedbacks);
  } catch (error) {
    console.error("Fetch Feedback Error:", error);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});


app.get('/api/fetch-emails', async (req, res) => {
  try {
     const count = await fetchEmails();
    if (count === 0) {
      res.json({ message: "No new feedback emails found." });
    } else {
      res.json({ message: `${count} feedback emails saved.` });
    }
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ message: 'Failed to fetch emails' });
  }
});
// ✅ Only external feedbacks (excluding portal "web" entries)
app.get('/api/external-feedbacks', async (req, res) => {
  try {
    const externalFeedbacks = await Feedback.find({
      source: { $ne: "web" }, // not coming from portal
    }).sort({ date: -1 });

    res.status(200).json(externalFeedbacks);
  } catch (err) {
    console.error('Failed to fetch external feedbacks:', err);
    res.status(500).json({ message: 'Failed to fetch external feedbacks' });
  }
});

app.get("/test-fetch", async (req, res) => {
  try {
    const count = await fetchEmails();
    res.send(`Fetched ${count} emails`);
  } catch (err) {
    console.error("❌ TEST FETCH FAILED:", err);
    res.status(500).send("Failed to fetch emails from Gmail");
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));