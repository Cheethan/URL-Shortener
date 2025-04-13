const express = require('express');

const ShortUrl = require('../models/ShortUrl');
const generateQRCode = require('../utils/generateQRCode');
const auth = require('../middleware/auth');
const generateShortCode = require('../utils/generateShortCode');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { originalUrl, customAlias, expirationDate } = req.body;
  const shortCode = customAlias || generateShortCode();

  const newShort = new ShortUrl({
    userId: req.userId,
    originalUrl,
    shortCode,
    expirationDate
  });

  await newShort.save();

  const shortUrl = `http://localhost:5000/r/${shortCode}`;
  const qrCode = await generateQRCode(shortUrl);

  res.json({ shortUrl, qrCode });
});

module.exports = router;
