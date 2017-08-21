var http = require('http');
var url = require('url');

http.createServer(function (req, res) {
  if (req.url === '/status'){
    status(req, res);
  } else {
    processCookie(req, res);
  }
}).listen(8000);

function status(req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({ message: 'OK' }));
}

function processCookie(req, res) {
  console.log('Request URL: ' + req.url);
  var headers = {
    'Location': '/'
  };
  var query = url.parse(req.url, true).query;

  if (query.token) {
    headers['Set-Cookie'] = 'JSESSIONID=' + query.token + '; Path=/; HttpOnly';
  }

  console.log('Response Headers: ');
  console.log(headers);

  if (query.noredirect) {
    res.writeHead(200, headers);
  } else {
    res.writeHead(302, headers);
  }
  res.end(JSON.stringify(query));
}
