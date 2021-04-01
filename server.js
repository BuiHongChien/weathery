const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
require("dotenv").config;
const Bluebird = require("bluebird");

const minsc = require("./utils/minsc");

fetch.Promise = Bluebird;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('www')); 

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/online-test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Modules
const { Location } = require("./models/Location");

//API
const api = {
  key: "27bc22d487c2a65e234d4e0b38ed147f",
  base: "https://api.openweathermap.org/data/2.5",
};

//========================
//       Locations
//========================

// @route GET /location
// @desc get all locations
// @access public
app.get("/location", async (req, res) => {
  try {
    Location.find().exec((err, doc) => {
      if (err) return res.status(400).send(err);
      res.status(200).send(doc);
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server locations error");
  }
});

// @route POST /location
// @desc post a new location
// @access public
app.post("/location", (req, res) => {
  const pos = req.body;

    let url =
      pos.lat
        ? `${api.base}/weather?lat=${pos.lat}&lon=${pos.lon}&appid=${api.key}`
        : `${api.base}/weather?q=${pos.name}&appid=${api.key}`;
    // console.log(url);

  try {
    fetch(url)
      .then((res) => {
        if (res.status === 200) return res.json();
        return res.json({error: res.statusText})
      })
      .then(async (result) => {
        if(result.cod !== 200) return res.json(result)

        const isExists=await Location.exists({name: result.name})

        if(!isExists){
          result.isCurrentLocation=true;
          result.isFavorite=false

          Location.update({isCurrentLocation:true}, {isCurrentLocation:false}, (err,doc)=>{
            console.log(doc)
          })

          const location = new Location(result);
            location.save((err, doc) => {
              if (err) return res.json({ success: false, err });
              res.status(200).json({ success: true, doc });
            });
        }
        else return res.json({ message:'City exists'});
      });
  } catch (err) {
    console.error(err.message);
  }
});

// @route PUT /location/:id
// @desc change current location
// @access public
app.put('/location/:id', (req,res)=>{
  try{
    Location.update({isCurrentLocation:true}, {isCurrentLocation:false}, (err,doc)=>{
      console.log(doc)
    })
    Location.update({_id:req.params.id}, {isCurrentLocation:true}, (err,doc)=>{
      return res.json({doc})
    })
  }catch(err){
    console.error(err.message)
  }
})

// @route DELETE /location/:id
// @desc delete location
// @access public
app.delete("/location/:id", async (req, res) => {
  try {
    await Location.findByIdAndDelete(req.params.id);
    res.json({ message: "Location was deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//========================
//       Favorite
//========================

// @route GET /favorite
// @desc get list of favorite locations
// @access public
app.get("/favorite", async (req, res) => {
  try {
    Location.find({isFavorite:true}).exec((err, doc) => {
      if (err) return res.status(400).send(err);
      res.status(200).send(doc);
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server favorite error");
  }
});

// @route PUT /favorite/:id
// @desc remove or add favorite flag of location with _id=id
// @access public
app.put("/favorite/:id", async (req, res) => {
  try {
    await Location.findById(req.params.id).exec((err, doc)=>{
      Location.findByIdAndUpdate(doc.id, {isFavorite:!doc.isFavorite}, {new:true}, (err, doc)=>{
        res.json({err, doc})
      })
    })
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running at ${port}`));
