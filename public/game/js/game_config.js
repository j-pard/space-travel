//GAME PARAMETERS
const GAME_WIDTH = 1200;
const GAME_HEIGHT = 600;
const GRAVITY = 900;
const RENDER_FPS = 144;
const PLAYER_FRAME_SIZE = [
    {frameWidth: 85, frameHeight: 80},
    {frameWidth: 80, frameHeight: 80}
];
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
    padding: {
        left: 10,
        right: 10,
        top: 0,
        bottom: 10,
    },
    font: "10px monospace"
};
const TITLE_BOARD = {
    fill: "#ffffff",
    backgroundColor: "#00000050",
    fixedWidth:200,
    align:"center",
    fixedHeight: 20
};

const CHAT_BOARD = {
    fixedWidth:800,
    fixedHeight: 500,
    backgroundColor: "#dddddd",
    fill: "#111111",
    padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
    },
    font: "18px monospace"
};

const CHAT_TITLE = {
    fill: "#111111",
    backgroundColor: "#dddddd",
    fixedWidth:800,
    padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 0,
    },
    align:"center",
    fixedHeight: 30
};

const PSEUDO_INPUT = {
    font: "18px monospace",
    fill: "#111111",
    padding: { x: 50, y: 10 },
    backgroundColor: "#eeeeee",
    color:"#111111",
    align:"center"
};

const CHAT_INPUT = {
    font: "18px monospace",
    fill: "#111111",
    padding: { x: 50, y: 10 },
    backgroundColor: "#eeeeee",
    color:"#111111",
};

const TIMER_TEXT = {
    font: "18px monospace",
    fill: "#ffffff",
    padding: { x: 20, y: 10 },
    backgroundColor: "#00000050"
};

const PLAYERS_SKIN_PATH = [
    './img/player1.png',
    './img/player2.png',
    './img/player3.png',
    './img/player4.png',
    './img/player5.png',
    './img/player6.png',
    './img/player7.png',
    './img/player8.png',
    './img/frog.png'
];

