import React from "react";
import { FaHeart } from "react-icons/fa";
import { BiHeart } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";

import { citiesImage } from "./utils/minsc";
import "../styles/_button.scss";

const Location = ({
  location,
  favorites, 
  id,
  deleteLocation,
  changeCurrentLocation,
  addToFavorites,
  removeFavorite,
}) => {
  // console.log(favorites);

  let cityImage = "default";
  const cityName = location.name.toLowerCase().replace(/\s/g, "");
  const cityFound = citiesImage.find((c) => c === cityName);
  cityImage = cityFound ? cityFound : cityImage;

  return (
    <div
      className="location-box"
      onClick={(element) => changeCurrentLocation(element, id)}
      style={{
        backgroundImage: `linear-gradient(to right, #000000a6, #000000a6), url(/images/${cityImage}.jpg)`,
      }}
    >
      <div className="location-box__city">
        <div className="location-box__name">{location.name}</div>
        <div className="location-box__temp">
          <img
            className="location-box__icon"
            src={`http://openweathermap.org/img/w/${location.weather[0].icon}.png`}
          />
          {Math.round(location?.main?.temp - 273)}
          <span>&#176;</span>C
        </div>
        <button
          // icon={favorites.indexOf(id)===-1?'heart outline':'heart'}
          className={`button button--favorite`}
          onClick={(element) => {
            element.stopPropagation();
            if (favorites.indexOf(id) === -1) addToFavorites(element, id);
            else removeFavorite(element, id);
          }}
        >
          {
            favorites.indexOf(id)===-1? <BiHeart className='bi-heart' />:<FaHeart className='fa-heart' />
          }
        </button>
        <button
          className="button button--close"
          onClick={(element) => {
            element.stopPropagation();
            deleteLocation(element, id);
          }}
        >
          
          <FaTrash className='fa-trash'/>
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
  );
};

export default Location;
