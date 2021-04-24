import React from "react";
import axios from "axios";

import Button from "@material-ui/core/Button";
import { FaHeart } from "react-icons/fa";

const api = "http://localhost:5000";

class FavoriteList extends React.Component {
  state = {
    listButton: false,
    favorites: [],
  };

  getFavorites() {
    axios.get(`${api}/favorite`).then((res) => {
      this.setState({ favorites: res.data }, () => console.log(this.state));
    });
  }

  renderedFavoriteList() {
    return (
      <div>
        <div className="favorite-list__wrapper">
          <button
            className="button favorite-list__close"
            onClick={() => this.setState({ listButton: false })}
          >
            x
          </button>
          {this.state.favorites.length > 0 ? (
            this.state.favorites.map((l) => {
              return <div className="favorite-list__item">{l.name}</div>;
            })
          ) : (
            <p className="favorite-list__no-city">
              No city has added to Favorite list yet!
            </p>
          )}
        </div>
        <div class="overlay"></div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <button
          className="button button--favorite-list"
          onClick={() =>
            this.setState({ listButton: true }, () => this.getFavorites())
          }
        >
          <FaHeart className="favorite-list-icon" />
        </button>
        {this.state.listButton ? this.renderedFavoriteList() : null}
      </div>
    );
  }
}

export default FavoriteList;
