const EARTH_UL = document.getElementById("lb-earth-list");
const MARS_UL = document.getElementById("lb-mars-list");
const VENUS_UL = document.getElementById("lb-venus-list");
const LB_DB = "./ressources/top10.json";
const LB_TEMPLATE = document.getElementById("leaderboard-template");

// let fetchBoard = async () => {
//       const RESPONSE = await fetch(LB_DB);
//       const DATA = await RESPONSE.json();

//       DATA.top.forEach(element => {
//             createTrophy(element);
//       });
// }


let socket = io.connect();
socket.emit('leaderbordload',true);
socket.on("sentscoreload",(scores)=>scores.forEach(element => {createTrophy(element)}));


let createTrophy = (data) => {
      let trophy = document.importNode(LB_TEMPLATE.content, true);
      trophy.querySelector("span.lb-pseudo").textContent = data.pseudo;
      trophy.querySelector("span.lb-time").textContent = convertTime(data.time);
      switch (data.map) {
            case "mars":
                  trophy.querySelector("img.lb-img").setAttribute("src", "./img/mars.png");
                  MARS_UL.appendChild(trophy);
                  break;
            case "venus":
                  trophy.querySelector("img.lb-img").setAttribute("src", "./img/venus.png");
                  VENUS_UL.appendChild(trophy);
                  break;
            case "earth":
            default:
                  EARTH_UL.appendChild(trophy);
                  break;
      }
}

let convertTime = (duration) => {
      let milliseconds = parseInt(duration % 1000),
      seconds = parseInt((duration / 1000) % 60),
      minutes = parseInt((duration / (1000 * 60)) % 60);

      minutes = (minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds < 10) ? "0" + seconds : seconds;

      return minutes + ":" + seconds + "." + milliseconds;
}

// RUNNING

//fetchBoard();