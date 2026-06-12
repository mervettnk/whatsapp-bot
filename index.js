const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Twilio için gerekli body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Test endpoint
app.get('/', (req, res) => {
  res.send('WhatsApp bot çalışıyor!');
});

// Twilio webhook endpoint
app.post('/whatsapp', (req, res) => {
  console.log("Mesaj alındı:");
  console.log(req.body);

  res.set('Content-Type', 'text/xml');
  res.send(`
    <Response>
      <Message>Mesaj alındı ✅</Message>
    </Response>
  `);
});

// Render port ayarı
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server çalışıyor, port: ${PORT}`);
});
``