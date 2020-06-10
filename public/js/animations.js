const PP1 = document.querySelector("#pp-1 p");
const PP2 = document.querySelector("#pp-2 p");

const PROJECT1 = document.getElementById("project1");
const PROJECT2 = document.getElementById("project2");
const PROJECT3 = document.getElementById("project3");

const IMG_BOT = document.getElementById("logoBottom");

const TIMEOUT = 4000;

PROJECT1.addEventListener("click", () => {
      PP1.style.opacity = 1;
      setTimeout(() => {
            PP1.style.opacity = 0;
      }, TIMEOUT);
});

PROJECT2.addEventListener("click", () => {
      PP2.style.opacity = 1;
      setTimeout(() => {
            PP2.style.opacity = 0;
      }, TIMEOUT);
});

PROJECT3.addEventListener("click", () => {
      location.href = "/adv";
});

IMG_BOT.addEventListener("click", () => {
      window.scrollTo({ top: 0});
});