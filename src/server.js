var http = require('http');
var url = require('url');
var querystring = require('querystring');

if (!process.env.CONNECT_TYPE) {
  console.error('No CONNECT_TYPE environment variable set defaulting to ZEPPELIN')
}

const CONNECT_TYPE = process.env.CONNECT_TYPE || 'ZEPPELIN';
console.log(`CONNECT_TYPE: ${CONNECT_TYPE}`);

http.createServer(function (req, res) {
  if (req.url === '/status' || req.url === '/favicon.ico'){
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
  var headers = { 'Location': '/' };
  var query = url.parse(req.url, true).query;

  if (CONNECT_TYPE === 'ZEPPELIN') {
    setZeppelinHeaders(headers, query);
  } else if (CONNECT_TYPE === 'RSTUDIO') {
    setRStduioHeaders(headers, query);
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

/**
 * Funtion to set the Zeppelin cookie - JSESSIONID
 * The value is retrieved from the token query string parameter
 */
function setZeppelinHeaders(headers, query) {
  if (query.token) {
    headers['Set-Cookie'] = 'JSESSIONID=' + query.token + '; Path=/; HttpOnly';
  }
}

/**
 * Set the two RStudio cookies - user-id and csrf-token
 * The structure of the user-id cookie is rstudio|<exipry_date>|<token> where the last two values are
 * url encoded. The values are retrieved from the expires and token query string parameters.
 * Note that the 'Set-Cookie' header is an array of cookies.
 */
function setRStduioHeaders(headers, query) {
  const cookies = [];
  if (query.expires && query.token) {
    var cookie = `rstudio|${querystring.escape(query.expires)}|${querystring.escape(query.token)}`;
    cookies.push('user-id=' + cookie + '; Path=/; HttpOnly');
  }

  if (query.csrfToken) {
    cookies.push('csrf-token=' + query.csrfToken + '; Path=/');
  }
  headers['Set-Cookie'] = cookies;
}
