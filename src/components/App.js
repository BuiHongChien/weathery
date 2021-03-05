import React from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

import CurrentLocation from "./CurrentLocation";
import Location from "./Location";
import data from "./data/data.json";
import { cities } from "./utils/minsc";

import "../styles/app.scss";
import "../styles/location.scss";

const api = {
  key: "27bc22d487c2a65e234d4e0b38ed147f",
  base: "https://api.openweathermap.org/data/2.5",
};

export default class App extends React.Component {
  state = {
    query: "",
    currentLocation: null,
    currentLat: null,
    currentLon: null,
    locations: [],
    suggestions: [],
    hoveredLocation: null,
    data: cities(data),
  };

  componentDidMount() {
    if (localStorage.getItem("currentLocation") === null) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState(
            {
              currentLat: position.coords.latitude,
              currentLon: position.coords.longitude,
            },
            () => this.fetching()
          );
        },
        (err) => this.setState({ query: "hanoi" }, () => this.fetching())
      );
    } else {
      this.getItem();
    }
  }

  isExists = (city) => {
    let exists = false;
    if (this.state.currentLocation?.name?.toLowerCase() === city?.toLowerCase())
      return true;
    if (this.state.locations.length > 0) {
      exists = this.state.locations.find(
        (c) => c?.name?.toLowerCase() === city?.toLowerCase()
      );
      if (exists) return this.state.locations.indexOf(exists);
      else return false;
    }
    return false;
  };

  fetching = () => {
    let url =
      this.state.query === ""
        ? `${api.base}/weather?lat=${this.state.currentLat}&lon=${this.state.currentLon}&appid=${api.key}`
        : `${api.base}/weather?q=${this.state.query}&appid=${api.key}`;
    console.log(url);
    fetch(url)
      .then((res) => {
        if (res.status === 200 && !this.isExists(this.state.query))
          return res.json();
        else throw Error(res.statusText);
      })
      .then((result) => {
        console.log(result);
        if (!this.isExists(this.state.query)) {
          this.setState(
            {
              currentLocation: result,
              locations: [...this.state.locations, this.state.currentLocation],
              query: "",
              currentLat: result.coord.lat,
              currentLon: result.coord.lon,
            },
            () => {
              console.log(this.state);
              this.setItem();
            }
          );
        }
      })
      .catch((err) => {
        this.setState({ query: "" });
        console.error(err);
      });
  };

  setItem = () => {
    const { currentLocation, locations } = this.state;
    localStorage.setItem("currentLocation", JSON.stringify(currentLocation));
    localStorage.setItem("locations", JSON.stringify(locations));
  };

  getItem = () => {
    this.setState({
      query: "",
      currentLocation: JSON.parse(localStorage.getItem("currentLocation")),
      locations: JSON.parse(localStorage.getItem("locations")),
    });
  };

  search = (event) => {
    if (event.key === "Enter") {
      this.setState({ suggestions: [] }, () => {
        this.fetching();
        this.setItem();
      });
    }
  };

  onTextChange = (event) => {
    const value = event.target.value;
    let suggestions = [];
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, "i");
      // console.log(this.state.data)
      suggestions = this.state.data
        ?.filter((city) => regex.test(city))
        .slice(0, 10);
    }

    this.setState(() => ({
      suggestions,
      query: value,
    }));
  };

  selectedText = (value) => {
    this.setState(
      {
        query: value,
        suggestions: [],
      },
      () => {
        console.log("fetching...");
        this.fetching();
        this.setItem();
      }
    );
  };

  handleOnClickSuggestion=(item)=>{
    console.log("li tag was clicked")
  }

  renderSuggestions = () => {
    let { suggestions } = this.state;
    if (suggestions.length === 0) return null;

    return (
      <ul
        className="search-box__suggestions"
      >
        {suggestions.map((item, index) => {
          return (
            <li
              key={index}
              onClick={()=>this.handleOnClickSuggestion(item)}
              className="search-box__suggestion"
            >
              {item}
            </li>
          );
        })}
      </ul>
    );
  };

  deleteLocation = (element, id) => {
    // console.log(id);
    if (this.isExists(id)) {
      let newLocations = [...this.state.locations];
      newLocations.splice(this.isExists(id), 1);
      this.setState({ locations: newLocations }, () => this.setItem());
    }
  };

  changeCurrentLocation = (element, id) => {
    console.log(id)
    if (this.isExists(id)) {
      let newCurrentLocation = this.state.locations.find(
        (c) => c?.name?.toLowerCase() === id?.toLowerCase()
      );
      let newLocations = [...this.state.locations, this.state.currentLocation];
      newLocations.splice(this.isExists(id), 1);
      this.setState(
        {
          locations: newLocations,
          currentLocation: newCurrentLocation,
          currentLat: newCurrentLocation.coord.lat,
          currentLon: newCurrentLocation.coord.lon,
          query: "",
        },
        () => this.setItem()
      );
    }
  };

  renderLocations = () => {
    if (this.state.locations.length > 1) {
      return (
        <div className="location-container">
          {this.state.locations.map((location) => {
            if (location)
              return (
                <Location
                  location={location}
                  id={location.name}
                  key={location.name}
                  deleteLocation={(element, id) =>
                    this.deleteLocation(element, id)
                  }
                  changeCurrentLocation={(element, id) =>
                    this.changeCurrentLocation(element, id)
                  }
                />
              );
          })}
        </div>
      );
    }
  };

  render() {
    return (
      <div>
        <main>
          <div className="search-box">
            <input
              id="query"
              type="text"
              className="search-box__bar"
              placeholder="Enter city name, country,..."
              onKeyPress={(event) => this.search(event)}
              onChange={this.onTextChange}
              value={this.state.query}
            />
            {this.renderSuggestions()}
          </div>
          {this.state.currentLocation ? (
            <CurrentLocation currentLocation={this.state.currentLocation} />
          ) : null}
          {this.state.locations.length > 1 ? this.renderLocations() : null}
        </main>
      </div>
    );
  }
}
