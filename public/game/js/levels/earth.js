MAP_NAME = "earth";
TILE_SET_PATH = './img/tileset.png';
MAP_PATH = './map/cityMap.json';
BG1_PATH = './environment/bg-1.png';
BG2_PATH = './environment/bg-2.png';
BG3_PATH = './environment/bg-3.png';
SPAWN_POINT = [210,2070];
UP_START_ZONE = 150;
UP_FINISH_ZONE = 600;

class EarthScene extends Phaser.Scene {
    
    constructor(){
        super({key:'EarthScene'});
    }

    preload(){
        preloadGame(this);
        //load map
        this.load.image("tiles", TILE_SET_PATH);
        this.load.tilemapTiledJSON("map", MAP_PATH);
        this.load.image('bg1', BG1_PATH);
        this.load.image('bg2', BG2_PATH);
        this.load.image('bg3', BG3_PATH);
    }

    create(){
        createGame(this);
    }

    update(){
        updateGame(this);
    }
}