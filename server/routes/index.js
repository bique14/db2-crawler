var express = require("express");
var router = express.Router();

var MongoClient = require("mongodb").MongoClient;

var conn = MongoClient.connect(
  "mongodb://localhost:27017/science_direct",
  async function(err, client) {
    if (err) {
      console.error(err);
    }
    console.log("connection success!!");

    const data = client.db("science_direct"); // once connected, assign the connection to the global variable
    router.get("/", function(req, res, next) {
      data
        .collection("crawler")
        .find()
        .toArray(function(err, result) {
          res.send(result);
        });
    });

    router.post("/filter", async function(req, res, next) {
      // author {name : "" , email : "" , count : 11,affiliation: ""}
      // country {name : "", count : 111}
      const { keyword } = req.body;

      const arrCountry = [];
      data.collection("crawler").find({}, (err, data) => {});
      const dataFilter = new Promise((resolve, reject) => {
        data
          .collection("crawler")
          .find()
          .toArray(function(err, result) {
            if (err) reject(err);
            resolve(result);
          });
      });

      // brunch of json from input keyword
      const arr = [];
      await dataFilter.then(resolve => {
        resolve.forEach(element => {
          element.keyword.forEach(key => {
            if (key.toLowerCase().includes(keyword.toLowerCase()))
              arr.push(element);
          });
        });
      });

      // counting countries
      const countriesJson = {};
      arr.forEach(({ country, title }) => {
        if (country != "Cannot get country") {
          if (countriesJson[country]) {
            countriesJson[country]["count"]++;
          } else {
            countriesJson[country] = {
              count: 1,
              name: country
            };
          }
        }
      });

      //format key-value to array of json
      const countriesArray = [];
      const keys = Object.keys(countriesJson);
      for (const index in keys) {
        const key = keys[index];
        const { name, count } = countriesJson[key];
        countriesArray.push({
          name,
          count
        });
      }

      //counting author
      const authorsJson = {};
      arr.forEach(({ author: authors, affi: affiliation }) => {
        if (authors) {
          authors.forEach(({ name, email }) => {
            if (!authorsJson[name]) {
              authorsJson[name] = {
                count: 1,
                email,
                name,
                affiliation
              };
            } else {
              authorsJson[name]["count"]++;
            }
          });
        }
      });

      //format authos json to array
      const authorsArray = [];
      Object.keys(authorsJson).forEach(key => {
        const { name, email, count, affiliation } = authorsJson[key];
        authorsArray.push({ name, email, count, affiliation });
      });

      Math.max.apply(
        Math,
        authorsArray.map(function(o) {
          return o.count;
        })
      );
      Math.max.apply(
        Math,
        countriesArray.map(function(o) {
          return o.count;
        })
      );

      res.send({ authors: authorsArray, countries: countriesArray });
    });
  }
);

module.exports = router;
