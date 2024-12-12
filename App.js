import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {

  const initialCities = [
    { name: "New York", lat: 40.7128, lon: -74.006 },
    { name: "Tokyo", lat: 35.6895, lon: 139.6917 },
    { name: "London", lat: 51.5074, lon: -0.1278 },
    { name: "Paris", lat: 48.8566, lon: 2.3522 },
    { name: "Sydney", lat: -33.8688, lon: 151.2093 },
    { name: "Berlin", lat: 52.52, lon: 13.405 },
    { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
    { name: "Moscow", lat: 55.7558, lon: 37.6173 },
    { name: "Tirana", lat: 41.3289, lon: 19.8178 },
  ];

  const [cities, setCities] = useState(initialCities);
  const [selectedCity, setSelectedCity] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [dailyWeather, setDailyWeather] = useState(null);
  const [error, setError] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newLat, setNewLat] = useState("");
  const [newLon, setNewLon] = useState("");

  const weatherConditions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    56: "Light Freezing drizzle",
    57: "Freezing drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    66: "Light Freezing rain",
    67: "Heavy Freezing rain",
    71: "Slight Snow fall",
    73: "Moderate Snow fall",
    75: "Heavy Snow fall",
    77: "Snow grains",
    80: "Slight Rain showers",
    81: "Moderate Rain showers",
    82: "Strong Rain showers",
    85: "Slight Snow showers",
    86: "Heavy Snow showers",
    95: "Moderate Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };

  const iconMapping = {
    0: "☀️",
    1: "🌤️",
    2: "⛅",
    3: "☁️",
    45: "🌫️",
    48: "🌫️",
    51: "🌦️",
    53: "🌦️",
    55: "🌧️",
    56: "🌨️",
    57: "🌨️",
    61: "🌧️",
    63: "🌧️",
    65: "🌧️",
    66: "❄️",
    67: "❄️",
    71: "❄️",
    73: "❄️",
    75: "❄️",
    77: "❄️",
    80: "🌦️",
    81: "🌧️",
    82: "🌩️",
    85: "❄️",
    86: "❄️",
    95: "⛈️",
    96: "⛈️",
    99: "⛈️",
  };
  useEffect(() => {
    if (!selectedCity) return;

    const fetchWeatherData = async () => {
      const city = cities.find((city) => city.name === selectedCity);
      const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,windspeed_10m_max,weathercode&current_weather=true&timezone=Europe/Berlin`;

      try {
        const response = await axios.get(apiUrl);
        setCurrentWeather(response.data.current_weather);
        setDailyWeather(response.data.daily);
        setError("");
      } catch (error) {
        setError("Unable to fetch weather data.");
      }
    };

    fetchWeatherData();
  }, [selectedCity, cities]);

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleAddCity = () => {
    if (newCity && newLat && newLon) {
      const newCityObj = { name: newCity, lat: parseFloat(newLat), lon: parseFloat(newLon) };
      setCities([...cities, newCityObj]);
      setNewCity("");
      setNewLat("");
      setNewLon("");
    } else {
      setError("Please fill in all fields to add a new city.");
    }
  };

  return (
    <div className="App">

      <h1>Weather App</h1>

      <div>
        <h2>Current Weather for
          <select value={selectedCity} onChange={handleCityChange}>
            <option value="">Select a city</option>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select></h2>
      </div>

      {error && <p>{error}</p>}
      {currentWeather && dailyWeather ? (

        <div className="app-divider">

          <div className="current-weather">
            <div className="current-weather-info">
              <p>Condition: {weatherConditions[currentWeather.weathercode]} {iconMapping[currentWeather.weathercode]}</p>
            </div>
            <div className="current-weather-info">
              <p>Current Temperature: {currentWeather.temperature}°C</p>
            </div>
            <br/>
            <div className="current-weather-info">
              <p>Wind Speed: {currentWeather.windspeed} km/h</p>
            </div>
          </div>

          <div className="div-forecast">

            <div className="forecast">
              {dailyWeather.temperature_2m_max.slice(0, 4).map((maxTemp, index) => (
                <div key={index} className="forecast-day">
                  <h3>Day {index + 1}</h3>
                  <p>{weatherConditions[dailyWeather.weathercode[index]] || "Unknown"}{" "}
                    <span>{iconMapping[dailyWeather.weathercode[index]]}</span>
                  </p>
                  <p>Temperatures going from {dailyWeather.temperature_2m_min[index]}°C up to {maxTemp}°C</p>
                  <p>Feels like {dailyWeather.apparent_temperature_min[index]}°C - {dailyWeather.apparent_temperature_max[index]}°C</p>
                  <p>Precipitation chance: {dailyWeather.precipitation_sum[index]} mm</p>
                  <p>Max Wind Speed: {dailyWeather.windspeed_10m_max[index]} km/h</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      ) : (
        <p>Select a city to see the weather forecast.</p>
      )}

      <h3>Add a New City</h3>
      <div>
        <input
          type="text"
          placeholder="City name"
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="Latitude"
          value={newLat}
          onChange={(e) => setNewLat(e.target.value)}
        />
        <input
          type="text"
          placeholder="Longitude"
          value={newLon}
          onChange={(e) => setNewLon(e.target.value)}
        />
        <button onClick={handleAddCity}>Add City</button>
      </div>
    </div>
  );
}

export default App;