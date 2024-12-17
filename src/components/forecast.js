import React from "react";

const Forecast = ({ dailyWeather, weatherMapping }) => {
  const today = new Date();
  const todayDate = today.getDate();

  // Process daily weather data to get day labels and weather details
  const forecastData =
    dailyWeather?.temperature_2m_max.slice(0, 4).map((maxTemp, index) => {
      const forecastDate = new Date(today);
      forecastDate.setDate(todayDate + index);

      const dayLabel =
        index === 0
          ? "Today"
          : index === 1
          ? "Tomorrow"
          : forecastDate.toLocaleDateString("en-US", { weekday: "long" });

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
    }) || [];

  return (
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
  );
};

export default Forecast;
