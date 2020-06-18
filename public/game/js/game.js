let earthScene = new EarthScene(); 

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
    input: {
        gamepad: true,
    },
    /* scene: {
        preload: preload,
        create: create,
        update: update
    }, */
    parent: "game",
    dom: {
        createContainer: true
    }
};

//NEW GAME INSTANCE PHASER 3
let game = new Phaser.Game(config);
game.scene.add('EarthScene',EarthScene);
game.scene.start('EarthScene');

