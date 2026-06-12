const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

// body parse
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ✅ SENİN GOOGLE SCRIPT URL
const SHEET_WEBHOOK = "https://script.google.com/macros/s/AKfycbzlxRIrSVvjdNnwraM25C9bb8G5lb6bgeONkuNfuNE4qhpDaMZtdsCB5HzcLw7-xfOsOg/exec";

// ✅ Category → Puan map (şimdilik temel)
const POINTS = {
  "sampiyon": 50,
  "finalist": 10,
  "yari finalist": 10,
  "gol krali": 25,
  "asist krali": 20,
  "altin top": 25
};

// test endpoint
app.get("/", (req, res) => {
  res.send("Bot aktif ✅");
});

// webhook
app.post("/whatsapp", async (req, res) => {
  console.log("Gelen veri:", req.body);

  const msg = req.body.Body;
  const user = req.body.ProfileName || req.body.From;

  // kupon mesajı kontrol
  if (msg && msg.toLowerCase().startsWith("kupon:")) {

    const lines = msg.split("\n");

    for (let line of lines) {
      line = line.trim();

      if (!line.includes(":")) continue;

      const parts = line.split(":");

      if (parts.length < 2) continue;

      const category = parts[0].toLowerCase().trim();
      const selection = parts[1].trim();

      const points = POINTS[category] || 0;

      try {
        await axios.post(SHEET_WEBHOOK, {
          user,
          category,
          selection,
          points
        });

        console.log("Sheet'e yazıldı:", user, category, selection);

      } catch (err) {
        console.log("Sheet hata:", err.message);
      }
    }

    return res.send(`
      <Response>
        <Message>Kupon kaydedildi ✅</Message>
      </Response>
    `);
  }

  // default reply
  res.send(`
    <Response>
      <Message>Komut: kupon:</Message>
    </Response>
  `);
});

// server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server çalışıyor:", PORT);
});