const useragent = require('useragent');
const axios = require('axios');

module.exports = async function (req) {
  const agent = useragent.parse(req.headers['user-agent']);
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  let location = {};
  try {
    const { data } = await axios.get(`https://ipapi.co/${ip}/json/`);
    location = data;
  } catch (err) {
    location = { city: 'Unknown', country: 'Unknown' };
  }

  return {
    ip,
    device: agent.device.toString(),
    browser: agent.family,
    os: agent.os.toString(),
    location
  };
};
