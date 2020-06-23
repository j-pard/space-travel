# Space Travel Smulator
**Gamejam** - Développement d'un jeu multijoueurs en NodeJS en *une semaine*.  
(O8 juin 2020, 9h00 -> 12 juin 2020, 15h30)  
[Lien du jeu](https://ratpi.herokuapp.com/)

## Qu'est-ce qu'une GameJam ?
Une game jam (game jam est parfois utilisé avec le genre masculin) est un hackathon avec pour thème principal les jeux vidéo, mais pouvant aussi porter sur les jeux au sens large. Les participants, groupés en équipes, doivent créer un jeu dans un temps limité.  
[Wikipedia](https://fr.wikipedia.org/wiki/Game_jam)

## Présentation
**Space Travel Simulator** est un jeu de *plateforme 2D* avec une tendance *speedrun*.  
L'objectif est donc de parcourir la carte, sauter de plateforme en plateforme et eviter les pièges, le tout le plus rapidement possible.  

Nous avons décidé de créer une identité complète pour notre jeu ainsi que pour tout ce qui l'entoure.  
Nous avons donc mit en place un site web représentant notre studio *fictif*. Grâce à cela, plusieurs features sont devenus possibles :
* Chat en ligne
* Compétitivité entre les joueurs
* Tableau des scores dynamique en jeu
* Stockage des meilleurs temps dans une base de données (MongoDB)
* Support gamepad

L'ensemble du projet utilise une structure **MVC** portée sur un serveur Node utilisant express et socket, avec une communication mongoDB.

## Contraintes
* Faire un jeu multi joueurs.
* Déployez votre application sur Heroku.
* Présentation devant le groupe.

## L'équipe
L'équipe est formée de 5 développeurs juniors, en formation [BeCode](https://becode.org/).
* Chef de projet : [Jonathan Pardons](https://github.com/j-pard)
* Game designer : [Lloyd Colart](https://github.com/Lloydcol)
* Back-end : [Hugo Bricoult](https://github.com/HugoBricoult)
* Back-end : [Soufiane Amjahad](https://github.com/AmjSf)
* Graphiste : [Timothy Tedaldi](https://github.com/TimothyTedaldi)


## Technologies
* NodeJS
  * express
  * socketIO 
  * mongoDB
* Javascript
  * Phaser
* HTML5 
* CSS3
  * SASS

## Sources
* PNG : [PNG Tree](https://pngtree.com/)
* Images : [Pinterest](https://www.pinterest.com)
* Sons & musique: [CCMixter](http://dig.ccmixter.org/files/destinazione_altrove/59536)
* Pixel Art : [Ansimuz](https://ansimuz.itch.io/)

## Idées pour le futur
* Adaptation mobile
* Responsivité accrue
* Plusieurs cartes
* Room limitées dans le temps
* Fonction tournois

## Changelog
* v0.2.0 : Equilibrage 60hz/144hz
