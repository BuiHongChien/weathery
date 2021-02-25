import React from "react";

import CurrentLocation from "./CurrentLocation";
import Location from "./Location";
// import Search from './Search'

import "../styles/app.scss";
import "../styles/location.scss";

const api = {
  key: "27bc22d487c2a65e234d4e0b38ed147f",
  base: "https://api.openweathermap.org/data/2.5",
};

export default class App extends React.Component {
  state = {
    query: "Saint Petersburg",
    currentLocation: null,
    locations: [],
  };

  componentDidMount() {
    this.fetching();
  }

  isExists(city) {
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
  }

  fetching() {
    fetch(`${api.base}/weather?q=${this.state.query}&appid=${api.key}`)
      .then((res) => {
        if (res.status === 200 && !this.isExists(this.state.query))
          return res.json();
        else throw Error(res.statusText);
      })
      .then((result) => {
        if (!this.isExists(this.state.query)) {
          this.setState({
            currentLocation: result,
            locations: [...this.state.locations, this.state.currentLocation],
            query: "",
          });
        }
      })
      .catch((err) => {
        this.setState({ query: "" });
        console.error(err);
      });
  }

  search(event) {
    if (event.key === "Enter") {
      this.fetching();
    }
  }

  deleteLocation(element, id) {
    console.log(id);
    if (this.isExists(id)) {
      let newLocations = [...this.state.locations];
      newLocations.splice(this.isExists(id), 1);
      this.setState({ locations: newLocations });
    }
  }

  changeCurrentLocation(element, id) {
    console.log(id);
    if (this.isExists(id)) {
      let newCurrentLocation = this.state.locations.find(
        (c) => c?.name?.toLowerCase() === id?.toLowerCase()
      );
      let newLocations = [...this.state.locations, this.state.currentLocation];
      newLocations.splice(this.isExists(id), 1);
      this.setState({
        locations: newLocations,
        currentLocation: newCurrentLocation,
        query:''
      });
    }
  }

  renderLocations() {
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
            }
            // {this.test()}
          )}
        </div>
      );
    }
  }
  render() {
    return (
      <div>
        <main>
          <div className="search-box">
            {/* <Search /> */}
            <input
              type="text"
              className="search-box__bar"
              placeholder="Enter city name, country,..."
              onChange={(event) => this.setState({ query: event.target.value })}
              value={this.state.query}
              onKeyPress={(event) => this.search(event)}
            />
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
