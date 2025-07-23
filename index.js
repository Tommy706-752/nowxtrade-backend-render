const express = require("express");
const axios = require("axios");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
app.use(express.json());

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

app.post("/generate-signal", async (req, res) => {
  try {
    const { pair, timeframe, strategy } = req.body;
    const prompt = `Generate a trading signal for ${pair} on the ${timeframe} timeframe using ${strategy} strategy.`;

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const signal = completion.data.choices[0].message.content.trim();
    res.status(200).json({ signal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate signal." });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`AI Signal Server running on port ${PORT}`);
});