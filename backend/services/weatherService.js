const axious = require('axios');

const getCurrentWeather = async (city) => {
  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: city,
          appid: process.env.OPENWEATHER_API_KEY,
          units: "metric"
        }
      }
    );

    return response.data;

  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Weather API unavailable");
  }
};

module.exports = { getCurrentWeather };