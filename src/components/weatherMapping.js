const weatherMapping = {
  0: { condition: "Clear sky", icon: "☀️" },
  1: { condition: "Mainly clear", icon: "🌤️" },
  2: { condition: "Partly cloudy", icon: "⛅" },
  3: { condition: "Overcast", icon: "☁️" },
  45: { condition: "Fog", icon: "🌫️" },
  48: { condition: "Depositing rime fog", icon: "🌫️" },
  51: { condition: "Light Drizzle", icon: "🌦️" },
  53: { condition: "Moderate Drizzle", icon: "🌦️" },
  55: { condition: "Dense Drizzle", icon: "🌧️" },
  56: { condition: "Light Freezing drizzle", icon: "🌨️" },
  57: { condition: "Freezing drizzle", icon: "🌨️" },
  61: { condition: "Slight Rain", icon: "🌧️" },
  63: { condition: "Moderate Rain", icon: "🌧️" },
  65: { condition: "Heavy Rain", icon: "🌧️" },
  66: { condition: "Light Freezing rain", icon: "❄️" },
  67: { condition: "Heavy Freezing rain", icon: "❄️" },
  71: { condition: "Slight Snow fall", icon: "❄️" },
  73: { condition: "Moderate Snow fall", icon: "❄️" },
  75: { condition: "Heavy Snow fall", icon: "❄️" },
  77: { condition: "Snow grains", icon: "❄️" },
  80: { condition: "Slight Rain showers", icon: "🌦️" },
  81: { condition: "Moderate Rain showers", icon: "🌧️" },
  82: { condition: "Strong Rain showers", icon: "🌩️" },
  85: { condition: "Slight Snow showers", icon: "❄️" },
  86: { condition: "Heavy Snow showers", icon: "❄️" },
  95: { condition: "Moderate Thunderstorm", icon: "⛈️" },
  96: { condition: "Thunderstorm with slight hail", icon: "⛈️" },
  99: { condition: "Thunderstorm with heavy hail", icon: "⛈️" },
};

export default weatherMapping;
