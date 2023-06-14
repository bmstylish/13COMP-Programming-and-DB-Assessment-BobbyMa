/*********************************************************** */
// Written by Bobby Ma Term 1 - 2 2023: Mutiplayer Game Manager & Firebase Database 
// Based off last year's single player project 
// Click the ball game, use strucutre but remade game into GTN
// inside set containter  
// 2023 versions 
// v01: Copy and paste my project from Last 
// v02: Adjust project so it suits the purpose, eg. JS adjustment, removed P5 elements
// v03: Added GTN logic into the game
// v04: Moved all GTN logic into gameManager.js 
/*********************************************************** */

//Global Variable 
var gameManager = {};

//Set up function that resets everything to do with the game
function setupCvs() {
    //Settings game start stats 
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById("gameName").style.display = 'none';
    
    document.getElementById("stopBtn").style.display = 'block';
    document.getElementById("lobbyWrapper").style.display = 'block';
    document.getElementById("GTN_lobby").style.display = 'block';
    selectAllGame();
}
gameManager.setupCvs = setupCvs;

//Stops game by reloading page
function stopGame() {
    document.getElementById("lobbyWrapper").style.display = 'none';
    document.getElementById("GTN_lobby").style.display = 'none';
    
    document.getElementById('startBtn').style.display = 'block';
    document.getElementById("gameName").style.display = 'block';
    document.getElementById("stopBtn").style.display = 'none';
}
gameManager.stopGame = stopGame;
