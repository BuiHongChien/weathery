import React from "react";
import axios from "axios";

import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { FaHeart } from "react-icons/fa";

const api = "http://localhost:5000";

class FavoriteList extends React.Component {
  state = {
    anchorEl: null,
  };

  handleClick = (event) => {
    console.log(event);
    // this.setState({anchorEl:event?.currentTarget});
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  renderedFavoriteList = async () => {
    try {
      let res = await axios.get(`${api}/favorite`);
      let favorites = res.data;
      console.log(favorites);
    } catch (err) {
      console.error(err);
    }
    return (
      <Menu
        id="simple-menu"
        anchorEl={this.state.anchorEl}
        keepMounted
        open={Boolean(this.state.anchorEl)}
        onClose={(event) => this.handleClose()}
      >
        {/* <MenuItem onClick={handleClose}>haha</MenuItem> */}
        {/* {favorites.map(favorite=>{
              console.log(favorite)
              return(
            <MenuItem onClick={handleClose}>haha</MenuItem>)
          })} */}
      </Menu>
    );
  };

  render() {
    return (
      <div className="favorite-list">
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={(event) => this.handleClick()}
        >
          <FaHeart className="favorite-list-icon" />
        </Button>

        {this.renderedFavoriteList}
        {/* {favorites.length>0? favorites.map(favorite=>{
              <MenuItem onClick={handleClose}>Profile</MenuItem>
          }):null}
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem> */}
        {/* </Menu> */}
      </div>
    );
  }
}

export default FavoriteList;
