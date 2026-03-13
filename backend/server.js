const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
console.log('Server file loaded (JS)');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('OK');
});

app.post('/api/verify-recaptcha', async (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const params = new URLSearchParams({
      secret: process.env.SECRET_KEY || '',
      response: token,
    });

    const googleRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await googleRes.json();
    return res.json({ success: data.success, data });
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return res.status(500).json({ success: false, error: 'Verification failed' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

