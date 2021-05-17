const http = require('http');
const url = require('url');
const querystring = require('querystring');

const CONNECT_TYPE = getConnectType();

http.createServer((req, res) => {
  if (req.url === '/status' || req.url === '/favicon.ico') {
    status(req, res);
  } else {
    processCookie(req, res);
  }
}).listen(8000);

function status(req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'OK' }));
}

function processCookie(req, res) {
  console.log(`Request URL: ${req.url}`);
  const headers = { Location: '/' };
  const { query } = url.parse(req.url, true);

  if (CONNECT_TYPE === 'ZEPPELIN') {
    setZeppelinHeaders(headers, query);
  } else if (CONNECT_TYPE === 'RSTUDIO') {
    setRStduioHeaders(headers, query);
  }

  if (query.noredirect) {
    res.writeHead(200, headers);
  } else {
    res.writeHead(302, headers);
  }
  res.end(JSON.stringify(query));
}

function getConnectType() {
  const CONNECT_TYPES = ['ZEPPELIN', 'RSTUDIO'];

  let connectType = 'ZEPPELIN';
  if (!process.env.CONNECT_TYPE) {
    console.error('No CONNECT_TYPE environment variable set defaulting to ZEPPELIN');
  } else if (CONNECT_TYPES.includes(process.env.CONNECT_TYPE)) {
    connectType = process.env.CONNECT_TYPE;
  } else {
    console.error(`Unknown CONNECT_TYPE: ${process.env.CONNECT_TYPE} defaulting to ZEPPELIN`);
  }

  console.log(`CONNECT_TYPE: ${connectType}`);
  return connectType;
}

/**
 * Funtion to set the Zeppelin cookie - JSESSIONID
 * The value is retrieved from the token query string parameter
 */
function setZeppelinHeaders(headers, query) {
  if (query.token) {
    headers['Set-Cookie'] = `JSESSIONID=${query.token}; Path=/; HttpOnly`;
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
  if (query.username && query.expires && query.token) {
    const cookie = `${query.username}|${querystring.escape(query.expires)}|${querystring.escape(query.token)}`;
    cookies.push(`user-id=${cookie}; Path=/; HttpOnly`);
  }

  if (query.csrfToken) {
    cookies.push(`csrf-token=${query.csrfToken}; Path=/`);
  }
  headers['Set-Cookie'] = cookies;
}

module.exports = { status, getConnectType, setZeppelinHeaders, setRStduioHeaders, processCookie };
