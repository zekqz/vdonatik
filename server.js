import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());

// ❗ ОБЯЗАТЕЛЬНО: вставь новый токен после перевыпуска в BotFather
const BOT_TOKEN = "8586095138:AAEI-RApbz51fNPfA-WazjCWe9tx8hv8uaE";

// ❗ Твой chat_id (проверь через getUpdates)
const CHAT_ID = "7143093332";

app.post("/api/order", async (req, res) => {
  try {
    const { login, amount, region } = req.body;

    // 🔒 проверка данных
    if (!login || !amount || !region) {
      return res.status(400).json({
        ok: false,
        error: "Missing fields"
      });
    }

    const text =
`🛒 НОВЫЙ ЗАКАЗ

👤 Логин: ${login}
💰 Сумма: ${amount}
🌍 Регион: ${region}`;

    // 📤 отправка в Telegram
    const tgResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text
        })
      }
    );

    const data = await tgResponse.json();

    // 🧠 лог ответа Telegram (очень важно для дебага)
    console.log("Telegram response:", data);

    if (!data.ok) {
      return res.status(500).json({
        ok: false,
        error: data
      });
    }

    return res.json({ ok: true });

  } catch (err) {
    console.error("Server error:", err);

    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
});

// 🚀 запуск сервера
app.listen(3000, () => {
  console.log("Server started on port 3000");
});