const BTN = document.getElementById("sendBtn");
const CHATBOX = document.getElementById("chatbox");
const MSGBOX = document.getElementById("messageToSend");
const MESSENGER = document.getElementById("messenger");

// Testing in local
//let socket = io.connect('http://localhost:3000');
// Production
let socket = io.connect('https://ratpi.herokuapp.com/');


let pseudo = prompt("Quel est ton nom, Utilisateur ?");

if(pseudo && pseudo != "" && pseudo != " " && pseudo != null) {
      socket.emit('newPseudo', pseudo);

      BTN.addEventListener("click", (event) => {
            let message = MSGBOX.value.trim();
            if(message && message != "" && message != " " ) {
                  socket.emit('messageToServer', message);
                  MSGBOX.value = "";
                  MSGBOX.placeholder = "Write your message ..."
            }
            else {
                  MSGBOX.value = "";
                  MSGBOX.placeholder = "Message invalide !"
            }
            event.preventDefault();
      });
      
      socket.on('messageToAll', (message) => {
            if(message.author != pseudo) {
                       
            // Full message
            let li = document.createElement("li");
            li.classList.add("crew-member");

            // Author
            let authorZone = document.createElement("div");
            authorZone.innerHTML = ">> " + message.author;
            authorZone.classList.add("author");
            li.appendChild(authorZone);

            // Text
            let messageZone = document.createElement("p");
            messageZone.innerHTML = message.text;
            messageZone.classList.add("text-message");
            li.appendChild(messageZone);

            // Style 
            if(message.author == "You") {
                  authorZone.innerHTML = "<< " + message.author;
                  authorZone.classList.add("you");
                  li.classList.add("text-right");
            }
            else {
                  li.classList.add("text-left");
            }

            // Including
            MESSENGER.appendChild(li);
            
      
            // Scroll down
            let allMsg = document.querySelectorAll("#messenger li");
            let lastMsg = allMsg[allMsg.length-1];
            lastMsg.scrollIntoView();
            }
      });
}

else {
      location.href = "/adv";
}
