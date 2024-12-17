import React, { useState, useEffect } from "react";
import axios from "axios";

import weatherMapping from "./components/weatherMapping.js"; //added new component for maping the icons and weather conditions

import therm from "./images/therm.png";
import chance from "./images/chance.png";
import feelslike from "./images/feels_like.png";
import windy from "./images/windy.png";

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
      const newCityObj = {
        name: newCity,
        lat: parseFloat(newLat),
        lon: parseFloat(newLon),
      };
      setCities([...cities, newCityObj]);
      setNewCity("");
      setNewLat("");
      setNewLon("");
    } else {
      setError("Please fill in all fields to add a new city.");
    }
  };

  const today = new Date();
  const todayDate = today.getDate();

  // Preprocess forecast data to calculate day labels and weather info
  const forecastData = dailyWeather?.temperature_2m_max
    .slice(0, 4)
    .map((maxTemp, index) => {
      const forecastDate = new Date(today);
      forecastDate.setDate(todayDate + index);

      const dayLabel =
        index === 0
          ? "Today"
          : index === 1
          ? "Tomorrow"
          : forecastDate.toLocaleDateString("en-US", { weekday: "long" }); // Other days as weekday

      return {
        dayLabel,
        maxTemp,
        minTemp: dailyWeather.temperature_2m_min[index],
        apparentMin: dailyWeather.apparent_temperature_min[index],
        apparentMax: dailyWeather.apparent_temperature_max[index],
        precipitation: dailyWeather.precipitation_sum[index],
        windSpeed: dailyWeather.windspeed_10m_max[index],
        weatherCode: dailyWeather.weathercode[index],
      };
    });

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

      {error && <p>{error}</p>}
      {currentWeather && dailyWeather ? (
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
          <div className="div-forecast">
            <div className="forecast">
              {forecastData.map((data, index) => (
                <div key={index} className="forecast-day">
                  <h3>{data.dayLabel}</h3>
                  <p className="main-weather-info">
                    {weatherMapping[data.weatherCode]?.icon}{" "}
                    {weatherMapping[data.weatherCode]?.condition}
                  </p>
                  <p>
                    Temperatures going {data.minTemp}°C up to {data.maxTemp}°C
                  </p>
                  <p>
                    Feels like {data.apparentMin}°C - {data.apparentMax}°C
                  </p>
                  <p>Precipitation {data.precipitation} mm</p>
                  <p>Max Wind Speed {data.windSpeed} km/h</p>
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
