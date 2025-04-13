const express = require('express');
const ShortUrl = require('../models/ShortUrl');
const ClickLog = require('../models/ClickLog');
const getClientInfo = require('../utils/getClientInfo');
const auth = require('../middleware/auth');


const router = express.Router()


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


module.exports = router;
