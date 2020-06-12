const HTTP = require('http');
const EXPRESS = require('express');
const fs = require('fs');
const PORT = 3000;
const top10 = "./public/ressources/top10.json";



const url = process.env.MONGODB_URI;

const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;

function addToMongo(myobj) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("heroku_j058vh5r");
        dbo.collection("score").find({ pseudo: myobj.pseudo }).toArray(function (err, result) {
            if (err) throw err;
            if (!result[0]) {
                dbo.collection("score").insertOne(myobj, function (err, res) {
                    if (err) throw err;
                    console.log("1 document inserted");
                    db.close();
                });
            } else {
                if (result[0].time > myobj.time) {
                    //update
                    var myquery = { pseudo: myobj.pseudo };
                    var newvalues = { $set: { time: myobj.time } };
                    dbo.collection("score").updateOne(myquery, newvalues, function (err, res) {
                        if (err) throw err;
                        console.log("1 document updated");
                        db.close();
                    });
                }
            }
            db.close();
        });
    });
}

//1 find pseudo
//-> si pas on add
//-> si présent on check le time et on update en fonction






const APP = EXPRESS();
const SERVER = HTTP.createServer(APP);

let player_list = [];
let id_list = new Set();

// RUNNING
SERVER.listen(process.env.PORT || PORT, () => {
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

    .get("/leaderboard", (req, res) => {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.sendFile(__dirname + '/views/leaderboard.html');
    })

    .get("/com", (req, res) => {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.sendFile(__dirname + '/views/communication.html');
    })

    .use((req, res) => {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.status(404).sendFile(__dirname + '/views/404.html');
    });

// GAME
//socket io
let io = require('socket.io').listen(SERVER);

// Quand un joueur se connect, initiation joueur
io.sockets.on('connection', (socket) => {
    let id = generateRandom();
    let player_param = {
        "id": id,
        "posx": 100,
        "posy": 450,
        "velx": 0,
        "vely": 0,
        "anim": "right",
        "pseudo": "SpaceMan" + id,
        "skin": 1
    };

    player_list.push(player_param);

    socket.id = id;
    socket.emit('player_list', JSON.stringify(player_list));
    socket.emit('id', socket.id);

    //update new player
    socket.broadcast.emit('new_player', JSON.stringify(player_param));

    //update disconnect
    socket.on('disconnect', () => {
        id_list.delete(socket.id);
        for (el in player_list) {
            if (player_list[el].id == socket.id) {
                player_list.splice(el, 1);
                socket.broadcast.emit('remove_player', socket.id);
            }
        }
        //socket.broadcast.emit('remove_player',JSON.stringify(player_list));
    });

    //Mouvement update
    socket.on('playerMove', (data) => {
        for (el in player_list) {
            if (data[4] == player_list[el].id) {
                data.push(player_list[el].pseudo);
                break;
            }
        }
        data = JSON.stringify(data);
        socket.broadcast.emit('updatePlayerMove', data);
    });

    socket.on('pseudoSet', (pseudo) => {
        let data = JSON.parse(pseudo);
        for (el in player_list) {
            if (data[1] == player_list[el].id) {
                player_list[el].pseudo = data[0];
                break;
            }
        }
        socket.broadcast.emit('updatePseudo', pseudo);
    });

    socket.on('score', (score) => {/* 
        let mylist=readTopToList(top10);
        let newlist=checkAndAddToTop10(mylist,score);
        writeListToTop(top10,newlist); */
        addToMongo(score);
        socket.broadcast.emit("newScore", score);
    });

    // CHAT

    socket.on('newPseudo', (pseudo) => {
        socket.pseudo = pseudo.trim();
        console.log("Last user is know as " + socket.pseudo);
    });

    socket.on('messageToServer', (message) => {
        console.log(socket.pseudo + " send a message : " + message);
        socket.emit('messageToAll', { author: "You", text: message });
        socket.broadcast.emit('messageToAll', { author: socket.pseudo, text: message });
    });
    socket.on('leaderbord', () => {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("heroku_j058vh5r");
            let mysort = { time: 1 };
            dbo.collection("score").find().sort(mysort).toArray(function (err, result) {
                if (err) throw err;
                console.log(JSON.stringify(result));
                db.close();
                socket.emit('sentscore', result);

            });
        });
    });
});

// Functions


function checkAndAddToTop10(listTop, Contender) {//takes a list of object and the contender as object
    let added = false;
    for (el in listTop) {
        if (listTop[el].time >= Contender.time) {
            listTop.splice(el, 0, Contender);
            added = true;
            break
        }
        //returns new top based on time in ms as a list of objects
    }
    if (listTop.length < 100 && !added) {
        listTop.push(Contender);
    } else if (listTop.length > 100) {
        listTop = listTop.slice(0, 100);
    }
    return listTop.sort((a, b) => (a.time > b.time) ? 1 : -1);
}
function writeListToTop(filepath, listTop) {
    let obj = {
        "top": listTop
    }
    let json = JSON.stringify(obj)
    fs.writeFile(filepath, json, function (err) {
        if (err) throw err;
        console.log('Updating leaderboard');
    });
}

function readTopToList(filepath) {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'))["top"]
}



let test = {
    "pseudo": "newratpi2",
    time: 97011
}



//generate id
let generateRandom = () => {
    let id = Math.floor(Math.random() * 1000);
    if (id_list.has(id)) {
        generateRandom();
    } else {
        id_list.add(id);
        return id;
    }
}
