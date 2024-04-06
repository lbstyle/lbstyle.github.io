var http = require('http');
var fs = require('fs');
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var config_json = `{
  "accounts_endpoint": "/accounts.json",
  "client_metadata_endpoint": "/metadata.json",
  "id_assertion_endpoint": "/tokens.json",
  "revocation_endpoint": "/revocation.html",
  "login_url": "/login.html"
}`;

var accounts_json = `{
  "accounts": [{
    "id": "1234",
    "given_name": "AAA",
    "name": "AAA BBB",
    "email": "test@idp.example",
    "approved_clients": ["123", "456", "789"]
   }
  ]
}`;

var reauth = false;
var signal = false;
http.createServer(async function (req, res) {
  var url = req.url;
  if (url == "/favicon.ico" || url == "/") {
    res.end();
  }
  else if (url == "/signal") {
    signal = true;
    res.writeHead(200);
    res.end('');
  }
  else if (url == "/.well-known/web-identity") {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end('{"provider_urls": ["http://localhost:8000/config.json"]}');
  }
  else if (url == "/config.json") {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(config_json);
  }
  else if (url == "/accounts.json") {
    if (reauth) {
      while(!signal) {
        await sleep(500);
      }
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(accounts_json);
  }
  else if (url == "/tokens.json") {
    reauth = true;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end('{"token" : "123456789"}');
  }
  else {
    fs.readFile(url.slice(1), async function (err, data) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(data);
      res.end();
    });
  }
}).listen(8000, "127.0.0.1");

http.createServer(async function (req, res) {
  var url = req.url;
  if (url == "/favicon.ico" || url == "/") {
    res.end();
  }
  else if (url == "/.well-known/web-identity") {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end('{"provider_urls": ["http://localhost:8001/config.json"]}');
  }
  else if (url == "/config.json") {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(config_json);
  }
  else if (url == "/accounts.json") {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(accounts_json);
  }
  else if (url == "/tokens.json") {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end('{"token" : "123456789"}');
  }
  else {
    fs.readFile(url.slice(1), async function (err, data) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(data);
      res.end();
    });
  }
}).listen(8001, "127.0.0.1");
console.log("server started");