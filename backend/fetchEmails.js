const { google } = require("googleapis");
const authorizeGmail = require("./google");
const Feedback = require("./models/Feedback");
console.log("🔍 fetchEmails.js is running...");

async function fetchEmails() {
  try {
    const auth = await authorizeGmail();
    const gmail = google.gmail({ version: "v1", auth });
    console.log("✅ Gmail API initialized");

    console.log("🔍 Fetching unread messages...");
const res = await gmail.users.messages.list({
  userId: "me",
  q: "is:unread",
  maxResults: 5,
});
console.log("📬 Raw response:", JSON.stringify(res.data, null, 2));


    const messages = res.data.messages || [];
    console.log("📩 Messages found:", messages.length);

    let savedCount = 0;

    for (const message of messages) {
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
      });

      const headers = msg.data.payload.headers || [];
      const subject = headers.find((h) => h.name === "Subject")?.value || "";
      const from = headers.find((h) => h.name === "From")?.value || "Unknown";

      const parts = msg.data.payload.parts || [];
      let bodyData = msg.data.payload.body?.data;

      // fallback to parts[0] if bodyData is not directly present
      if (!bodyData && parts.length > 0) {
        const plainTextPart = parts.find((p) => p.mimeType === "text/plain") || parts[0];
        bodyData = plainTextPart?.body?.data;
      }

      let body = "No content";
      if (bodyData) {
        body = Buffer.from(bodyData, "base64").toString("utf-8");
      }
      

      // if (subject.toLowerCase().includes("feedback")) {
      //   const feedback = new Feedback({
      //     description: body,
      //     source: "email",
      //     accountId: from,
      //   });
// if (subject.toLowerCase().includes("feedback")) {
//   // Detect category from subject + body
//   let category = "Other";
//   const text = `${subject} ${body}`.toLowerCase();

//   if (text.includes("credit card")) category = "Credit Card";
//   else if (text.includes("loan")) category = "Loan";
//   else if (text.includes("transaction")) category = "Transaction";
//   else if (text.includes("mobile banking") || text.includes("app")) category = "Mobile Banking";

//   // Extract name from "From" header
//   const name = from.split("<")[0].trim() || "Email User";

//   const feedback = new Feedback({
//     name,
//     category,
//     description: body,
//     source: "email",
//     accountId: from,
//   });
//         await feedback.save();
//         savedCount++;

//         await gmail.users.messages.modify({
//           userId: "me",
//           id: message.id,
//           requestBody: {
//             removeLabelIds: ["UNREAD"],
//           },
//         });

//         console.log(`✅ Saved feedback from: ${from}`);
//       }
//     }

        if (subject.toLowerCase().includes("feedback")) {
          // Detect category from subject + body
          let category = "Other";
          const text = `${subject} ${body}`.toLowerCase();

          if (text.includes("credit card")) category = "Credit Card";
          else if (text.includes("loan")) category = "Loan";
          else if (text.includes("transaction")) category = "Transaction";
          else if (text.includes("mobile banking") || text.includes("app")) category = "Mobile Banking";

          // Extract name and email from From header
          const name = from.split("<")[0].trim() || "Email User";
          const emailMatch = from.match(/<(.*)>/);
          const email = emailMatch ? emailMatch[1] : "unknown@example.com";

          const feedback = new Feedback({
            name,
            email, // ✅ THIS LINE IS CRUCIAL
            category,
            description: body,
            source: "email",
          });

          await feedback.save();
          savedCount++;

          // Mark message as read
          await gmail.users.messages.modify({
            userId: "me",
            id: message.id,
            requestBody: {
              removeLabelIds: ["UNREAD"],
            },
          });

          console.log(`✅ Saved feedback from: ${from}`);
        }
    }
    console.log("🎉 Emails fetched and saved:", savedCount);
    return savedCount;
  } catch (err) {
    console.error("❌ Error in fetchEmails:", err.response?.data || err.message);
    throw err;
  }
}

module.exports = fetchEmails;


if (require.main === module) {
  fetchEmails();
}
