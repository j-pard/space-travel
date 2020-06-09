const HTTP = require('http');
const EXPRESS = require('express');
const PORT = 5000;

const APP = EXPRESS();
const SERVER = HTTP.createServer(APP);

// RUNNING
SERVER.listen(PORT, () => {
      console.log("Activating the plateform ...");
});

// PUBLIC
APP.use(EXPRESS.static('public'));

// ROUTING
APP.get("/", (req, res) => {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.sendFile(__dirname + '/views/index.html');
})

.get("/game", (req, res) => {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.sendFile(__dirname + '/views/game.html');
})

.use((req, res) => {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.status(404).sendFile(__dirname + '/views/404.html');
});