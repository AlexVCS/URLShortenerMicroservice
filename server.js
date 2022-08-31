require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = express.Router();
const dns = require("dns");
const app = express();
const { Schema } = mongoose;
const myURI = process.env["MONGO_URI"];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/public", express.static(`${process.cwd()}/public`));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

mongoose.connect(`${myURI}`);

const urlSchema = new mongoose.Schema({
  original_url: String,
  short_url: Number,
});

const Url = mongoose.model("Url", urlSchema);

app.post("/api/shorturl", async function (req, res) {
  const inputUrl = req.body.url;
  const urlRegex = new RegExp(/^https?:\/\//);
  const options = {
    host: req.body.url,
  };
  dns.lookup(inputUrl, options, async (error) => {
    // console.log("this is the error: ", error);
    if (urlRegex.test(inputUrl)) {
      // console.log("hi I am running");
      const totalCount = await Url.count();
      let urlCode = totalCount + 1;
      const newRedirect = new Url({
        original_url: inputUrl,
        short_url: urlCode,
      });
      const { original_url, short_url } = await newRedirect.save();
      res.json({ original_url, short_url });
    } else {
      res.json({
        error: "Invalid URL",
      });
    }
  });
});

app.get("/api/shorturl/:short_url", cors(), function (req, res) {
  const query = parseInt(req.params.short_url);

  Url.findOne(
    {
      short_url: query,
    },
    function (err, redirectObj) {
      if (err) throw err;
      if (redirectObj) {
        res.redirect(redirectObj.original_url);
      } else {
        console.log(redirectObj);
        res.send(
          JSON.stringify({
            error: "Invalid URL",
          })
        );
      }
    }
  );
});

// First API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
