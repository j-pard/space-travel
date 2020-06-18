let socket; 
            
        let idClient; 
        let playerList;

        //Enregistrement client ID et liste des joueurs
        

//CURRENT PLAYER AND PLAYERS LIST
let player;
let players = [];
let pseudo = "SpaceMan";
let pseudoOverPlayer;
let playersPseudoList = [];
let playerSkinChoice = 1;

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

//Fix 144/60hz loop rate
let timeInterval = 0;
let isLowFrequence = true;
let fixLowFrequenceMultiplier = 2;

let jumpSound;
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
        socket.emit("score",{"time":finishTime - startTime,"pseudo":pseudo});
    }
}

function timerconvert(Time){
    let date = new Date(Time);
    return "Timer  " + date.getMinutes() + " : "+date.getSeconds()+ " : "+date.getMilliseconds();
}

function createMainPlayer(thisGame){
    //create main player
    if(playerSkinChoice == 9){
        player = thisGame.physics.add.sprite(210,2070, "frog");
    }else{
        player = thisGame.physics.add.sprite(210,2070, "player"+playerSkinChoice);
    }

    player.setBounce(0);
    //player.setCollideWorldBounds(true);  //body box 8/48 et décallé de 12 par rapport a la base
    player.id = idClient;
    player.setScale(0.5);
    player.body.setSize(40,80,10,25);

    const camera = thisGame.cameras.main;
    camera.startFollow(player);
    camera.setBounds(0, 0, MAP.widthInPixels, MAP.heightInPixels);

    thisGame.physics.add.collider(player, Road);
    thisGame.physics.add.collider(player, plateforms);

    pseudoOverPlayer = thisGame.add.text(player.x - PSEUDO_OFFSET_X ,player.y - PSEUDO_OFFSET_Y,pseudo,PSEUDO_CONFIG);
}

function createAllAnims(thisGame,keyName,configplace,id,frameRate,repeat,sprite){
    thisGame.anims.create({
        key: (keyName+id),
        frames: thisGame.anims.generateFrameNumbers('player'+id,configplace),
        frameRate:frameRate,
        repeat: repeat
    });
}

function convertMilliLiveBoard(scoreReturn){
    let d = new Date(scoreReturn.time);
    let scoreSet = d.getMinutes()+" : "+d.getSeconds()+" : "+d.getMilliseconds()+ " | "+scoreReturn.pseudo;
    return scoreSet;
}
class EarthScene extends Phaser.Scene {
    
    constructor(){
        super({key:'EarthScene'});
    }

    preload(){
        this.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true);
    this.load.image("tiles", TILE_SET_PATH);
    this.load.tilemapTiledJSON("map", MAP_PATH);
    this.load.image('bg1', './environment/bg-1.png');
    this.load.image('bg2', './environment/bg-2.png');
    this.load.image('bg3', './environment/bg-3.png');

    this.load.image('playerIcon1', './img/base4-1.png');
    this.load.image('playerIcon2', './img/base4-2.png');
    this.load.image('playerIcon3', './img/base4-3.png');
    this.load.image('playerIcon4', './img/base4-4.png');
    this.load.image('playerIcon8', './img/base4-5.png');
    this.load.image('playerIcon7', './img/base4-6.png');
    this.load.image('playerIcon6', './img/base4-7.png');
    this.load.image('playerIcon5', './img/base4-8.png');


    this.load.audio('backmusic', './audio/theme.mp3');
    this.load.audio('jumpfx', './audio/jump_11.wav');
    this.load.audio('letsgo', './audio/letsgo.mp3');


    this.load.audio('backmusic', './audio/theme.mp3');
    this.load.spritesheet('player1','./img/player1.png',{
        frameWidth: 80, frameHeight: 80
    })
    this.load.spritesheet('player2','./img/player2.png',{
        frameWidth: 80, frameHeight: 80
    })
    this.load.spritesheet('player3','./img/player3.png',{
        frameWidth: 80, frameHeight: 80
    })
    this.load.spritesheet('player4','./img/player4.png',{
        frameWidth: 80, frameHeight: 80
    })
    this.load.spritesheet('player5','./img/player5.png',{
        frameWidth: 85, frameHeight: 80
    })
    this.load.spritesheet('player6','./img/player6.png',{
        frameWidth: 85, frameHeight: 80
    })
    this.load.spritesheet('player7','./img/player7.png',{
        frameWidth: 85, frameHeight: 80
    })
    this.load.spritesheet('player8','./img/player8.png',{
        frameWidth: 85, frameHeight: 80
    })
    this.load.spritesheet('frog',
        PLAYER_SKIN_PATH,
        { frameWidth: PLAYER_FRAME_WIDTH, frameHeight: PLAYER_FRAME_HEIGT }
    );
    }

    create(){
        socket = io.connect();
        socket.emit('room','earth');
        socket.on('id',(pl)=>{
        idClient = parseInt(pl.id);
        playerList = JSON.parse(pl.plist);
        for(let i = 0; i < playerList.length;i++){
            if(playerList[i].id != idClient & playerList[i].map == 'earth'){
                let p = this.physics.add.sprite(210,2070,'player'+playerList[i].skin);
                //p.setCollideWorldBounds(true);
                p.setBounce(0);
                p.id = playerList[i].id;
                p.setScale(0.5);
                this.physics.add.collider(p,Road);
                this.physics.add.collider(p,plateforms);
                players.push(p);
    
                let text = this.add.text(p.x - PSEUDO_OFFSET_X,p.y - PSEUDO_OFFSET_Y,playerList[i].pseudo,PSEUDO_CONFIG);
                text.id = playerList[i].id;
                playersPseudoList.push(text);
            }
        }
    });
        //RENDER FPS
    this.physics.world.setFPS(RENDER_FPS);

    //GAMEPAD
        socket.emit('debug',"debug");


    //MUSIC / FX

    let soundback = this.sound.add('backmusic', {
        volume: 0.1,
        loop: true,
    });
    soundback.play();

    jumpSound = this.sound.add('jumpfx', {volume: 0.1});

    //BG MAP

    this.BG1 = this.add.tileSprite(0 ,-5, this.cameras.main.width / 4, this.cameras.main.height / 4, "bg1");
    let scaleX1 = this.cameras.main.width / this.BG1.width
    let scaleY1 = this.cameras.main.height / this.BG1.height
    this.BG1.setOrigin(0, 0);
    let scale1 = Math.max(scaleX1, scaleY1);
    this.BG1.setScale(scale1).setScrollFactor(0);

    this.BG2 = this.add.tileSprite(0 ,-5, this.cameras.main.width / 4, this.cameras.main.height / 4, "bg2");
    let scaleX2 = this.cameras.main.width / this.BG2.width
    let scaleY2 = this.cameras.main.height / this.BG2.height
    this.BG2.setOrigin(0, 0);
    let scale2 = Math.max(scaleX2, scaleY2);
    this.BG2.setScale(scale2).setScrollFactor(0);

    this.BG3 = this.add.tileSprite(0 ,-5, this.cameras.main.width / 3, this.cameras.main.height / 3, "bg3");
    let scaleX3 = this.cameras.main.width / this.BG3.width
    let scaleY3 = this.cameras.main.height / this.BG3.height
    this.BG3.setOrigin(0, 0);
    let scale3 = Math.max(scaleX3, scaleY3);
    this.BG3.setScale(scale3).setScrollFactor(0);

    //CREATE MAP
    MAP = this.make.tilemap({ key: "map"});
    tset = MAP.addTilesetImage("road", "tiles");

    Road = MAP.createStaticLayer("road", tset, 0, 0);
    Road.setCollisionByProperty({ collides: true });
    Road.setScale(1);

    /* const debugGraphics = this.add.graphics().setAlpha(0.75);
    Road.renderDebug(debugGraphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
       }); */

    plateforms = MAP.createStaticLayer("plateforms", tset, 0, 0);
    plateforms.setCollisionByProperty({ collides: true });
    plateforms.setScale(1);


    decorsOverlay = MAP.createStaticLayer("decors overlay", tset, 0, 0);
    decors = MAP.createStaticLayer("decors", tset, 0, 0);

    spawnPoint = MAP.findObject("spawn",(dec)=> dec.name == "spawn");


    //create other players
    

    //imput player pseudo - skin
    pseudoText = this.add.text(GAME_WIDTH/2 - 170,GAME_HEIGHT/2 - 100, "Choisis ton pseudo!",{
        font: "30px monospace",
        fill: "#ffffff",
        padding: { x: 20, y: 10 },
        backgroundColor: "#00000050"
    }).setScrollFactor(0);

    inputPseudo = this.add.rexInputText(GAME_WIDTH/2, GAME_HEIGHT/2, 200, 50, PSEUDO_INPUT).setScrollFactor(0);

    //create 8 choices skin
    for(let i = 0; i < 8; i++){
        let choice = this.add.image(180 + (i*120),450,("playerIcon"+(i+1))).setScrollFactor(0);
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
        },this);
        skinChoiceList.push(choice);
    }
    this.input.on('gameobjectup', function (pointer, gameObject)
    {
        if(!isGameReady){
            gameObject.emit('clicked', gameObject);
        }
    }, this);

    //create animations
    for(let i = 1; i <= 4; i++){
        createAllAnims(this,'left',{ start: 10, end: 19 },i,15,-1,"player");
        createAllAnims(this,'right',{ start: 0, end: 9 },i,15,-1,"player");
        createAllAnims(this,'jumpleft',{ start: 20, end: 25 },i,10,0,"player");
        createAllAnims(this,'jumpright',{ start: 26, end: 31 },i,10,0,"player");
        createAllAnims(this,'stand',{ start: 32, end: 34 },i,5,-1,"player");
    }
    for(let i = 5; i <= 8; i++){
        createAllAnims(this,'left',{ start: 8, end: 15 },i,15,-1,"player");
        createAllAnims(this,'right',{ start: 0, end: 7 },i,15,-1,"player");
        createAllAnims(this,'jumpleft',{ start: 16, end: 19 },i,10,0,"player");
        createAllAnims(this,'jumpright',{ start: 20, end: 23 },i,10,0,"player");
        createAllAnims(this,'stand',{ start: 24, end: 27 },i,5,-1,"player");
    }
    this.anims.create({
        key: 'left9',
        frames: this.anims.generateFrameNumbers('frog', { start: 0, end: 15 }),
        frameRate: 15,
        repeat: -1
    });

    this.anims.create({
        key: 'right9',
        frames: this.anims.generateFrameNumbers('frog', { start: 16, end: 30 }),
        frameRate: 15,
        repeat: -1
    });

    this.anims.create({
        key: 'jumpleft9',
        frames: this.anims.generateFrameNumbers('frog', { start: 0, end: 15 }),
        frameRate: 15,
        repeat: -1
    });

    this.anims.create({
        key: 'jumpright9',
        frames: this.anims.generateFrameNumbers('frog', { start: 16, end: 30 }),
        frameRate: 15,
        repeat: -1
    });
    this.anims.create({
        key: 'stand9',
        frames: this.anims.generateFrameNumbers('frog', { start: 0, end: 15 }),
        frameRate: 15,
        repeat: -1
    });

    //keyboard
    //enterKey = this.input.keyboard.addKey('enter');
    restartKey = this.input.keyboard.addKey('f2');
    //cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown', (event)=>{if(event.key == "ArrowLeft")left = true;}, this);
    this.input.keyboard.on('keyup', (event)=>{if(event.key == "ArrowLeft")left = false;}, this);
    this.input.keyboard.on('keydown', (event)=>{if(event.key == "ArrowRight")right = true;}, this);
    this.input.keyboard.on('keyup', (event)=>{if(event.key == "ArrowRight")right = false;}, this);

    //timer
    startCollider = MAP.findObject("tracker",obj => obj.name == "trackerstart");
    finishCollider = MAP.findObject("tracker",obj => obj.name == "trackerend");

    timerText = this.add.text(950, 550, "Timer : ", TIMER_TEXT).setScrollFactor(0);

    //LiveBoard
    titleBoard = this.add.text(10,10,"Live Records",TITLE_BOARD).setScrollFactor(0);
    LiveBoard = this.add.text(10,30,"",SCORE_BOARD).setScrollFactor(0);

    //leaderBoard
    titleLBoard =this.add.text(990,10,"Local Records",TITLE_BOARD).setScrollFactor(0);
    leaderBoard = this.add.text(990,30,"",SCORE_BOARD).setScrollFactor(0);

    //chat
    chat = this.add.text(GAME_WIDTH/2-400,GAME_HEIGHT/2-230, "", CHAT_BOARD).setScrollFactor(0);
    chatTitle = this.add.text(GAME_WIDTH/2-400,GAME_HEIGHT/2-250, "Space Chat", CHAT_TITLE).setScrollFactor(0);
    isChatToggle = false;
    inputChat = this.add.rexInputText(GAME_WIDTH/2 + 3, GAME_HEIGHT - 50, 800, 50, CHAT_INPUT).setScrollFactor(0);
    chat.setVisible(false);
    chatTitle.setVisible(false);
    inputChat.setVisible(false);

    socket.emit("leaderbord",true);
    
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
        if(newP.id != idClient & newP.map == "earth"){
            playerList.push(newP);
            let p = this.physics.add.sprite(210,2070,'player'+newP.skin);
            //p.setCollideWorldBounds(true);
            p.setBounce(0);
            p.id = newP.id;
            p.setScale(0.5);
            this.physics.add.collider(p,Road);
            this.physics.add.collider(p,plateforms);
            players.push(p);

            let text = this.add.text(p.x,p.y,newP.pseudo,PSEUDO_CONFIG);
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
            inputPseudo.setScrollFactor(999);
            pseudoText.setScrollFactor(999);
            isGameReady = true;
            if(pseudo == "maboy"){
                playerSkinChoice = 9;
            }
            for(let i = 0; i < skinChoiceList.length;i++){
                skinChoiceList[i].input.enabled = false;
                skinChoiceList[i].setVisible(false);
            }
            createMainPlayer(this);
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

    update(){

        //6-7 144hz
        //16 60hz 
        isLowFrequence = ((this.time.now - timeInterval) > 12) ? true : false;
        timeInterval = this.time.now;
        fixLowFrequenceMultiplier = isLowFrequence ? (144/60) : 1;

        //GAMEPAD

    let pad = Phaser.Input.Gamepad.Gamepad;

    if (this.input.gamepad.total){
            pad = this.input.gamepad.getPad(0);
    }


    //GAME STATUS
    if(isGameReady){
        //CURRENT PLAYER VELOCITY X
        if ((pad.left || left)& player.body.velocity.x >= -VELOCITY_X_MAX_SPEED & !isChatToggle) {
            //left
            if(player.body.velocity.y == 0){
                player.anims.play('left'+playerSkinChoice, true);
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
        if(player.x >= startCollider.x & player.x <= (startCollider.x+16) & player.y+2 >= startCollider.y-150 & player.y <=startCollider.y){
            timerStart(this.time.now);
            let gomaboy = this.sound.add('letsgo', {
                volume: 0.2,
            });
            gomaboy.play();
            isReset = false;
        }
        if(player.x >= finishCollider.x & player.x <= (finishCollider.x+16) & player.y+2 >= finishCollider.y-600 & player.y <=finishCollider.y){
            timerStop(this.time.now,timerText);
        }
        if(isStart & !isFinish){
            timerText.setText(timerconvert((this.time.now - startTime)));
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
            player.x = 210;
            player.y = 2070;
            isStart = false;
            isFinish = false;
            timerText.setText('Timer : ');
        }

        pseudoOverPlayer.x = player.x - PSEUDO_OFFSET_X;
        pseudoOverPlayer.y = player.y - PSEUDO_OFFSET_Y;
    }else{
        
    }


    //bg update
    this.BG1.tilePositionX -= .03;
    this.BG2.tilePositionX += .02;
    this.BG3.tilePositionX -= .01;
    }
}