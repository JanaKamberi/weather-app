import React, { useState, useEffect } from "react";
import axios from "axios";

//Added more components
import weatherMapping from "./components/weatherMapping.js";
import initialCities from "./components/initialCities.js";

import therm from "./images/therm.png";
import chance from "./images/chance.png";
import feelslike from "./images/feels_like.png";
import windy from "./images/windy.png";

function App() {
    const [cities, setCities] = useState(initialCities);
    const [selectedCity, setSelectedCity] = useState("");
    const [currentWeather, setCurrentWeather] = useState(null);
    const [currentWeatherUnits, setCurrentWeatherUnits] = useState(null); //added weather units from the api
    const [dailyWeather, setDailyWeather] = useState(null);
    const [dailyWeatherUnits, setdailyWeatherUnits] = useState(null); //and for forecasts
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [newCity, setNewCity] = useState("");
    const [newLat, setNewLat] = useState("");
    const [newLon, setNewLon] = useState("");

    useEffect(() => {
        if (!selectedCity) return;

        const fetchWeatherData = async () => {
            const city = cities.find((city) => city.name === selectedCity);
            const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_probability_max,wind_speed_10m_max`;

            setLoading(true);
            try {
                const response = await axios.get(apiUrl, { timeout: 10000 });
                console.log("API Response:", response.data);

                //added responses for the units form the api
                setCurrentWeather(response.data.current);
                setCurrentWeatherUnits(response.data.current_units);
                setDailyWeather(response.data.daily);
                setdailyWeatherUnits(response.data.daily_units);
                setError("");
            } catch (err) {
                setError("Unable to fetch weather data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, [selectedCity, cities]);

    const handleCityChange = (e) => {
        setSelectedCity(e.target.value);
    };

    //added conditions for adding a new city
    const handleAddCity = () => {
        const lat = parseFloat(newLat);
        const lon = parseFloat(newLon);

        if (!newCity || isNaN(lat) || isNaN(lon)) {
            setError("Please provide a valid city name, latitude, and longitude.");
            return;
        }
        if (lat < -90 || lat > 90) {
            setError("Latitude must be between -90 and 90 degrees.");
            return;
        }
        if (lon < -180 || lon > 180) {
            setError("Longitude must be between -180 and 180 degrees.");
            return;
        }

        const newCityObj = { name: newCity, lat, lon };
        setCities([...cities, newCityObj]);
        setNewCity("");
        setNewLat("");
        setNewLon("");
        setError("");
    };

    //put the date calculation in one place
    const today = new Date();
    const forecastData = dailyWeather?.temperature_2m_max?.map((_, index) => {
        const forecastDate = new Date(today);
        forecastDate.setDate(today.getDate() + index);

        const dayLabel =
            index === 0
                ? "Today"
                : index === 1
                ? "Tomorrow"
                : forecastDate.toLocaleDateString("en-US", {
                      weekday: "long",
                  });

        return {
            dayLabel,
            weatherCode: dailyWeather.weather_code?.[index],
            maxTemp: dailyWeather.temperature_2m_max[index],
            minTemp: dailyWeather.temperature_2m_min[index],
            apparentMax: dailyWeather.apparent_temperature_max[index],
            apparentMin: dailyWeather.apparent_temperature_min[index],
            precipitation: dailyWeather.precipitation_probability_max[index],
            windSpeed: dailyWeather.wind_speed_10m_max[index],
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

            {loading ? ( //added a loading message
                <div className="loading-screen">
                    <h2>Loading...</h2>
                </div>
            ) : error ? (
                <div className="error"></div>
            ) : currentWeather && dailyWeather ? (
                <div className="app-divider">
                    <div className="current-weather">
                        <h2 className="current-temp">
                            {weatherMapping[currentWeather.weather_code]?.icon} {weatherMapping[currentWeather.weather_code]?.condition}
                        </h2>

                        <div className="current-weather-info">
                            <div className="icon-square">
                                <img src={therm} alt="thermometer icon" />
                            </div>
                            <div>
                                <p className="specific-weather">Temperature</p>
                                <p className="API-result">
                                    {currentWeather.temperature_2m} {currentWeatherUnits.temperature_2m}
                                </p>
                            </div>
                        </div>

                        <div className="current-weather-info">
                            <div className="icon-square">
                                <img src={windy} alt="windy icon" />
                            </div>
                            <div>
                                <p className="specific-weather">Wind Speed</p>
                                <p className="API-result">
                                    {currentWeather.wind_speed_10m} {currentWeatherUnits.wind_speed_10m}
                                </p>
                            </div>
                        </div>

                        <div className="current-weather-info">
                            <div className="icon-square">
                                <img src={feelslike} alt="feels like icon" />
                            </div>
                            <div>
                                <p className="specific-weather">Feels like</p>
                                <p className="API-result">
                                    {currentWeather.apparent_temperature} {currentWeatherUnits.apparent_temperature}
                                </p>
                            </div>
                        </div>

                        <div className="current-weather-info">
                            <div className="icon-square">
                                <img src={chance} alt="precipitation icon" />
                            </div>
                            <div>
                                <p className="specific-weather">Precipitation</p>
                                <p className="API-result">
                                    {currentWeather.precipitation} {currentWeatherUnits.precipitation}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="div-forecast">
                        <div className="forecast">
                            {forecastData.slice(0, 4).map((data, index) => (
                                <div key={index} className="forecast-day">
                                    <h3>{data.dayLabel}</h3>
                                    <p className="main-weather-info">
                                        {weatherMapping[data.weatherCode]?.icon} {weatherMapping[data.weatherCode]?.condition}
                                    </p>
                                    <p>
                                        Temperatures {data.minTemp}
                                        {dailyWeatherUnits.temperature_2m_max} up to {data.maxTemp}
                                        {dailyWeatherUnits.temperature_2m_max}
                                        <br />
                                        Will feel {data.apparentMin}
                                        {dailyWeatherUnits.apparent_temperature_min} up to {data.apparentMax}
                                        {dailyWeatherUnits.apparent_temperature_max}
                                        <br />
                                        Rain chance {data.precipitation}
                                        {dailyWeatherUnits.precipitation_probability_max}
                                        <br />
                                        Max Wind Speed {data.windSpeed} {dailyWeatherUnits.wind_speed_10m_max}
                                    </p>
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
                <input type="text" placeholder="City name" value={newCity} onChange={(e) => setNewCity(e.target.value)} />
                <input type="text" placeholder="Latitude" value={newLat} onChange={(e) => setNewLat(e.target.value)} />
                <input type="text" placeholder="Longitude" value={newLon} onChange={(e) => setNewLon(e.target.value)} />
                <button onClick={handleAddCity}>Add City</button>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
}

export default App;
