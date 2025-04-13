const express = require('express');
const ShortUrl = require('../models/ShortUrl');
const ClickLog = require('../models/ClickLog');
const getClientInfo = require('../utils/getClientInfo');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/',auth, async (req, res) => {
  try {
    const userId = req.userId;
    const urls = await ShortUrl.find({ userId });

    const analyticsData = await Promise.all(
      urls.map(async (url) => {
        const clickCount = await ClickLog.countDocuments({ shortCode: url.shortCode });
        return {
          originalUrl: url.originalUrl,
          shortCode: url.shortCode,
          shortUrl: `http://localhost:5000/r/${url.shortCode}`,
          createdAt: url.createdAt,
          clickCount,
        };
      })
    );

    res.json(analyticsData);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
});


router.get('/:shortCode', async (req, res) => {
  const short = await ShortUrl.findOne({ shortCode: req.params.shortCode });
  if (!short) return res.status(404).send('Not found');

  if (short.expirationDate && new Date() > short.expirationDate)
    return res.status(410).send('Expired');

  const info = await getClientInfo(req);
  const log = new ClickLog({ shortCode: req.params.shortCode, ...info });
  await log.save();

  res.redirect(short.originalUrl);
});


router.get('/data/:shortCode', async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const query = {
    shortCode: req.params.shortCode,
    browser: { $regex: search, $options: 'i' }
  };

  const logs = await ClickLog.find(query)
    .sort({ timestamp: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await ClickLog.countDocuments(query);

  const clickCountsByDate = await ClickLog.aggregate([
    { $match: { shortCode: req.params.shortCode } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const deviceBreakdown = await ClickLog.aggregate([
    { $match: { shortCode: req.params.shortCode } },
    {
      $group: {
        _id: "$browser",
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({
    logs,
    pagination: {
      total,
      page,
      totalPages: Math.ceil(total / limit)
    },
    stats: {
      clickCountsByDate,
      deviceBreakdown
    }
  });
});

module.exports = router;
