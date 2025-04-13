const QRCode = require('qrcode');

module.exports = async function (url) {
  return await QRCode.toDataURL(url);
};
