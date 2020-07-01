

class EarthScene extends Phaser.Scene {
    
    constructor(){
        super({key:'EarthScene'});
    }

    preload(){
        preloadGame(this);
        //load map
        this.load.image("tiles", './img/tileset.png');
        this.load.tilemapTiledJSON("map", './map/earth.json');
        this.load.image('bg1', './environment/bg-1.png');
        this.load.image('bg2', './environment/bg-2.png');
        this.load.image('bg3', './environment/bg-3.png');

        this.load.audio('backmusic', './audio/theme.mp3');
    }

    create(){
        //map config
        MAP_NAME = "earth";
        SPAWN_POINT = [210,2070];
        UP_START_ZONE = 150;
        UP_FINISH_ZONE = 600;

        //background
        bg1 = this.add.tileSprite(0 ,0, this.cameras.main.width / 4, this.cameras.main.height / 4, "bg1");
        let scaleX1 = this.cameras.main.width / bg1.width
        let scaleY1 = this.cameras.main.height / bg1.height
        bg1.setOrigin(0, 0);
        let scale1 = Math.max(scaleX1, scaleY1);
        bg1.setScale(scale1).setScrollFactor(0);

        bg2 = this.add.tileSprite(0 ,0, this.cameras.main.width / 4, this.cameras.main.height / 4, "bg2");
        let scaleX2 = this.cameras.main.width / bg2.width
        let scaleY2 = this.cameras.main.height / bg2.height
        bg2.setOrigin(0, 0);
        let scale2 = Math.max(scaleX2, scaleY2);
        bg2.setScale(scale2).setScrollFactor(0);

        bg3 = this.add.tileSprite(0 ,0, this.cameras.main.width / 3, this.cameras.main.height / 3, "bg3");
        let scaleX3 = this.cameras.main.width / bg3.width
        let scaleY3 = this.cameras.main.height / bg3.height
        bg3.setOrigin(0, 0);
        let scale3 = Math.max(scaleX3, scaleY3);
        bg3.setScale(scale3).setScrollFactor(0);


        //map
        MAP = this.make.tilemap({ key: "map"});
        tset = MAP.addTilesetImage("road", "tiles");

        Road = MAP.createStaticLayer("road", tset, 0, 0);
        Road.setCollisionByProperty({ collides: true });
        Road.setScale(1);

        plateforms = MAP.createStaticLayer("plateforms", tset, 0, 0);
        plateforms.setCollisionByProperty({ collides: true });
        plateforms.setScale(1);


        decorsOverlay = MAP.createStaticLayer("decors overlay", tset, 0, 0);
        decors = MAP.createStaticLayer("decors", tset, 0, 0);

        startCollider = MAP.findObject("tracker",obj => obj.name == "trackerstart");
        finishCollider = MAP.findObject("tracker",obj => obj.name == "trackerend");
        let spawnp = MAP.findObject("spawn",obj => obj.name == "spawn");
        SPAWN_POINT[0] = spawnp.x;
        SPAWN_POINT[1] = spawnp.y;
        createGame(this);
    }

    update(){
        updateGame(this);
    }
}