import React from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import axios from 'axios'

import CurrentLocation from "./CurrentLocation";
import Location from "./Location";
import data from "./data/data.json";
import { cities } from "./utils/minsc";
import FavoriteList from './FavoriteList'

import "../styles/app.scss";
import "../styles/location.scss";

const api="http://localhost:5000"

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
    favorites: [],
  };

  componentDidMount() {
    axios.get(`${api}/location`).then(
      res=>{
        if(res.data.length===0){
          navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.fetching({lat:position.coords.latitude, lon:position.coords.longitude})
                },
                (err) => this.setState({ query: "hanoi" }, () => this.fetching({name:'hanoi'}))
              );
        }
        else{
          const favorites=res.data.filter(l=>l.isFavorite).map(f=>f._id);
          const currentLocation=res.data.filter(l=>l.isCurrentLocation)

          this.setState({
            locations:res.data,
            favorites:favorites,
            currentLocation:currentLocation[0],
            currentLat:currentLocation[0].coord.lat,
            currentLon:currentLocation[0].coord.lon
          })
        }}
    )
  }

  fetching = (position) => {
    // console.log(position)
    axios.post(`${api}/location`, position).then(res=>{
      if(res.data.doc){
      this.setState({
        query:'',
        locations:[...this.state.locations,res.data.doc],
        currentLocation:res.data.doc,
        currentLat:res.data.doc.coord.lat,
        currentLon:res.data.doc.coord.lon
      },()=>console.log(this.state))}
    })
  };

  search = (event) => {
    if (event.key === "Enter") {
      this.setState({ suggestions: [] }, () => {
        this.fetching({name:this.state.query});
        this.setState({query:''});
      });
    }
  };

  onTextChange = (event) => {
    const value = event.target.value;
    let suggestions = [];
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, "i");
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
        this.fetching({name:value});
        // this.setItem();
      }
    );
  };

  handleOnClickSuggestion = (item) => {
    console.log("li tag was clicked");
  };

  renderSuggestions = () => {
    let { suggestions } = this.state;
    if (suggestions.length === 0) return null;

    return (
      <ul className="search-box__suggestions">
        {suggestions.map((item, index) => {
          return (
            <li
              key={index}
              onClick={() => this.handleOnClickSuggestion(item)}
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
    axios.delete(`${api}/location/${id}`).then(res=>{
      if(res.data.message){
      let newLocations = [...this.state.locations];
      const deleteLocation=newLocations.find(l=>l._id===id)
      newLocations.splice(newLocations.indexOf(deleteLocation), 1);

      this.setState({ locations: newLocations },()=>console.log(this.state));}
    })
  };

  changeCurrentLocation = (element, id) => {
    console.log(id);
    axios.put(`${api}/location/${id}`).then(res=>{
      if(res.data.message){
        console.log("successful")
        const newCurrentLocation=this.state.locations.find(l=>l._id===id)
        this.setState({
          currentLocation:newCurrentLocation,
          currentLat:newCurrentLocation.coord.lat,
          currentLon:newCurrentLocation.coord.lon
        }, ()=>console.log(this.state))
    }

    })
    }
  

  addToFavorites = (element, id) => {
    console.log(id);
    axios.put(`${api}/favorite/${id}`).then(res=>{
      if(res.data.message){

      const newFavorites = this.state.favorites;
      newFavorites.push(id);
      this.setState({ favorites:newFavorites},()=>console.log(this.state));}
    })
  };

  removeFavorite = (element, id) => {
    axios.put(`${api}/favorite/${id}`).then(res=>{
      if(res.data.message){
      const newFavorites=this.state.favorites;
      const index = newFavorites.indexOf(id);
      newFavorites.splice(index, 1);

      this.setState({ favorites: newFavorites },()=>console.log(this.state));}
    })
  };

  renderLocations = () => {
    if (this.state.locations.length > 1) {
      return (
        <div className="location-container">
          {this.state.locations.map((location) => {
            //  console.log(location)
            if(location._id===this.state.currentLocation._id) return
            if (location)
              return (
                <Location
                  location={location}
                  favorites={this.state.favorites}
                  id={location._id}
                  key={location.name}
                  deleteLocation={(element, id) =>
                    this.deleteLocation(element, id)
                  }
                  addToFavorites={(element, id) =>
                    this.addToFavorites(element, id)
                  }
                  removeFavorite={(element, id) =>
                    this.removeFavorite(element, id)
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
            <CurrentLocation
              currentLocation={this.state.currentLocation}
            />
          ) : null}
          {this.state.locations.length > 1 ? this.renderLocations() : null}
          {/* <FavoriteList/> */}
        </main>
      </div>
    );
  }
}
