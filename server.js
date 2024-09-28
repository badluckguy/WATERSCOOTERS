// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const app = express();

// Middleware to serve static files and handle form data
app.use(express.static('public')); // Ensure 'public' is where your static files are stored
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your app-specific password
  },
});

// POST route to handle form submission and send an email
app.post('/send-message', (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email, // Customer's email
    to: process.env.EMAIL_USER, // Your receiving email
    subject: `New message from ${name}`,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Error sending message');
    } else {
      console.log('Message sent: %s', info.messageId);
      res.redirect('/thank-you.html'); // Redirect to thank-you page on success
    }
  });
});

// Stripe Checkout route
const storeItems = new Map([
  [1, { priceInCents: 50000, name: 'Waterscooter X200' }],
  [2, { priceInCents: 45000, name: 'Waterscooter X300' }],
]);

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: req.body.items.map(item => {
        const storeItem = storeItems.get(item.id);
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInCents,
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${process.env.SERVER_URL}/success.html`,
      cancel_url: `${process.env.SERVER_URL}/cancel.html`,
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
