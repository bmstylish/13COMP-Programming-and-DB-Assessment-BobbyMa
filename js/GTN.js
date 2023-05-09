/*********************************************************** */
// Written by Bobby Ma Term 1 - 2 2022: Game & Firebase Database 
// Based off the demo project built in p5 mini skils
// Click the ball game, resizes the canvas and runs click the ball game
// inside set canvas 
// v01: Copy and paste my project from the P5 mini skills 
// v02: Adjust project so it suits the purpose, eg. canvas adjustment 
// v03: Added speed difficulty to ball speed as score increases 
/*********************************************************** */

//Setting iniital constants and variables 
var GTN = {};
var player1Score = [];
var player2Score = [];

//Set up function that resets everything to do with the game, resizes canvas etc
function setupCvs() {
    //Settings game start stats 
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById("gameName").style.display = 'none';
    document.getElementById("score").innerHTML = "0";
    document.getElementById("highScore").innerHTML = highScore;

    document.getElementById("lobbyWrapper").style.display = 'block';
    document.getElementById("GTN_lobby").style.display = 'block';
    selectAllGame();
}

//Stops game by setting timer to 0
function stopGame() {
    document.getElementById('startBtn').style.display = 'block';
    document.getElementById("gameName").style.display = 'block';
    location.reload();
}

