import React from "react";

import { citiesImage } from "./utils/minsc";

const CurrentLocation = ({ currentLocation }) => {
  const dateBuilder = (d) => {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day}, ${month} ${date}${
      date === 1 ? "st" : date === 2 ? "nd" : date === 3 ? "rd" : "th"
    } ${year}`;
  };

  let cityImage = "default";
  const cityName = currentLocation.name.toLowerCase().replace(/\s/g, "");
  const cityFound = citiesImage.find((c) => c === cityName);
  cityImage = cityFound ? cityFound : cityImage;
  
  return (
    <div
      className="location"
      style={{
        backgroundImage: `linear-gradient(to right, #ffffff23, #ffffff23), url(/images/${cityImage}.jpg)`,
      }}
    >
      <div className="location--left">
        <div className="location__info">
          <div className="location__city">
            {currentLocation?.name}, {currentLocation?.sys?.country}
          </div>
          <div className="location__date-time">{dateBuilder(new Date())}</div>
          <div className="location__temp">
            <img
              className="location__icon"
              src={`http://openweathermap.org/img/w/${currentLocation.weather[0].icon}.png`}
            />
            {Math.round(currentLocation?.main?.temp - 273)}
            <span>&#176;</span>C
          </div>
          <div className="location__des">
            {currentLocation?.weather[0].description}
          </div>
        </div>
      </div>

      <div className="location--right">
        <div className="location__weather">
          <div className="location__title">Wind</div>
          <div className="location__value">
            {Math.round(currentLocation?.wind?.speed)} m/c
          </div>
        </div>
        <div className="location__weather">
          <div className="location__title">Feels Like</div>
          <div className="location__value">
            {Math.round(currentLocation?.main?.feels_like - 273)}
            <span>&#176;</span>C
          </div>
        </div>
        <div className="location__weather">
          <div className="location__title">Humidity</div>
          <div className="location__value">
            {Math.round(currentLocation?.main?.humidity)}%
          </div>
        </div>
        <div className="location__weather">
          <div className="location__title">Pressure</div>
          <div className="location__value">
            {Math.round(currentLocation?.main?.pressure)} hpa
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentLocation;
