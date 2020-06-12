//GAME PARAMETERS
const GAME_WIDTH = 1200;
const GAME_HEIGHT = 600;
const GRAVITY = 900;
const RENDER_FPS = 144;
const PLAYER_FRAME_WIDTH = 80;
const PLAYER_FRAME_HEIGT = 80;
const SPAWN_X = 100;
const SPAWN_Y = 450;
const VELOCITY_RIGHT_LEFT_CHANGE_X = 5;
const VELOCITY_X_MAX_SPEED = 300;
const VELOCITY_Y = 460;
const VELOCITY_STOP_SPEED = 15;

const PSEUDO_OFFSET_X = 150;
const PSEUDO_OFFSET_Y = 50;
const PSEUDO_CONFIG = {
    font: "15px monospace",
    fill: "#ffffff",
    padding: { x: 50, y: 10 },
    backgroundColor: "#eeeeee00",
    color:"#cccccc",
    align: "center",
    fixedWidth:300
};
const SCORE_BOARD = {
    fixedWidth:200,
    fixedHeight: 200,
    backgroundColor: "#00000050",
    font: "10px monospace"
};
const TITLE_BOARD = {
    fill: "#ffffff",
    backgroundColor: "#00000050",
    fixedWidth:200,
    align:"center",
    fixedHeight: 20
};

const TIMER_TEXT = {
    font: "18px monospace",
    fill: "#ffffff",
    padding: { x: 20, y: 10 },
    backgroundColor: "#00000050"
};

const PLAYER_SKIN_PATH = './img/frog.png';
const TILE_SET_PATH = './img/tileset.png';
const MAP_PATH = './map/cityMap.json';
