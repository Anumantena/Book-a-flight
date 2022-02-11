const express = require("express");
const bodyParser = require("body-parser");
const NodeCache = require("node-cache");
const axios = require("axios");
const app = express();
var cors = require("cors");

const port = 3000;

app.use(cors());

const myCache = new NodeCache();

//Here we are configuring express to use body-parser as middle-ware.
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.get("/flights/:flightName", async (req, res) => {
  try {
    const flightName = req.params.flightName;

    // Check the node-cache store for the data first
    flight = myCache.get("myKey");

    // client.get(flightName, async (err, flight) => {
    // console.log("findBy>>>", typeof flight);
    if (!!flight) {
    //   console.log("step1");
      const allFlights = JSON.parse(flight);

    //   console.log("single flight>>", { allFlights });
      const responseFlights = allFlights.list.filter((flight) => {
        return flight.name.toLowerCase().indexOf(flightName.toLowerCase()) !== -1        
      });
      return res.status(200).send(responseFlights);
    } else {
      console.log("step2");
      return res.status(404).send();
    }
    // });
  } catch (error) {
    console.log("Error>>", error);
  }
});

app.post("/flights/saveAll", cors(), (req, res) => {
//   console.log("saveAll", req.body);
  myCache.set("myKey", JSON.stringify(req.body), 60000);
  return res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
