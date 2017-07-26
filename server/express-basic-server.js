var express = require('express');
var fs = require('fs');
var app = express();

var result = {results: []};

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};
defaultCorsHeaders['Content-Type'] = 'application/json';


// Init of the result array using messages recorded inside txt file
fs.readFile('data.txt', function(err, data) {
  var str = '';
  str += data;  
  var arr = str.split('\n');
  for (var i = 0; i < arr.length - 1; i++) {
    result.results.push(JSON.parse(arr[i]));
  }
});


// This responds a POST request for the homepage
app.post('/classes/messages', function (req, res) {
  console.log('Got a POST request for /classes/messages');

  var message = {};
  var messArr = [];
  var randomNbr;
  var body = '';

  req.on('data', function(data) {
    body += data;

    fs.appendFile('data.txt', body + '\n', function (err) {
      if (err) {
        throw err;
      }
      console.log('Saved!');
    });

    message = JSON.parse(body);

    randomNbr = Math.round(Math.random() * 10000);
    message.objectId = randomNbr.toString();

    result.results.push(message);
  });

  res.writeHead(201, defaultCorsHeaders);
  res.end(JSON.stringify(result));
});

// This responds a GET request for the /list_user page.
app.get('/classes/messages', function (req, res) {
  console.log('Got a GET request for /classes/messages');

  res.writeHead(200, defaultCorsHeaders);  
  res.end(JSON.stringify(result));
});


app.options('/classes/messages', function(req, res, next) {
  res.header(defaultCorsHeaders);
  res.send(200);
});

var server = app.listen(3000, function () {
  var host = '127.0.0.1'; //server.address().address;
  var port = '3000';//server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});

//http://127.0.0.1:3000/