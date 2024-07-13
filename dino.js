
//board
let board;
let boardWidth = 750;
let boardHeight = 550;
let context;

//player
let playerWidth = 88;
let playerHeight = 94;
let playerX = 50;
let playerY = boardHeight - playerHeight;
let playerImg;

let player = {
    x : playerX,
    y : playerY,
    width : playerWidth,
    height : playerHeight
}

//aerial enemy
class Enemy{
    constructor(name, width, height, x, y, vx, imgSrc) {
        this.name=name;
        this.width=width;
        this.height=height;
        this.x=x;
        this.y=y;
        this.vx=vx;

        let enemyImg=new Image();
        enemyImg.src=imgSrc;
        this.img=enemyImg;
    }
    move(){
        this.x=this.x+this.vx;
    }
    setAlt(){
        this.y=Math.min(Math.max(boardHeight - this.height - boardHeight*Math.random(),this.height),boardHeight - this.height*2);  
    }
}
 
let ene1=new Enemy("kid", 80, 80, 700, 0, -5,"/img/enemy01.png")
let ene2=new Enemy("devil", 80, 80, 700, 0, -3,"/img/enemy02.png")
let ene3=new Enemy("jet", 80, 80, 700, 0, -11,"/img/enemy03.png")
let ene4=new Enemy("heli", 80, 80, 700, 0, -5,"/img/enemy04.png")

let enemyArray = [];

//building
let buildingArray = [];

let building1Width = 54;
let building2Width = 89;
let building3Width = 102;
  
let buildingHeight = 90;
let buildingX = 700;
let buildingY = boardHeight - buildingHeight;

let building1Img;
let building2Img;
let building3Img;

building1Img = new Image();
building1Img.src = "/img/building01.png";
building2Img = new Image();
building2Img.src = "/img/building02.png";
building3Img = new Image();
building3Img.src = "/img/building03.png";

//physics
let velocityX = -4; //building moving left speed
let velocityY = 0;
let gravity = .4;

let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //used for drawing on the board

    //draw initial dinosaur
    // context.fillStyle="green";
    // context.fillRect(dino.x, dino.y, dino.width, dino.height);

    playerImg = new Image();
    playerImg.src = "/img/rufy.png";
    playerImg.onload = function() {
    context.drawImage(playerImg, player.x, player.y, player.width, player.height);
    }

    //add eventlistener
    const characters = document.querySelectorAll(".character");
    characters.forEach(character => {
        character.addEventListener("click", function() {
            selectCharacter(character.getAttribute("data-src"));
        });
        character.addEventListener("touchstart", function() {
            selectCharacter(character.getAttribute("data-src"));
        });
    });

    // requestAnimationFrame(update);
    // setInterval(placeBuilding,  900); //1000 milliseconds = 1 second
    // setInterval(placeEnemies,  400);
    document.addEventListener("keydown", movePlayer);
    document.addEventListener("keydown",restart);

    showCharacterSelection();
}

const showCharacterSelection = () => {
    hideGameContainer();
}

const hideCharacterSelection = () => {
    document.querySelector("h2").classList.add("hidden");
    document.getElementById("character-selection").classList.add("hidden");
    document.querySelector("h1").classList.remove("hidden");
    document.getElementById("board").classList.remove("hidden");
}

const hideGameContainer = () => {
    document.querySelector("h2").classList.remove("hidden");
    document.getElementById("character-selection").classList.remove("hidden");
    document.querySelector("h1").classList.add("hidden");
    document.getElementById("board").classList.add("hidden");
}

function selectCharacter(characterSrc) {
    playerImg.src = characterSrc;
    hideCharacterSelection();
    playerImg.onload = function() {
        requestAnimationFrame(update);
        setInterval(placeBuilding,  900); //1000 milliseconds = 1 second
        setInterval(placeEnemies,  400);
    }
} 



function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //player
    velocityY += gravity;
    player.y = Math.min(player.y + velocityY, playerY); //apply gravity to current player.y, making sure it doesn't exceed the ground
    context.drawImage(playerImg, player.x, player.y, player.width, player.height);

    //building
    for (let i = 0; i < buildingArray.length; i++) {
        let building = buildingArray[i];
        building.x += velocityX;
        context.drawImage(building.img, building.x, building.y, building.width, building.height);

        if (detectCollision(player, building)) {
            gameOver = true;
        }
        if(gameOver){
            document.getElementById("game-over").style.display="block"
        }
    }

    //enemy
    for (let i = 0; i < enemyArray.length; i++) {
        let ene=enemyArray[i];
        ene.move();
        context.drawImage(enemyArray[i].img, ene.x, ene.y, ene.width, ene.height);

        if (detectCollision(player, ene)) {
            gameOver = true;
        }
        if(gameOver){
            document.getElementById("game-over").style.display="block"
        }
    }

    //score
    context.fillStyle="black";
    context.font="20px courier";
    score++;
    context.fillText(score, 5, 20);
}

function movePlayer(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp")) {
        if(player.y>50){    
        //jump
        velocityY = -10.7;
        }
    }
    else if (e.code == "ArrowDown" && player.y == playerY) {
        //duck
    }

}

function placeBuilding() {
    if (gameOver) {
        return;
    }

    //place cactus
    let building = {
        img : null,
        x : buildingX,
        y : buildingY,  //Math.max(cactusY - boardHeight*Math.random(),cactusHeight) 
        width : null,
        height: buildingHeight
    }

    let placeBuildingChance = Math.random(); //0 - 0.9999...

    if (placeBuildingChance > .90) { //10% you get cactus3
        building.img = building3Img;
        building.width = building3Width;
        buildingArray.push(building);
    }
    else if (placeBuildingChance > .70) { //30% you get cactus2
        building.img = building2Img;
        building.width = building2Width;
        buildingArray.push(building);
    }
    else if (placeBuildingChance > .50) { //50% you get cactus1
        building.img = building1Img;
        building.width = building1Width;
        buildingArray.push(building);
    }

    if (buildingArray.length > 5) {
        buildingArray.shift(); //remove the first element from the array so that the array doesn't constantly grow
    }
}


function placeEnemies() {
    if (gameOver) {
        return;
    }

    let enemy;

    //place enemy
    let placeEnemyChance = Math.random(); //0 - 0.9999...

    if (placeEnemyChance > .90) { //10% you get cactus3
        ene3.setAlt();
        enemy= new Enemy(ene3.name,ene3.width,ene3.height,ene3.x,ene3.y,ene3.vx,"img/enemy03.png");
        enemyArray.push(enemy);
    }  
    else if (placeEnemyChance > .70) { //30% you get cactus2
        ene2.setAlt();
        enemy= new Enemy(ene2.name,ene2.width,ene2.height,ene2.x,ene2.y,ene2.vx,"img/enemy02.png");
        enemyArray.push(enemy);
    }
    else if (placeEnemyChance > .50) { //50% you get cactus1
        ene1.setAlt();
        enemy= new Enemy(ene1.name,ene1.width,ene1.height,ene1.x,ene1.y,ene1.vx,"img/enemy01.png");
        enemyArray.push(enemy);
    }

    if (enemyArray.length > 4) {
        enemyArray.shift(); //remove the first element from the array so that the array doesn't constantly grow
    }
}


function detectCollision(a, b) {
    return a.x  + 20 < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width - 20 > b.x &&   //a's top right corner passes b's top left corner
           a.y + 20 < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height - 20 > b.y;    //a's bottom left corner passes b's top left corner
}

function restart(e){
    if(e.code=="Space" && gameOver==true){
        this.location.reload();
    }
}

