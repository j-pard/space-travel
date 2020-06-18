let lvl1;
let lvl1Text;
let lvl2;
let lvl2Text;
class Menu extends Phaser.Scene {
    constructor() {
        super({ key: 'Menu' });
    }
    preload() {
        this.load.image('bg1', './environment/bg-4.png');
        this.load.image('lvl1', './img/lvl1.png');
        this.load.image('lvl2', './img/lvl2.png');
    }
    create() {

        this.BG1 = this.add.tileSprite(0, -5, this.cameras.main.width / 2, this.cameras.main.height / 2, "bg1");
        let scaleX1 = this.cameras.main.width / this.BG1.width
        let scaleY1 = this.cameras.main.height / this.BG1.height
        this.BG1.setOrigin(0, 0);
        let scale1 = Math.max(scaleX1, scaleY1);
        this.BG1.setScale(scale1).setScrollFactor(0);
        this.BG1.tint = 0x777777;

        lvl1 = this.add.sprite(180, 150, "lvl1").setInteractive({ cursor: 'pointer' });;
        lvl1.setScrollFactor(0);
        lvl1Text = this.add.text(55, 30, "The Earth", {
            font: "30px monospace",
            fill: "#ffffff",
            padding: { x: 50, y: 10 },
            backgroundColor: "#eeeeee00",
            color: "#cccccc",
            align: "center",
        });
        lvl1Text.setVisible(false);
        lvl1.on('pointerover', function (event) {
            lvl1Text.setVisible(true);
        });
        lvl1.on('pointerout', function (event) {
            lvl1Text.setVisible(false);
        });
        lvl1.on('clicked', lvlearth, this);
        this.input.on('gameobjectup', function (pointer, gameObject)
            {
                gameObject.emit('clicked', gameObject);
            }, this);

        
        lvl2 = this.add.sprite(380, 420, "lvl2").setInteractive({ cursor: 'pointer' });;
        lvl2.setScrollFactor(0);
        lvl2Text = this.add.text(300, 300, "Mars", {
            font: "30px monospace",
            fill: "#ffffff",
            padding: { x: 50, y: 10 },
            backgroundColor: "#eeeeee00",
            color: "#cccccc",
            align: "center",
        });
        lvl2Text.setVisible(false);
        lvl2.on('pointerover', function (event) {
            lvl2Text.setVisible(true);
        });
        lvl2.on('pointerout', function (event) {
            lvl2Text.setVisible(false);
        });
        lvl2.on('clicked2', lvlMars, this);
        this.input.on('gameobjectup', function (pointer, gameObject)
            {
                gameObject.emit('clicked2', gameObject);
            }, this);
    }
    update() {

    }
}
function lvlearth(){
    game.scene.start('EarthScene');
}
function lvlMars(){
    
}