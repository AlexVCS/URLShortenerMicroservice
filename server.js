require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = express.Router();
const dns = require('dns');
// const { isDataView } = require('util/types');
const app = express();
const { Schema } = mongoose;
const myURI = process.env['MONGO_URI'];
const db = mongoose.connection;

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

mongoose.connect(myURI,
  {
    useNewUrlParser: true,
    // useFindAndModify: false,
    useUnifiedTopology: true
  }
)

const urlSchema = new Schema({
  originalURL: String,
  short_url: Number
})

const Url = mongoose.model('Url', urlSchema)

// const createAndSaveURLInfo = function(done) {
//   const urlOne = new Url({originalURL: "https://linkedin.com/", short_url: 764})}

//   data.save(function(err, urlOne) {
//     if (err) return console.log(err);
//     done(null, urlOne)
//   })

let urlCode = Math.floor(1000 + Math.random() * 9000)

app.post('/api/shorturl', function(req, res) {
  const originalURL = req.body.url
  res.json({
      "original_url": originalURL,
      "short_url": urlCode
    })
})

// app.get(`/api/shorturl/${urlCode}`, function(req, res) {
//   res.redirect(301, )
// })

// dns.lookup('req.body.url', (err, req, value) => {
//   if(err) {
//     console.log(err);
//     return
//   } else {
//     data.save()
//   }
// })

// First API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
