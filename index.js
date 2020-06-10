const HTTP = require('http');
const EXPRESS = require('express');
const PORT = 5000;

const APP = EXPRESS();
const SERVER = HTTP.createServer(APP);

let player_list = [];
let id_list = new Set();

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

.get("/adv", (req, res) => {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.sendFile(__dirname + '/views/advertise.html');
})

.use((req, res) => {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.status(404).sendFile(__dirname + '/views/404.html');
});

// GAME
//socket io
var io = require('socket.io').listen(SERVER);

// Quand un joueur se connect, initiation joueur
io.sockets.on('connection',(socket) => {
    let id = generateRandom();
    let player_param = {
        "id":id,
        "posx":100,
        "posy":450,
        "velx":0,
        "vely":0,
        "anim":"right"
    };

    player_list.push(player_param);

    socket.id = id;
    socket.emit('player_list', JSON.stringify(player_list));
    socket.emit('id',socket.id);

    //update new player
    socket.broadcast.emit('new_player',JSON.stringify(player_param));

    //update disconnect
    socket.on('disconnect',()=>{
        id_list.delete(socket.id);
        for(el in player_list){
            if(player_list[el].id == socket.id){
                player_list.splice(el,1);
                socket.broadcast.emit('remove_player',socket.id);
            }
        }
        //socket.broadcast.emit('remove_player',JSON.stringify(player_list));
    });

    //Mouvement update
    socket.on('playerMove',(data)=>{
        socket.broadcast.emit('updatePlayerMove',data);
    });
});



//generate id
let generateRandom = ()=>{
    let id = Math.floor(Math.random() * 1000);
    if(id_list.has(id)){
        generateRandom();
    }else{
        id_list.add(id);
        return id;
    }
}
