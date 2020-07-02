let clicked = true;

let loader;
let loaderText;

let lvl1;
let lvl1Text;
let lvl2;
let lvl2Text;
let lvl3;
let lvl3Text;

let bg4;

const CONFIG_TEXT_MENU = {
    font: "30px monospace",
    fill: "#ffffff",
    padding: { x: 50, y: 10 },
    backgroundColor: "#eeeeee00",
    color: "#cccccc",
    align: "center",
};

function createMenuItem(level,text,scene){
    level.setScrollFactor(0);
    text.setVisible(false);
    level.on('pointerover', function (event) {
        text.setVisible(true);
    });
    level.on('pointerout', function (event) {
        text.setVisible(false);
    });
    scene.input.on('gameobjectup', function (pointer, gameObject)
        {
            gameObject.emit('clicked'+text.text, gameObject);
        }, scene);
}
class Menu extends Phaser.Scene {
    constructor() {
        super({ key: 'Menu' });
    }
    preload() {
        this.load.image('bg4', './environment/bg-4.png');
        this.load.image('lvl1', './img/lvl1.png');
        this.load.image('lvl2', './img/lvl2.png');
        this.load.image('lvl3', './img/lvl3.png');
    }
    create() {

        

        bg4 = this.add.tileSprite(0, -5, this.cameras.main.width / 2, this.cameras.main.height / 2, "bg4");
        let scaleX1 = this.cameras.main.width / bg4.width
        let scaleY1 = this.cameras.main.height / bg4.height
        bg4.setOrigin(0, 0);
        let scale1 = Math.max(scaleX1, scaleY1);
        bg4.setScale(scale1).setScrollFactor(0);
        bg4.tint = 0x777777;

        lvl1 = this.add.sprite(180, 150, "lvl1").setInteractive({ cursor: 'pointer' });
        lvl1Text = this.add.text(55, 30, "The Earth", CONFIG_TEXT_MENU);
        createMenuItem(lvl1,lvl1Text,this);
        lvl1.on('clickedThe Earth', lvlearth, this);
        
        lvl2 = this.add.sprite(380, 420, "lvl2").setInteractive({ cursor: 'pointer' });
        lvl2.tint = 0x555555;
        //lvl2Text = this.add.text(300, 300, "Mars", CONFIG_TEXT_MENU);
        //createMenuItem(lvl2,lvl2Text,this);
        //lvl2.on('clickedMars', lvlMars, this);

        lvl3 = this.add.sprite(540, 180, "lvl3").setInteractive({ cursor: 'pointer' });
        lvl3Text = this.add.text(450, 60, "Venus", CONFIG_TEXT_MENU);
        createMenuItem(lvl3,lvl3Text,this);
        lvl3.on('clickedVenus', lvlVenus, this);

        loader = this.add.text(0,0,"Chargement",{
            font: "30px monospace",
            fill:'#ffffff',
            color:'#ffffff',
            backgroundColor: "#000000aa",
            fixedWidth:GAME_WIDTH,
            fixedHeight: GAME_HEIGHT,
            padding:{
                left: 100,
                top: (GAME_HEIGHT/2)-30,
            },
            align:"center"
        });
        loader.setVisible(false);

    }
    update() {

    }
}

function lvlearth(){
    if(clicked){
        game.scene.start('EarthScene');
        clicked = false;
        loader.setVisible(true);
    }
}

function lvlMars(){
    if(clicked){
        game.scene.start('MarsScene');
        clicked = false;
        loader.setVisible(true);
    }
}

function lvlVenus(){
    if(clicked){
        game.scene.start('VenusScene');
        clicked = false;
        loader.setVisible(true);
    }
}
