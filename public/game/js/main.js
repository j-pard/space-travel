//Variables du niveaux
let MAP_NAME = "earth";
let SPAWN_POINT = [210,2070];
let UP_START_ZONE = 150;
let UP_FINISH_ZONE = 600;



//Variables de jeu

let socket; 
let idClient; 
let playerList;
        

//CURRENT PLAYER AND PLAYERS LIST
let player;
let players = [];
let pseudo = "SpaceMan";
let pseudoOverPlayer;
let playersPseudoList = [];
let playerSkinChoice = 1;

let particles;

//INPUTS
let enterKey;
let restartKey;

//CONTROLS
let right = false;
let left = false;
let jump = false;

//TIMER VARIABLES
let timerText;

let isReset = false;
let isStart = false;
let isFinish = false;

let startTime = 0;
let finishTime = 0;


let startCollider;
let finishCollider;

let LiveBoard;
let titleBoard;
let scoreList = [];

let leaderBoard;
let titleLBoard;

let chat;
let chatTitle;
let isChatToggle = false;
let inputChat;
let chatList = [];

//GAME STATS
let isGameReady = false;
let isToggleTimer = false;

//INPUT PARAM  GAME START
let blackOverlay;
let inputPseudo;
let pseudoText;
let skinChoiceList = [];

//GAMEPAD


//MAP
let MAP;
let plateforms;
let tset;
let Road;
let decorsOverlay;
let decors;
let spawnPoint;

let bg1;
let bg2;
let bg3;

//Fix 144/60hz loop rate
let timeInterval = 0;
let isLowFrequence = true;
let fixLowFrequenceMultiplier = 2;

let jumpSound;

//function game

function timerStart(now){
    if(!isStart){
        startTime = now;
        isStart = true;
    }
}

function timerStop(now,timer){
    if(!isFinish){
        finishTime = now;
        isFinish = true;
        timer.setText(timerconvert((finishTime - startTime)));
        socket.emit("score",{"time":finishTime - startTime,"pseudo":pseudo,map:MAP_NAME});
    }
}

function timerconvert(Time){
    let date = new Date(Time);
    return "Timer  " + date.getMinutes() + " : "+date.getSeconds()+ " : "+date.getMilliseconds();
}

function createMainPlayer(sceneGame){
    //create main player
    if(playerSkinChoice == 9){
        player = sceneGame.physics.add.sprite(SPAWN_POINT[0],SPAWN_POINT[1], "frog");
    }else{
        player = sceneGame.physics.add.sprite(SPAWN_POINT[0],SPAWN_POINT[1], "player"+playerSkinChoice);
    }

    player.setBounce(0);
    //player.setCollideWorldBounds(true);  //body box 8/48 et décallé de 12 par rapport a la base
    player.id = idClient;
    player.setScale(0.5);
    player.body.setSize(40,80,10,25);

    const camera = sceneGame.cameras.main;
    camera.startFollow(player,true);
    camera.setBounds(0, 0, MAP.widthInPixels, MAP.heightInPixels);

    sceneGame.physics.add.collider(player, Road);
    sceneGame.physics.add.collider(player, plateforms);

    pseudoOverPlayer = sceneGame.add.text(player.x - PSEUDO_OFFSET_X ,player.y - PSEUDO_OFFSET_Y,pseudo,PSEUDO_CONFIG);
}

function createAllAnims(sceneGame,keyName,configplace,id,frameRate,repeat,sprite){
    sceneGame.anims.create({
        key: (keyName+id),
        frames: sceneGame.anims.generateFrameNumbers('player'+id,configplace),
        frameRate:frameRate,
        repeat: repeat
    });
}

function convertMilliLiveBoard(scoreReturn){
    let d = new Date(scoreReturn.time);
    let sec = (d.getSeconds()).toString();
    let mil = (d.getMilliseconds()).toString();
    if(sec.length == 1)sec = '0'+sec;
    if(mil.length == 1)mil = '00'+mil;
    if(mil.length == 2)mil = '0'+mil;
    let scoreSet = d.getMinutes()+" : "+sec+" : "+mil+ " | "+scoreReturn.pseudo;
    return scoreSet;
}

function preloadGame(scene){
    //Plugin ajout input text
            scene.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true);
            //load playerIcon
            scene.load.image('playerIcon1', './img/base4-1.png');
            scene.load.image('playerIcon2', './img/base4-2.png');
            scene.load.image('playerIcon3', './img/base4-3.png');
            scene.load.image('playerIcon4', './img/base4-4.png');
            scene.load.image('playerIcon8', './img/base4-5.png');
            scene.load.image('playerIcon7', './img/base4-6.png');
            scene.load.image('playerIcon6', './img/base4-7.png');
            scene.load.image('playerIcon5', './img/base4-8.png');
    
            //load sound
            scene.load.audio('jumpfx', './audio/jump_11.wav');
            scene.load.audio('letsgo', './audio/letsgo.mp3');
    
            //load skin
            scene.load.spritesheet('player1',PLAYERS_SKIN_PATH[0],PLAYER_FRAME_SIZE[1])
            scene.load.spritesheet('player2',PLAYERS_SKIN_PATH[1],PLAYER_FRAME_SIZE[1])
            scene.load.spritesheet('player3',PLAYERS_SKIN_PATH[2],PLAYER_FRAME_SIZE[1])
            scene.load.spritesheet('player4',PLAYERS_SKIN_PATH[3],PLAYER_FRAME_SIZE[1])
            scene.load.spritesheet('player5',PLAYERS_SKIN_PATH[4],PLAYER_FRAME_SIZE[0])
            scene.load.spritesheet('player6',PLAYERS_SKIN_PATH[5],PLAYER_FRAME_SIZE[0])
            scene.load.spritesheet('player7',PLAYERS_SKIN_PATH[6],PLAYER_FRAME_SIZE[0])
            scene.load.spritesheet('player8',PLAYERS_SKIN_PATH[7],PLAYER_FRAME_SIZE[0])
            scene.load.spritesheet('frog',PLAYERS_SKIN_PATH[8],PLAYER_FRAME_SIZE[1]);

            scene.load.spritesheet('particle','./img/particle.png', { frameWidth: 4, frameHeight: 4 });
}

function createGame(scene){
    
    socket = io.connect();
    socket.emit('room',MAP_NAME);
    socket.on('id',(pl)=>{
    idClient = parseInt(pl.id);
    playerList = JSON.parse(pl.plist);
    for(let i = 0; i < playerList.length;i++){
        if(playerList[i].id != idClient & playerList[i].map == MAP_NAME){
            let p = scene.physics.add.sprite(SPAWN_POINT[0],SPAWN_POINT[1],'player'+playerList[i].skin);
            //p.setCollideWorldBounds(true);
            p.setBounce(0);
            p.id = playerList[i].id;
            p.setScale(0.5);
            scene.physics.add.collider(p,Road);
            scene.physics.add.collider(p,plateforms);
            players.push(p);

            let text = scene.add.text(p.x - PSEUDO_OFFSET_X,p.y - PSEUDO_OFFSET_Y,playerList[i].pseudo,PSEUDO_CONFIG);
            text.id = playerList[i].id;
            playersPseudoList.push(text);
        }
    }
});
    //RENDER FPS
scene.physics.world.setFPS(RENDER_FPS);

//GAMEPAD
    socket.emit('debug',"debug");


//MUSIC / FX

let soundback = scene.sound.add('backmusic', {
    volume: 0.1,
    loop: true,
});
soundback.play();

jumpSound = scene.sound.add('jumpfx', {volume: 0.1});

//Overlay
blackOverlay = scene.add.text(0,0,"",{
    backgroundColor: "#000000dd",
    fixedWidth:GAME_WIDTH,
    fixedHeight: GAME_HEIGHT
});
//imput player pseudo - skin
pseudoText = scene.add.text(GAME_WIDTH/2 - 170,GAME_HEIGHT/2 - 100, "Choisis ton pseudo!",{
    font: "30px monospace",
    fill: "#ffffff",
    padding: { x: 20, y: 10 },
    backgroundColor: "#00000050"
}).setScrollFactor(0);

inputPseudo = scene.add.rexInputText(GAME_WIDTH/2, GAME_HEIGHT/2, 200, 50, PSEUDO_INPUT).setScrollFactor(0);

//create 8 choices skin
for(let i = 0; i < 8; i++){
    let choice = scene.add.image(180 + (i*120),450,("playerIcon"+(i+1))).setScrollFactor(0);
    choice.setInteractive();
    choice.tint= 0x555555;
    if(i == 0)choice.tint = 0xffffff;
    choice.input.enabled = true;
    choice.on('clicked',(choice)=>{
        playerSkinChoice = (i+1);
        for(let el = 0; el < skinChoiceList.length; el++){
            skinChoiceList[el].tint = 0x555555;
        }
        choice.tint= 0xffffff;
    },scene);
    skinChoiceList.push(choice);
}
scene.input.on('gameobjectup', function (pointer, gameObject)
{
    if(!isGameReady){
        gameObject.emit('clicked', gameObject);
    }
}, scene);

//create animations
for(let i = 1; i <= 4; i++){
    createAllAnims(scene,'left',{ start: 10, end: 19 },i,15,-1,"player");
    createAllAnims(scene,'right',{ start: 0, end: 9 },i,15,-1,"player");
    createAllAnims(scene,'jumpleft',{ start: 20, end: 25 },i,10,0,"player");
    createAllAnims(scene,'jumpright',{ start: 26, end: 31 },i,10,0,"player");
    createAllAnims(scene,'stand',{ start: 32, end: 34 },i,5,-1,"player");
}
for(let i = 5; i <= 8; i++){
    createAllAnims(scene,'left',{ start: 8, end: 15 },i,15,-1,"player");
    createAllAnims(scene,'right',{ start: 0, end: 7 },i,15,-1,"player");
    createAllAnims(scene,'jumpleft',{ start: 16, end: 19 },i,10,0,"player");
    createAllAnims(scene,'jumpright',{ start: 20, end: 23 },i,10,0,"player");
    createAllAnims(scene,'stand',{ start: 24, end: 27 },i,5,-1,"player");
}
scene.anims.create({
    key: 'left9',
    frames: scene.anims.generateFrameNumbers('frog', { start: 0, end: 15 }),
    frameRate: 15,
    repeat: -1
});

scene.anims.create({
    key: 'right9',
    frames: scene.anims.generateFrameNumbers('frog', { start: 16, end: 30 }),
    frameRate: 15,
    repeat: -1
});

scene.anims.create({
    key: 'jumpleft9',
    frames: scene.anims.generateFrameNumbers('frog', { start: 0, end: 15 }),
    frameRate: 15,
    repeat: -1
});

scene.anims.create({
    key: 'jumpright9',
    frames: scene.anims.generateFrameNumbers('frog', { start: 16, end: 30 }),
    frameRate: 15,
    repeat: -1
});
scene.anims.create({
    key: 'stand9',
    frames: scene.anims.generateFrameNumbers('frog', { start: 0, end: 15 }),
    frameRate: 15,
    repeat: -1
});

particles = scene.add.particles('particle');
particles.createEmitter({
    frame:0,
    angle: { min: 240, max: 300 },
    speed: { min: 50, max: 100 },
    quantity: {min: -12,max:1},
    lifespan: 500,
    alpha: { start: 1, end: 0 },
    scale: { min: 0.05, max: 1 },
    rotate: { start: 0, end: 360, ease: 'Back.easeOut' },
    gravityY: 100,
    blendMode: 'SCREEN',
    on: false
});
particles.createEmitter({
    frame:1,
    angle: { min: 240, max: 300 },
    speed: { min: 50, max: 100 },
    quantity: {min: -12,max:1},
    lifespan: 500,
    alpha: { start: 1, end: 0 },
    scale: { min: 0.05, max: 1 },
    rotate: { start: 0, end: 360, ease: 'Back.easeOut' },
    gravityY: 100,
    blendMode: 'SCREEN',
    on: false
});
particles.createEmitter({
    frame:2,
    angle: { min: 240, max: 300 },
    speed: { min: 50, max: 100 },
    quantity: {min: -12,max:1},
    lifespan: 500,
    alpha: { start: 1, end: 0 },
    scale: { min: 0.05, max: 1 },
    rotate: { start: 0, end: 360, ease: 'Back.easeOut' },
    gravityY: 100,
    blendMode: 'SCREEN',
    on: false
});
particles.createEmitter({
    frame:3,
    angle: { min: 240, max: 300 },
    speed: { min: 50, max: 100 },
    quantity: {min: -12,max:1},
    lifespan: 500,
    alpha: { start: 1, end: 0 },
    scale: { min: 0.05, max: 1 },
    rotate: { start: 0, end: 360, ease: 'Back.easeOut' },
    gravityY: 100,
    blendMode: 'SCREEN',
    on: false
});

//keyboard
//enterKey = scene.input.keyboard.addKey('enter');
restartKey = scene.input.keyboard.addKey('f2');
//cursors = scene.input.keyboard.createCursorKeys();
scene.input.keyboard.on('keydown', (event)=>{if(event.key == "ArrowLeft")left = true;}, scene);
scene.input.keyboard.on('keyup', (event)=>{if(event.key == "ArrowLeft")left = false;}, scene);
scene.input.keyboard.on('keydown', (event)=>{if(event.key == "ArrowRight")right = true;}, scene);
scene.input.keyboard.on('keyup', (event)=>{if(event.key == "ArrowRight")right = false;}, scene);


//timer


timerText = scene.add.text(950, 550, "Timer : ", TIMER_TEXT).setScrollFactor(0);

//LiveBoard
titleBoard = scene.add.text(10,10,"Live Records",TITLE_BOARD).setScrollFactor(0);
LiveBoard = scene.add.text(10,30,"",SCORE_BOARD).setScrollFactor(0);

//leaderBoard
titleLBoard =scene.add.text(990,10,"Local Records",TITLE_BOARD).setScrollFactor(0);
leaderBoard = scene.add.text(990,30,"",SCORE_BOARD).setScrollFactor(0);

//chat
chat = scene.add.text(GAME_WIDTH/2-400,GAME_HEIGHT/2-230, "", CHAT_BOARD).setScrollFactor(0);
chatTitle = scene.add.text(GAME_WIDTH/2-400,GAME_HEIGHT/2-250, "Space Chat", CHAT_TITLE).setScrollFactor(0);
isChatToggle = false;
inputChat = scene.add.rexInputText(GAME_WIDTH/2 + 3, GAME_HEIGHT - 50, 800, 50, CHAT_INPUT).setScrollFactor(0);
chat.setVisible(false);
chatTitle.setVisible(false);
inputChat.setVisible(false);

socket.emit("leaderbord",MAP_NAME);

//update other players
socket.on('updatePlayerMove',(data)=>{
    data = JSON.parse(data);
    for(let i = 0; i<players.length;i++){
        if(players[i].id == data[4]){
            players[i].x = data[0];
            players[i].y = data[1];
            players[i].setVelocityX(data[2]);
            players[i].setVelocityY(data[3]);
            players[i].anims.play(data[5]);
        }
    }
     for(let i = 0; i < playersPseudoList.length;i++){
        if(playersPseudoList[i].id == data[4]){
            playersPseudoList[i].setText(data[6]);
            playersPseudoList[i].x = data[0] - PSEUDO_OFFSET_X;
            playersPseudoList[i].y = data[1] - PSEUDO_OFFSET_Y;
        }
    }
});
//remove a player
socket.on('remove_player',(remove_player)=>{
    for(let el = 0; el < playerList.length; el++){
        if(playerList[el].id == parseInt(remove_player)){
            playerList.splice(el,1);
        }
    }
    for(let el = 0; el < players.length;el++){
        if(players[el].id == remove_player){
            players[el].destroy();
            players.splice(el,1);
        }
    }
    for(let el = 0; el < playersPseudoList.length;el++){
        if(playersPseudoList[el].id == remove_player){
            playersPseudoList[el].destroy();
            playersPseudoList.splice(el,1);
        }
    }

});
//add a player
socket.on('new_player',(newPlayer)=>{
    let newP = JSON.parse(newPlayer);
    if(newP.id != idClient & newP.map == MAP_NAME){
        playerList.push(newP);
        let p = scene.physics.add.sprite(SPAWN_POINT[0],SPAWN_POINT[1],'player'+newP.skin);
        //p.setCollideWorldBounds(true);
        p.setBounce(0);
        p.id = newP.id;
        p.setScale(0.5);
        scene.physics.add.collider(p,Road);
        scene.physics.add.collider(p,plateforms);
        players.push(p);

        let text = scene.add.text(p.x,p.y,newP.pseudo,PSEUDO_CONFIG);
        text.id = newP.id;
        playersPseudoList.push(text);
    }
});
socket.on("newScore",(scoreReturn)=>{
    let isIn = false;
    for(let i = 0; i < scoreList.length;i++){
        if(scoreList[i].pseudo == scoreReturn.pseudo){
            if(scoreList[i].time > scoreReturn.time){
                scoreList[i].time = scoreReturn.time;
                isIn = true;
                break;
            }else{
                isIn=true;
            }
        }
    }

    if(!isIn || scoreList.length == 0)scoreList.push(scoreReturn);

    scoreList.sort((a, b) => (a.time > b.time) ? 1 : -1);
    let text = "";
    for(let i = 0; i < scoreList.length; i++){
        text += convertMilliLiveBoard(scoreList[i]) + "\n";
    }
    LiveBoard.setText(text);
});
//leaderboard update
socket.on("sentscore",(scoreLeader)=>{
    let text = "";
    for(let i = 0 ; i < scoreLeader.length;i++){
        if(i < 9)text += " "+(i+1)+".  ";
        if(i >= 9)text += (i+1)+".  ";
        text += convertMilliLiveBoard(scoreLeader[i]) + "\n";
    }
    leaderBoard.setText(text);
});
//toggle timer and leaderboard visibility
document.addEventListener('keypress',(event)=>{
    
    if(event.key == " ")jump = true;
    if(event.key == "t" & !isChatToggle){
        if(isToggleTimer){
            LiveBoard.setVisible(true);
            titleBoard.setVisible(true);
            timerText.setVisible(true);
            titleLBoard.setVisible(true);
            leaderBoard.setVisible(true);
            isToggleTimer = false;
        }else{
            timerText.setVisible(false);
            LiveBoard.setVisible(false);
            titleBoard.setVisible(false);
            titleLBoard.setVisible(false);
            leaderBoard.setVisible(false);
            isToggleTimer = true;
        }
    }
    if(event.key == "ç" & isGameReady == true){
        if(isChatToggle){
            chatTitle.setVisible(false);
            chat.setVisible(false);
            inputChat.setVisible(false);
            isChatToggle = false;
        }else{
            chatTitle.setVisible(true);
            chat.setVisible(true);
            inputChat.setVisible(true);
            isChatToggle = true;
        }
    }
    if(event.key == "Enter" & isGameReady == false){
        if(inputPseudo.text == ""){
            pseudo = "SpaceMan"+idClient;
        }else{
            pseudo = inputPseudo.text;
        }
        inputPseudo.setVisible(false);
        pseudoText.setVisible(false);
        blackOverlay.setVisible(false);
        isGameReady = true;
        if(pseudo == "maboy"){
            playerSkinChoice = 9;
        }
        for(let i = 0; i < skinChoiceList.length;i++){
            skinChoiceList[i].input.enabled = false;
            skinChoiceList[i].setVisible(false);
        }
        createMainPlayer(scene);
        socket.emit("pseudoSet",JSON.stringify([pseudo,idClient,playerSkinChoice]));
    }
    if(event.key == "Enter" & isChatToggle){
        socket.emit("chatToSend",{pseudo:pseudo,message:inputChat.text});
        inputChat.text = "";
    }
});
document.addEventListener('keyup', (event) => {
    if(event.key == " ")jump = false;
});
socket.on('sendToChat',(message)=>{
    let text = message.pseudo+" | "+message.message + "\n";
    if(chatList.length >= 24)chatList.splice(0,1);
    chatList.push(text);
    let chattext = "";
    for(el of chatList){
        chattext += el;
    }
    chat.setText(chattext);
});
}

function updateGame(scene){
    //6-7 144hz
        //16 60hz 
        isLowFrequence = ((scene.time.now - timeInterval) > 12) ? true : false;
        timeInterval = scene.time.now;
        fixLowFrequenceMultiplier = isLowFrequence ? (144/60) : 1;

        //GAMEPAD

    let pad = Phaser.Input.Gamepad.Gamepad;

    if (scene.input.gamepad.total){
            pad = scene.input.gamepad.getPad(0);
    }


    //GAME STATUS
    if(isGameReady){
        //CURRENT PLAYER VELOCITY X
        if ((pad.left || left)& player.body.velocity.x >= -VELOCITY_X_MAX_SPEED & !isChatToggle) {
            //left
            if(player.body.velocity.y == 0){
                player.anims.play('left'+playerSkinChoice, true);
            }
            if(player.body.blocked.down){
                particles.emitParticleAt(player.x+10, player.y+20);
            }
            
            player.setVelocityX(player.body.velocity.x - (VELOCITY_RIGHT_LEFT_CHANGE_X * fixLowFrequenceMultiplier));
            //emit
            socket.emit('playerMove',[player.x,player.y,player.body.velocity.x - (VELOCITY_RIGHT_LEFT_CHANGE_X * fixLowFrequenceMultiplier),player.body.velocity.y,idClient,'left'+playerSkinChoice]);
            socket.emit('playerPos',[]);

        }
        else if ((pad.right || right) & player.body.velocity.x <= VELOCITY_X_MAX_SPEED & !isChatToggle) {
            //right
            if(player.body.velocity.y == 0){
                player.anims.play('right'+playerSkinChoice, true);
            }
            if(player.body.blocked.down){
                particles.emitParticleAt(player.x-10, player.y+20);
            }
            player.setVelocityX(player.body.velocity.x +(VELOCITY_RIGHT_LEFT_CHANGE_X * fixLowFrequenceMultiplier));
            //emit
            socket.emit('playerMove',[player.x,player.y,player.body.velocity.x + (VELOCITY_RIGHT_LEFT_CHANGE_X * fixLowFrequenceMultiplier),player.body.velocity.y,idClient,'right'+playerSkinChoice]);
        }
        else{ //stop if nothings (with innertie)
            if(player.body.velocity.x >= (VELOCITY_STOP_SPEED*fixLowFrequenceMultiplier)){
                player.setVelocityX(player.body.velocity.x - (VELOCITY_STOP_SPEED*fixLowFrequenceMultiplier));
            }else if(player.body.velocity.x <= -(VELOCITY_STOP_SPEED*fixLowFrequenceMultiplier)){
                player.setVelocityX(player.body.velocity.x + (VELOCITY_STOP_SPEED*fixLowFrequenceMultiplier));
            }else{
                player.setVelocityX(0);
                if(player.body.velocity.y == 0){
                    player.anims.play('stand'+playerSkinChoice,true);
                    socket.emit('playerMove',[player.x,player.y,player.body.velocity.x,player.body.velocity.y,idClient,'stand'+playerSkinChoice]);
                }
            }
        }

        //CURRENT PLAYER VELOCITY Y
        if((jump & player.body.blocked.down || pad.B & player.body.blocked.down) & !isChatToggle){
            //jump
            player.setVelocityY(- VELOCITY_Y);

            if(player.body.velocity.x <= 0){
                player.anims.play('jumpleft'+playerSkinChoice, true);
                socket.emit('playerMove',[player.x,player.y,player.body.velocity.x,- VELOCITY_Y,idClient,'jumpleft'+playerSkinChoice]);
            }else{
                player.anims.play('jumpright'+playerSkinChoice, true);
                socket.emit('playerMove',[player.x,player.y,player.body.velocity.x,- VELOCITY_Y,idClient,'jumpright'+playerSkinChoice]);
            }

            jumpSound.play();

            //emit

        }


        //startzone
        if(player.x >= startCollider.x & player.x <= (startCollider.x+16) & player.y+2 >= startCollider.y-UP_START_ZONE & player.y <=startCollider.y){
            timerStart(scene.time.now);
            let gomaboy = scene.sound.add('letsgo', {
                volume: 0.2,
            });
            gomaboy.play();
            isReset = false;
        }
        if(player.x >= finishCollider.x & player.x <= (finishCollider.x+16) & player.y+2 >= finishCollider.y-UP_FINISH_ZONE & player.y <=finishCollider.y){
            timerStop(scene.time.now,timerText);
        }
        if(isStart & !isFinish){
            timerText.setText(timerconvert((scene.time.now - startTime)));
        }

        for(let i = 0; i < players.length;i++){
            for(let j = 0; j < playersPseudoList.length; j++){
                if(players[i].id == playersPseudoList[j].id){
                    playersPseudoList[j].x = players[i].x - PSEUDO_OFFSET_X;
                    playersPseudoList[j].y = players[i].y - PSEUDO_OFFSET_Y;
                }
            }
        }

        if(restartKey.isDown & !isReset || pad.R2 & !isReset){
            isReset = true;
            player.x = SPAWN_POINT[0];
            player.y = SPAWN_POINT[1];
            player.setVelocityY(0);
            isStart = false;
            isFinish = false;
            timerText.setText('Timer : ');
        }

        pseudoOverPlayer.x = player.x - PSEUDO_OFFSET_X;
        pseudoOverPlayer.y = player.y - PSEUDO_OFFSET_Y;

    }else{
        
    }


    //bg update
    bg1.tilePositionX -= .03;
    bg2.tilePositionX += .02;
    bg3.tilePositionX -= .01;
    }


