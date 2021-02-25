import React from "react";

import { city } from "./utils/minsc";
import "../styles/_button.scss";

const Location = ({ location, id, deleteLocation, changeCurrentLocation }) => {
  let cityImage = "default";
  const cityName = location.name.toLowerCase().replace(/\s/g, "");
  const cityFound = city.find((c) => c === cityName);
  cityImage = cityFound ? cityFound : cityImage;

  return (
    <div
      className="location-box"
      onClick={(element) => changeCurrentLocation(element, id)}
      style={{
        backgroundImage: `linear-gradient(to right, #000000a6, #000000a6), url(/images/${cityImage}.jpg)`
      }}
    >
      <div className="location-box__city">
        <div className="location-box__name">{location.name}</div>
        <div className="location-box__temp">
        <img className='location-box__icon' src={`http://openweathermap.org/img/w/${location.weather[0].icon}.png`} />
          {Math.round(location?.main?.temp - 273)}
          <span>&#176;</span>C
        </div>
        <button
          className="button button--close"
          onClick={(element) => {
            element.stopPropagation();
            deleteLocation(element, id);
          }}
        >
          x
        </button>
      </div>

      <div className="location-box__details">
        <div className="location-box__weather">
          <div className="location-box__title">Wind</div>
          <div className="location-box__value">
            {Math.round(location?.wind?.speed)}m/c
          </div>
        </div>
        <div className="location-box__weather">
          <div className="location-box__title">Feels Like</div>
          <div className="location-box__value">
            {Math.round(location?.main?.feels_like - 273)}
            <span>&#176;</span>C
          </div>
        </div>
        <div className="location-box__weather">
          <div className="location-box__title">Humidity</div>
          <div className="location-box__value">
            {Math.round(location?.main?.humidity)}%
          </div>
        </div>
        <div className="location-box__weather">
          <div className="location-box__title">Pressure</div>
          <div className="location-box__value">
            {Math.round(location?.main?.pressure)} hpa
          </div>
        </div>
      </div>
    </div>
    // <div></div>
  );
};

export default Location;
