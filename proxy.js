const cors = require('cors');
const express = require('express');
const request = require('request');

const app = express();
app.use(cors());

const rssUrl = 'https://www.wired.com/feed/';

app.get('/rss', (req, res) => {
  request(rssUrl).pipe(res);
});

app.listen(3000, () => {
  console.log('Proxy server listening on port 3000');
});
