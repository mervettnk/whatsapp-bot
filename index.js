const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// Test endpoint
app.get('/', (req, res) => {
  res.send('WhatsApp bot çalışıyor!');
});

// Twilio webhook endpoint
app.post('/whatsapp', (req, res) => {
  console.log(req.body);
  res.send('Mesaj alındı');
});

// Render için port ayarı
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server çalışıyor, port: ${PORT}`);
});
