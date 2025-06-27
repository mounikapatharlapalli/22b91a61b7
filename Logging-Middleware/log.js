require('dotenv').config(); 
const axios = require('axios');

const Log = async (stack, level, pkg, message) => {
  try {
    const res = await axios.post(
      'http://20.244.56.144/evaluation-service/logs',
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      }
    );
    console.log("Log sent:", res.data.message);
  } catch (err) {
    console.error("Log error:", err.message);
  }
};

module.exports = Log;
