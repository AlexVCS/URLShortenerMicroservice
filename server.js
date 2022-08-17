require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = express.Router();
const dns = require('dns');
const { url } = require('inspector');
const { doesNotMatch } = require('assert');
const app = express();
const { Schema } = mongoose;
const myURI = process.env['MONGO_URI'];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

mongoose.connect(`${myURI}`, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
  console.log('connected to database')
});
    
const urlSchema = new Schema({
  originalURL: String,
  short_url: Number
})

const UrlModel = mongoose.model('Url', urlSchema)

let urlCode = Math.floor(Math.random() * 10)

app.post('/api/shorturl', function (req, res) {
  res.json({
      "original_url": req.body.url,
      "short_url": urlCode
    })
})

// app.get(`/api/shorturl/${urlCode}`, function(req, res) {
//   res.redirect(req.body.url)
// })

// dns.lookup('req.body.url', (err, data) => {
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
