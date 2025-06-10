const express = require("express");
const next = require("next");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const port = 3000;

  server.use(express.json());

  server.post("/api/generate", async (req, res) => {
    const { topic } = req.body;
    console.log(topic);

    const prompt = `
Сгенерируй 5 карточек по теме "${topic}" на **русском языке**.
Формат:
[
  {
    "question": "...",
    "options": [...],
    "answer": "..."
  },
  ...
]
`;
    console.log(process.env.OPENROUTER_API_KEY);

    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "deepseek/deepseek-r1-0528-qwen3-8b",
          messages: [
            {
              role: "system",
              content:
                "Ты помощник, создающий учебные карточки в JSON-формате. Отвечай строго на русском языке. Никаких пояснений и лшинего текста. Обязательно должен быть один и едиственный верный ответ.",
            },
            { role: "user", content: prompt },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": "http://localhost:3000/",
            "Content-Type": "application/json",
          },
        }
      );

      let rawText = response.data.choices[0].message.content;
      console.log(rawText);

      rawText = rawText.trim();
      if (rawText.startsWith("```json")) {
        rawText = rawText
          .replace(/^```json/, "")
          .replace(/```$/, "")
          .trim();
      } else if (rawText.startsWith("```")) {
        rawText = rawText.replace(/^```/, "").replace(/```$/, "").trim();
      }
      let parsed;
      try {
        parsed = JSON.parse(rawText);
      } catch (jsonErr) {
        return res
          .status(200)
          .json({ raw: rawText, warning: "Ответ не в JSON, проверь формат" });
      }

      res.json(parsed);
    } catch (err) {
      console.error("Ошибка генерации:", {
        message: err.message,
        code: err.code,
        response: err.response?.data,
        config: err.config,
      });

      res
        .status(500)
        .json({
          error: "Не удалось получить ответ от OpenRouter",
          details: err.response?.data || err.message,
        });
    }
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
  });
});
