const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const SHEET_WEBHOOK = "https://script.google.com/macros/s/AKfycbx_VwJgAtRaNRsCUuanBhupLN4mXadRFbQfgyGRut3Gx1ApVQPp-zAePq84GAH7WQVyOA/exec";

// Category → puan map
const POINTS = {
  "sampiyon": 50,
  "finalist": 10,
  "yari finalist": 10,
  "gol krali": 25,
  "asist krali": 20,
  "altin top": 25
};

app.post('/whatsapp', async (req, res) => {
  const msg = req.body.Body;
  const user = req.body.ProfileName || req.body.From;

  // sadece "kupon:" ile başlayan mesajları işle
  if (msg.toLowerCase().startsWith("kupon:")) {

    const lines = msg.split("\n");

    for (let line of lines) {
      line = line.trim();
      if (!line.includes(":")) continue;

      const [categoryRaw, selection] = line.split(":");

      const category = categoryRaw.toLowerCase().trim();
      const choice = selection.trim();

      const points = POINTS[category] || 0;

      try {
        await axios.post(SHEET_WEBHOOK, {
          user,
          category,
          selection: choice,
          points
        });
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

  res.send(`
    <Response>
      <Message>Komut: kupon:</Message>
    </Response>
  `);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server çalışıyor");
});
``