import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const port = 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.post("/generate", async (req, res) => {
  const mood = req.body.mood;

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a kind motivational coach." },
        { role: "user", content: `I feel this way: ${mood}. Please give me a short motivational message.` }
      ],
      model: "gpt-3.5-turbo",
      max_tokens: 60
    });

    const message = chatCompletion.choices[0].message.content;
    res.json({ message });
  } catch (error) {
    console.error("API error:", error.message);
    res.status(500).json({ message: "Error generating message." });
  }
});

app.listen(port, () => {
  console.log(`Motivaid is running at http://localhost:${port}`);
});
