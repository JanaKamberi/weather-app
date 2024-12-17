import React, { useState, useEffect } from "react";
import axios from "axios";

import weatherMapping from "./components/weatherMapping.js";
import Forecast from "./components/forecast.js";

import therm from "./images/therm.png";
import chance from "./images/chance.png";
import feelslike from "./images/feels_like.png";
import windy from "./images/windy.png";

function App() {
  const initialCities = [
    { name: "Tirana", lat: 41.3289, lon: 19.8178 },
    { name: "New York", lat: 40.7128, lon: -74.006 },
    { name: "Tokyo", lat: 35.6895, lon: 139.6917 },
    { name: "London", lat: 51.5074, lon: -0.1278 },
    { name: "Paris", lat: 48.8566, lon: 2.3522 },
    { name: "Sydney", lat: -33.8688, lon: 151.2093 },
    { name: "Berlin", lat: 52.52, lon: 13.405 },
    { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
    { name: "Moscow", lat: 55.7558, lon: 37.6173 },
  ];

  const [cities, setCities] = useState(initialCities);
  const [selectedCity, setSelectedCity] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [dailyWeather, setDailyWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newLat, setNewLat] = useState("");
  const [newLon, setNewLon] = useState("");

  useEffect(() => {
    if (!selectedCity) return;

    //https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_probability_max,wind_speed_10m_max

    const fetchWeatherData = async () => {
      const city = cities.find((city) => city.name === selectedCity);
      const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,windspeed_10m_max,weathercode&current_weather=true&timezone=Europe/Berlin`;

      setLoading(true);
      try {
        const response = await axios.get(apiUrl, {
          timeout: 10000,
        });
        setCurrentWeather(response.data.current_weather);
        setDailyWeather(response.data.daily);
        setError("");
      } catch (error) {
        setError("Unable to fetch weather data.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [selectedCity, cities]);

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleAddCity = () => {
    // Convert inputs to numbers
    const lat = parseFloat(newLat);
    const lon = parseFloat(newLon);

    // Check for empty fields
    if (!newCity || isNaN(lat) || isNaN(lon)) {
      setError("Please provide valid city name, latitude, and longitude.");
      return;
    }

    // Check latitude and longitude ranges
    if (lat < -90 || lat > 90) {
      setError("Latitude must be between -90 and 90 degrees.");
      return;
    }

    if (lon < -180 || lon > 180) {
      setError("Longitude must be between -180 and 180 degrees.");
      return;
    }

    // If all checks pass, add the new city
    const newCityObj = {
      name: newCity,
      lat,
      lon,
    };

    setCities([...cities, newCityObj]);
    setNewCity("");
    setNewLat("");
    setNewLon("");
    setError(""); // Clear any previous errors
  };

  return (
    <div className="App">
      <h1>Weather App</h1>
      <div>
        <h2>
          Current Weather for
          <select value={selectedCity} onChange={handleCityChange}>
            <option value="">Select a city</option>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </h2>
      </div>

      {/*Loaading Screen*/}
      {loading ? (
        <div className="loading-screen">
          <h2>Loading...</h2>
        </div>
      ) : currentWeather && dailyWeather ? (
        <div className="app-divider">
          <div className="current-weather">
            <h2 className="current-temp">
              {weatherMapping[currentWeather.weathercode]?.icon}{" "}
              {weatherMapping[currentWeather.weathercode]?.condition}
            </h2>

            <div className="current-weather-info">
              <div className="icon-square">
                <img src={therm} alt="thermomertor icon" />
              </div>
              <div>
                <p className="specific-weather">Temperature</p>
                <p className="API-result">{currentWeather.temperature}°C</p>
              </div>
            </div>

            <div className="current-weather-info">
              <div className="icon-square">
                <img src={windy} alt="windy icon" />
              </div>
              <div>
                <p className="specific-weather">Wind Speed</p>
                <p className="API-result">{currentWeather.windspeed} km/h</p>
              </div>
            </div>

            <div className="current-weather-info">
              <div className="icon-square">
                <img src={feelslike} alt="multiple weather conditions" />
              </div>
              <div>
                <p className="specific-weather"> Feels like</p>
                <p className="API-result">
                  {Math.round(
                    dailyWeather.apparent_temperature_min[0] +
                      dailyWeather.apparent_temperature_max[0]
                  ) / 2}
                  °C
                </p>
              </div>
            </div>

            <div className="current-weather-info">
              <div className="icon-square">
                <img src={chance} alt="water percentage" />
              </div>
              <div>
                <p className="specific-weather"> Precipitation</p>
                <p className="API-result">
                  {dailyWeather.precipitation_sum[0]} m
                </p>
              </div>
            </div>
          </div>
          {/* Using the Forecast Component */}
          <Forecast
            dailyWeather={dailyWeather}
            weatherMapping={weatherMapping}
          />
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
        <p>{error && <p>{error}</p>}</p>
      </div>
    </div>
  );
}

export default App;
