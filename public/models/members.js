const CREW_TARGET = document.getElementById("crew-list");
const CREW_DB = "../ressources/crew.json";
const TEMPLATE = document.getElementById("member-template");
const ID_CARD = document.getElementById("interactive-crew");

let members = [];

let fetchCrew = async () => {
      const RESPONSE = await fetch(CREW_DB);
      const DATA = await RESPONSE.json();
      const CREW = shuffle(DATA);
      
      CREW.forEach(member => {
            createMember(member);
            members.push(member);
      });
      
      
      await displayMembers();
}


// Fischer-Yates Shuffle
let shuffle = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i    
            // swap elements array[i] and array[j]
            [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
}

let createMember = (member) => {
      let posted = document.importNode(TEMPLATE.content, true);
      posted.querySelector("img").setAttribute("src", member.icon);
      posted.querySelector("span.member-lastname").textContent = member.lastname;
      posted.querySelector("span.member-firstname").textContent = member.firstname;
      posted.querySelector("span.member-rank").textContent = member.rank;
      posted.querySelector("span.member-collaboration").textContent = member.collaboration;
      posted.querySelector("span.member-github").textContent = member.github;
      posted.querySelector("span.member-linkedin").textContent = member.linkedin;
      CREW_TARGET.appendChild(posted);
}

let displayMembers = async () => {
      Array.from(document.getElementsByClassName("crew-member")).forEach(element => {
            element.addEventListener("click", () => {
                  document.getElementById("id-avatar").setAttribute("src", element.querySelector("img").getAttribute("src"));
                  document.getElementById("id-lastname").textContent = element.querySelector("span.member-lastname").textContent;
                  document.getElementById("id-firstname").textContent = element.querySelector("span.member-firstname").textContent;
                  document.getElementById("id-rank").textContent = element.querySelector("span.member-rank").textContent;
                  document.getElementById("id-collaboration").textContent = element.querySelector("span.member-collaboration").textContent;
                  document.getElementById("id-github").setAttribute("href", element.querySelector("span.member-github").textContent);
                  document.getElementById("id-github").classList.remove("not-displayed");
                  document.getElementById("id-linkedin").setAttribute("href", element.querySelector("span.member-linkedin").textContent);
                  document.getElementById("id-linkedin").classList.remove("not-displayed");
            });
      });
}
// Running


fetchCrew();
