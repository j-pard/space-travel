let config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: GRAVITY },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    parent: "game",
    dom: {
        createContainer: true
    }
};

//NEW GAME INSTANCE PHASER 3
let game = new Phaser.Game(config);

//CURRENT PLAYER AND PLAYERS LIST
let player;
let players = [];
let pseudo = "SpaceMan";
let pseudoOverPlayer;
let playersPseudoList = [];

//INPUTS
let cursors;
let enterKey;
let restartKey;

//TIMER VARIABLES
let timerText;

let isReset = false;
let isStart = false;
let isFinish = false;

let startTime = 0;
let finishTime = 0;


let startCollider;
let finishCollider;

//GAME STATS
let isGameReady = false;

let inputPseudo;
let pseudoText;


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
    return date.getMinutes() + " min(s) "+date.getSeconds()+ " sec(s) "+date.getMilliseconds()+ " ms";
}
//LOAD ASSETS
function preload ()
{
    this.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true);
    this.load.image("tiles", TILE_SET_PATH);
    this.load.tilemapTiledJSON("map", MAP_PATH);
    this.load.image('bg1', './environment/bg-1.png');
    this.load.image('bg2', './environment/bg-2.png');
    this.load.image('bg3', './environment/bg-3.png');

    this.load.image('playerIcon1', './img/base4-1.png.png');
    this.load.image('playerIcon2', './img/base4-2.png.png');
    this.load.image('playerIcon3', './img/base4-3.png.png');
    this.load.image('playerIcon4', './img/base4-4.png.png');
    this.load.image('playerIcon5', './img/base4-5.png.png');
    this.load.image('playerIcon6', './img/base4-6.png.png');
    this.load.image('playerIcon7', './img/base4-7.png.png');
    this.load.image('playerIcon8', './img/base4-8.png.png');
    

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
        frameWidth: 80, frameHeight: 80
    })
    this.load.spritesheet('player6','./img/player6.png',{
        frameWidth: 80, frameHeight: 80
    })
    this.load.spritesheet('player7','./img/player7.png',{
        frameWidth: 80, frameHeight: 80
    })
    this.load.spritesheet('player8','./img/player8.png',{
        frameWidth: 80, frameHeight: 80
    })
    this.load.spritesheet('frog',
        PLAYER_SKIN_PATH,
        { frameWidth: PLAYER_FRAME_WIDTH, frameHeight: PLAYER_FRAME_HEIGT }
    );
}

//GAME CREATE AND SOCKET LISTENNER
function create ()
{
    //RENDER FPS
    this.physics.world.setFPS(RENDER_FPS);

    //MUSIC

    let soundback = this.sound.add('backmusic', {volume: 0.1});
    soundback.play();

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
    const MAP = this.make.tilemap({ key: "map"});
    const tset = MAP.addTilesetImage("road", "tiles");

    const Road = MAP.createStaticLayer("road", tset, 0, 0);
    Road.setCollisionByProperty({ collides: true });
    Road.setScale(1);

    /* const debugGraphics = this.add.graphics().setAlpha(0.75);
    Road.renderDebug(debugGraphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
       }); */

    const plateforms = MAP.createStaticLayer("plateforms", tset, 0, 0);
    plateforms.setCollisionByProperty({ collides: true });
    plateforms.setScale(1);


    const decorsOverlay = MAP.createStaticLayer("decors overlay", tset, 0, 0);
    const decors = MAP.createStaticLayer("decors", tset, 0, 0);

    const spawnPoint = MAP.findObject("spawn",(dec)=> dec.name == "spawn");


    //create other players
    for(i in playerList){
        if(playerList[i].id != idClient){
            let p = this.physics.add.sprite(210,2070,'frog');
            //p.setCollideWorldBounds(true);
            p.setBounce(0);
            p.id = playerList[i].id;
            p.setScale(0.25);
            this.physics.add.collider(p,Road);
            this.physics.add.collider(p,plateforms);
            players.push(p);

            let text = this.add.text(p.x - PSEUDO_OFFSET_X,p.y - PSEUDO_OFFSET_Y,playerList[i].pseudo,PSEUDO_CONFIG);
            text.id = playerList[i].id;
            playersPseudoList.push(text);
        }
    }

    //imput player pseudo - skin
    pseudoText = this.add.text(GAME_WIDTH/2 - 170,GAME_HEIGHT/2 - 100, "Choisi ton pseudo!",{
        font: "30px monospace",
        fill: "#ffffff",
        padding: { x: 20, y: 10 },
        backgroundColor: "#00000000"
    }).setScrollFactor(0);

    inputPseudo = this.add.rexInputText(GAME_WIDTH/2, GAME_HEIGHT/2, 200, 50, {
        font: "18px monospace",
        fill: "#111111",
        padding: { x: 50, y: 10 },
        backgroundColor: "#eeeeee",
        color:"#111111",
        align:"center"
    }).setScrollFactor(0);


    //create main player
    player = this.physics.add.sprite(210,2070, 'player4');
    player.setBounce(0);
    //player.setCollideWorldBounds(true);  //body box 8/48 et décallé de 12 par rapport a la base
    player.id = idClient;
    player.setScale(0.5);
    player.body.setSize(40,80,10,25);

    const camera = this.cameras.main;
    camera.startFollow(player);
    camera.setBounds(0, 0, MAP.widthInPixels, MAP.heightInPixels);

    this.physics.add.collider(player, Road);
    this.physics.add.collider(player, plateforms);

    //create animations
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('frog', { start: 0, end: 15 }),
        frameRate: 15,
        repeat: -1
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('frog', { start: 16, end: 30 }),
        frameRate: 15,
        repeat: -1
    });

    //anim player4
    this.anims.create({
        key: 'left4',
        frames: this.anims.generateFrameNumbers('player4', { start: 10, end: 19 }),
        frameRate: 15,
        repeat: -1
    });

    this.anims.create({
        key: 'right4',
        frames: this.anims.generateFrameNumbers('player4', { start: 0, end: 9 }),
        frameRate: 15,
        repeat: -1
    });

    this.anims.create({
        key: 'jumpleft4',
        frames: this.anims.generateFrameNumbers('player4', { start: 20, end: 25 }),
        frameRate: 10,
        repeat: 0
    });
    this.anims.create({
        key: 'jumpright4',
        frames: this.anims.generateFrameNumbers('player4', { start: 26, end: 31 }),
        frameRate: 10,
        repeat: 0
    });

    this.anims.create({
        key: 'stand4',
        frames: this.anims.generateFrameNumbers('player4', { start: 32, end: 34 }),
        frameRate: 5,
        repeat: -1
    });

    //keyboard
    enterKey = this.input.keyboard.addKey('enter');
    restartKey = this.input.keyboard.addKey('backspace');
    cursors = this.input.keyboard.createCursorKeys();

    //timer
    startCollider = MAP.findObject("tracker",obj => obj.name == "trackerstart");
    finishCollider = MAP.findObject("tracker",obj => obj.name == "trackerend");

    timerText = this.add.text(16, 16, "Timer : ", {
        font: "18px monospace",
        fill: "#ffffff",
        padding: { x: 20, y: 10 },
        backgroundColor: "#000000"
    }).setScrollFactor(0);

    //update other players
    socket.on('updatePlayerMove',(data)=>{
        data = JSON.parse(data);
        for(i in players){
            if(players[i].id == data[4]){
                players[i].x = data[0];
                players[i].y = data[1];
                players[i].setVelocityX(data[2]);
                players[i].setVelocityY(data[3]);
                players[i].anims.play(data[5]);
            }
        }
         for(i in playersPseudoList){
            if(playersPseudoList[i].id == data[4]){
                playersPseudoList[i].setText(data[6]);
                playersPseudoList[i].x = data[0] - PSEUDO_OFFSET_X;
                playersPseudoList[i].y = data[1] - PSEUDO_OFFSET_Y;
            }
        } 
    });
    //remove a player
    socket.on('remove_player',(remove_player)=>{
        for(el in playerList){
            if(playerList[el].id == parseInt(remove_player)){
                playerList.splice(el,1);
            }
        }
        for(el in players){
            if(players[el].id == remove_player){
                players[el].destroy();
                players.splice(el,1);
            }
        }
        for(el in playersPseudoList){
            if(playersPseudoList[el].id == remove_player){
                playersPseudoList[el].destroy();
                playersPseudoList.splice(el,1);
            }
        }

    });
    //add a player
    socket.on('new_player',(newPlayer)=>{
        let newP = JSON.parse(newPlayer);
        if(newP.id != idClient){
            playerList.push(newP);
            let p = this.physics.add.sprite(210,2070,'frog');
            //p.setCollideWorldBounds(true);
            p.setBounce(0);
            p.id = newP.id;
            p.setScale(0.25);
            this.physics.add.collider(p,Road);
            this.physics.add.collider(p,plateforms);
            players.push(p);

            let text = this.add.text(p.x,p.y,newP.pseudo,PSEUDO_CONFIG);
            text.id = newP.id;
            playersPseudoList.push(text);
        }
    });
}

//GAME LOOP
function update ()
{
    //GAME STATUS
    if(isGameReady){
        //CURRENT PLAYER VELOCITY X
        if (cursors.left.isDown & player.body.velocity.x >= -VELOCITY_X_MAX_SPEED) {
            //left
            if(player.body.velocity.y == 0){
                player.anims.play('left4', true);
            }
            
            player.setVelocityX(player.body.velocity.x - VELOCITY_RIGHT_LEFT_CHANGE_X);
            //emit
            socket.emit('playerMove',[player.x,player.y,player.body.velocity.x - VELOCITY_RIGHT_LEFT_CHANGE_X,player.body.velocity.y,idClient,'left']);
            socket.emit('playerPos',[]);

        }
        else if (cursors.right.isDown & player.body.velocity.x <= VELOCITY_X_MAX_SPEED) {
            //right
            if(player.body.velocity.y == 0){
                player.anims.play('right4', true);
            }
            
            player.setVelocityX(player.body.velocity.x +VELOCITY_RIGHT_LEFT_CHANGE_X);
            //emit
            socket.emit('playerMove',[player.x,player.y,player.body.velocity.x + VELOCITY_RIGHT_LEFT_CHANGE_X,player.body.velocity.y,idClient,'right']);
        }
        else{ //stop if nothings (with innertie)
            if(player.body.velocity.x >= VELOCITY_STOP_SPEED){
                player.setVelocityX(player.body.velocity.x - VELOCITY_STOP_SPEED);
            }else if(player.body.velocity.x <= -VELOCITY_STOP_SPEED){
                player.setVelocityX(player.body.velocity.x + VELOCITY_STOP_SPEED);
            }else{
                player.setVelocityX(0);
                if(player.body.velocity.y == 0){
                    player.anims.play('stand4',true);
                }
            }
        }

        //CURRENT PLAYER VELOCITY Y
        if(cursors.space.isDown & player.body.blocked.down){
            //jump
            player.setVelocityY(- VELOCITY_Y);
            if(player.body.velocity.x <= 0){
                player.anims.play('jumpleft4', true);
            }else{
                player.anims.play('jumpright4', true);
            }
            //emit
            socket.emit('playerMove',[player.x,player.y,player.body.velocity.x,- VELOCITY_Y,idClient,'right']);
        }
        

        //startzone
        if(player.x >= startCollider.x & player.x <= (startCollider.x+16) & player.y+2 >= startCollider.y-150 & player.y <=startCollider.y){
            timerStart(this.time.now);
            isReset = false;
        }
        if(player.x >= finishCollider.x & player.x <= (finishCollider.x+16) & player.y+2 >= finishCollider.y-600 & player.y <=finishCollider.y){
            timerStop(this.time.now,timerText);
        }
        if(isStart & !isFinish){
            timerText.setText(timerconvert((this.time.now - startTime)));
        }

        for(i in players){
            for(j in playersPseudoList){
                if(players[i].id == playersPseudoList[j].id){
                    playersPseudoList[j].x = players[i].x - PSEUDO_OFFSET_X;
                    playersPseudoList[j].y = players[i].y - PSEUDO_OFFSET_Y;
                }
            }
        }

        if(restartKey.isDown & !isReset){
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
        if(enterKey.isDown){
            if(inputPseudo.text == ""){
                pseudo = "SpaceMan"+idClient;
            }else{
                pseudo = inputPseudo.text;
            }
            inputPseudo.setScrollFactor(999);
            pseudoText.setScrollFactor(999);
            isGameReady = true;
            pseudoOverPlayer = this.add.text(player.x - PSEUDO_OFFSET_X ,player.y - PSEUDO_OFFSET_Y,pseudo,PSEUDO_CONFIG);
            socket.emit("pseudoSet",JSON.stringify([pseudo,idClient]));
        }
    }
    

    //bg update
    this.BG1.tilePositionX -= .03;
    this.BG2.tilePositionX += .02;
    this.BG3.tilePositionX -= .01;
    
}



