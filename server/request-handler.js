/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var fs = require('fs');

var result = {results: []};
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};


// Init of the result array using messages recorded inside txt file
fs.readFile('data.txt', function(err, data) {
  var str = '';
  str += data;  
  var arr = str.split('\n');
  for (var i = 0; i < arr.length - 1; i++) {
    result.results.push(JSON.parse(arr[i]));
  }
});



var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.

  
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.
  var statusCode;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;
  var message = {};
  var messArr = [];
  var randomNbr;

   //request.json
  if (request.url.indexOf('classes/messages') === -1) {
    statusCode = 404;
  } else if (request.method === 'GET') {
    statusCode = 200;
  } else if (request.method === 'POST') {
    statusCode = 201;
    var body = '';
    request.on('data', function(data) {
      body += data;
      
      fs.appendFile('data.txt', body + '\n', function (err) {
        if (err) {
          throw err;
        }
        console.log('Saved!');
      });
      
      
      message = JSON.parse(body);
      // messArr = body.split('&').map(el => el.split('='));
      // for (var i = 0; i < messArr.length; i++) {
      //   message[messArr[i][0]] = messArr[i][1];
      // }
      //console.log(message);  
      // "{"username":"Gui","text":"ad","roomname":"lobby"}"

      // pick a random number objectId
      randomNbr = Math.round(Math.random() * 10000);
      message.objectId = randomNbr.toString();

      result.results.push(message);
    });
  } else if (request.method === 'OPTIONS') {
    statusCode = 200;
  } else if (request.method === 'DELETE') {
    // this function delete ONLY the last message
    result.results.pop();

    statusCode = 200;
  } else {
    statusCode = 404;
  }

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = 'application/json';//'text/plain';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  //{username: 'Jono', message: 'Do my bidding!'}
  
  response.end(JSON.stringify(result));
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
// var defaultCorsHeaders = {
//   'access-control-allow-origin': '*',
//   'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
//   'access-control-allow-headers': 'content-type, accept',
//   'access-control-max-age': 10 // Seconds.
// };

module.exports.requestHandler = requestHandler;

