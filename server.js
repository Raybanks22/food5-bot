const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Send message to Telegram
async function sendToTelegram(message) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "HTML",
    }),
  });
  return res.json();
}

// API endpoint to receive form data
app.post("/api/submit", async (req, res) => {
  const { name, favFood, cuisine, spicy, dietary, mealTime, mood } = req.body;

  if (!name || !favFood) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const message = `
🍽️ <b>New Food Preference Submission!</b>

👤 <b>Name:</b> ${name}
❤️ <b>Favourite Food:</b> ${favFood}
🌍 <b>Favourite Cuisine:</b> ${cuisine || "Not specified"}
🌶️ <b>Spice Level:</b> ${spicy || "Not specified"}
🥗 <b>Dietary Preference:</b> ${dietary || "None"}
⏰ <b>Favourite Meal Time:</b> ${mealTime || "Not specified"}
😋 <b>Current Food Mood:</b> ${mood || "Not specified"}
  `.trim();

  try {
    await sendToTelegram(message);
    res.json({ success: true, message: "Sent to Telegram!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send to Telegram" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});