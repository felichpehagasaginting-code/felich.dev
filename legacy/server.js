require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3001;

// Security
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'https://yourdomain.com']
}));
app.use(bodyParser.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10kb' }));

// Rate limiting
const rateLimiter = new RateLimiterMemory({
  points: 10, // 10 requests
  duration: 60, // per 1 minute
});
app.use((req, res, next) => {
  rateLimiter.consume(req.ip)
    .then(() => next())
    .catch(() => res.status(429).json({ error: 'Too many requests, try again later.' }));
});

// Data dir
const DATA_DIR = './data';
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

// Transporter for EmailJS or Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL || '',
    pass: process.env.NODEMAILER_PASS || ''
  }
});

// Serve static frontend
app.use(express.static('.'));

// API Routes
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Save to JSON
    const submission = {
      id: Date.now().toString(),
      name,
      email,
      message,
      timestamp: new Date().toISOString()
    };

    const submissions = [];
    const submissionsPath = path.join(DATA_DIR, 'contacts.json');
    if (fs.existsSync(submissionsPath)) {
      const data = fs.readFileSync(submissionsPath, 'utf8');
      submissions.push(...JSON.parse(data));
    }
    submissions.push(submission);
    fs.writeFileSync(submissionsPath, JSON.stringify(submissions, null, 2));

    // Send email (optional)
    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: process.env.NODEMAILER_EMAIL,
      subject: `New Portfolio Contact: ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <small>Submitted: ${new Date().toLocaleString()}</small>
      `
    });

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET submissions (admin/debug)
app.get('/api/contacts', (req, res) => {
  const submissionsPath = path.join(DATA_DIR, 'contacts.json');
  if (fs.existsSync(submissionsPath)) {
    res.json(JSON.parse(fs.readFileSync(submissionsPath, 'utf8')));
  } else {
    res.json([]);
  }
});

// GET Guestbook entries
app.get('/api/guestbook', (req, res) => {
  const guestbookPath = path.join(DATA_DIR, 'guestbook.json');
  if (fs.existsSync(guestbookPath)) {
    res.json(JSON.parse(fs.readFileSync(guestbookPath, 'utf8')));
  } else {
    // Default initial message
    res.json([{ name: 'System', message: 'Welcome to the guestbook! Be the first to leave a message. 🎉', date: new Date().toISOString(), avatar: '🤖' }]);
  }
});

// POST Guestbook entry
app.post('/api/guestbook', (req, res) => {
  try {
    const { name, message } = req.body;
    if (!name || !message) {
      return res.status(400).json({ error: 'Name and message are required' });
    }

    const entry = {
      id: Date.now().toString(),
      name: name.substring(0, 50),
      message: message.substring(0, 500),
      date: new Date().toISOString(),
      avatar: '👤'
    };

    const guestbookPath = path.join(DATA_DIR, 'guestbook.json');
    let entries = [];
    
    if (fs.existsSync(guestbookPath)) {
      entries = JSON.parse(fs.readFileSync(guestbookPath, 'utf8'));
    } else {
      entries = [{ name: 'System', message: 'Welcome to the guestbook! Be the first to leave a message. 🎉', date: new Date().toISOString(), avatar: '🤖' }];
    }
    
    entries.unshift(entry); // Add to top
    
    fs.writeFileSync(guestbookPath, JSON.stringify(entries, null, 2));
    res.json({ success: true, entry });
  } catch (error) {
    console.error('Guestbook error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📧 Contact API: http://localhost:${PORT}/api/contact`);
  console.log(`📝 Guestbook API: http://localhost:${PORT}/api/guestbook`);
  console.log('💡 Copy .env.example to .env and configure email');
});

