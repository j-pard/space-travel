const LB_TARGET = document.getElementById("lb-list");
const LB_DB = "./ressources/top10.json";
const LB_TEMPLATE = document.getElementById("leaderboard-template");

let fetchBoard = async () => {
      const RESPONSE = await fetch(LB_DB);
      const DATA = await RESPONSE.json();

      DATA.top.forEach(element => {
            createTrophy(element);
      });
}

let createTrophy = (data) => {
      let trophy = document.importNode(LB_TEMPLATE.content, true);
      trophy.querySelector("span.lb-pseudo").textContent = data.pseudo;
      trophy.querySelector("span.lb-time").textContent = convertTime(data.time);
      LB_TARGET.appendChild(trophy);
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

fetchBoard();