/************************************************************ */
// Written by Bobby Ma Term 1 - 2 2023: Game & Firebase Database 
// Guess the number game, resizes the canvas and runs click the ball game
// inside set canvas 
// v01: Copy and paste my project from the P5 mini skills 
// v02: Adjust project so it suits the purpose, eg. canvas adjustment 
// v03: Added speed difficulty to ball speed as score increases 
/*********************************************************** */

//Setting iniital constants and variables 
const CWIDTH = document.querySelector('#wrapper').offsetWidth;
const CHEIGHT = document.querySelector('#wrapper').offsetHeight;

var player1Score = [];
var player2Score = [];
var clickCount = 0;

//Set up function that resets everything to do with the game, resizes canvas etc
function setupCvs() {
    //Settings game start stats 
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById("gameName").style.display = 'none';
    document.getElementById("score").innerHTML = "0";
    document.getElementById("highScore").innerHTML = highScore;

    document.getElementById("lobbyWrapper").style.display = 'block';
    document.getElementById("TTT_lobby").style.display = 'block';
    selectAllGame();
}

//Stops game by setting timer to 0
function stopGame() {
    document.getElementById('startBtn').style.display = 'block';
    document.getElementById("gameName").style.display = 'block';
    player1Score = [];
    player2Score = [];
    clickCount = 0;
    location.reload();
}

function clicked(id) {
    if (clickCount % 2 == 0 && player1Score.indexOf(id) < 0 && player2Score.indexOf(id) < 0 && clickCount <= 9) {
        document.getElementById(id).style.backgroundColor = "red";
        player1Score.push(id);
        clickCount++;
        if (checkWinnerPlayer1())
            clickCount = 10;
    }

    if (clickCount % 2 != 0 && player1Score.indexOf(id) < 0 && player2Score.indexOf(id) < 0 && clickCount <= 9) {

        document.getElementById(id).style.backgroundColor = "green";
        player2Score.push(id);
        clickCount++;
        if (checkWinnerPlayer2())
            clickCount = 10;
    }

}

function checkWinnerPlayer1() {
    var player1rows = [];
    var player1cols = [];


    for (i = 0; i < player1Score.length; i++) {
        var rowsColumns1 = [];
        rowsColumns1 = player1Score[i].toString().split('.');
        player1rows.push(rowsColumns1[0]);
        player1cols.push(rowsColumns1[1]);

    }


    var player1Winner = checkForRowColumn(player1rows);
    if (!player1Winner)
        player1Winner = checkForRowColumn(player1cols);
    if (!player1Winner)
        player1Winner = checkForDiagonal(player1Score);

    if (player1Winner) {
        console.log('Player 1 wins click play again to resume');
        return true;
    }
    return false;
}

function checkWinnerPlayer2() {
    var player2rows = [];
    var player2cols = [];
    for (i = 0; i < player2Score.length; i++) {
        var rowsColumns2 = [];
        rowsColumns2 = player2Score[i].toString().split('.');
        player2rows.push(rowsColumns2[0]);
        player2cols.push(rowsColumns2[1]);
    }

    var player2Winner = checkForRowColumn(player2rows);
    if (!player2Winner)
        player2Winner = checkForRowColumn(player2cols);
    if (!player2Winner)
        player2Winner = checkForDiagonal(player2Score);

    if (player2Winner) {
        console.log('Player 2 wins click play again to resume');
        return true;
    }
    return false;
}

function checkForRowColumn(array) {
    if (array.length > 2) {
        var one = 0;
        var two = 0;
        var three = 0;
        for (i = 0; i < array.length; i++) {
            if (array[i] == '1')
                one++;
            if (array[i] == '2')
                two++;
            if (array[i] == '3')
                three++;
        }
        if (one == 3 || two == 3 || three == 3)
            return true;

        return false;
    }
    return false;

}

function checkForDiagonal(playerScore) {
    if (playerScore.length > 2) {
        if (playerScore.indexOf('1.1') > -1 && playerScore.indexOf('2.2') > -1 && playerScore.indexOf('3.3') > -1)
            return true;
        if (playerScore.indexOf('1.3') > -1 && playerScore.indexOf('2.2') > -1 && playerScore.indexOf('3.1') > -1)
            return true;
        return false;

    }
}