import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
});

app.post('/process', async (req, res) => {
  const { text, mode } = req.body;
  const prompt = mode === "summarize"
    ? `Summarize the following:\n${text}`
    : `Rephrase the following professionally:\n${text}`;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
    });

    const output = chatCompletion.choices[0].message.content;
    res.json({ output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("✅ Groq backend running at http://localhost:3000"));