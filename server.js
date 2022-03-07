require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = express.Router();
const dns = require('dns');
const app = express();


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', function(req, res) {
  const originalURL = req.body.url
  res.json({
    "original_url": originalURL,
    "short_url": Math.floor(1000 + Math.random() * 9000)
  })
})

// dns.lookup('req.body.url', (err, req, value) => {
//   if(err) {
//     console.log(err);
//     return
//   }
//   console.log(value);
// })

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
