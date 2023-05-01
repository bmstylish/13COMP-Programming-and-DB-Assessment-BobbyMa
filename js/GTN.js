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

function guessNum(_num) {
    console.log("guessNum");

    firebase.database().ref('game/' + 'GTN/' + 'active/' + sessionStorage.getItem('currentGame') + '/' + 'turn/').once('value', (snapshot) => {
        var turn = snapshot.val();

        if (firebase.auth().currentUser.uid == sessionStorage.getItem('currentGame') && turn == 0) {
            //Player 1 
            firebase.database().ref('game/' + 'GTN/' + 'active/' + sessionStorage.getItem('currentGame') + '/' + 'twoNum/').once('value', (snapshot) => {
                console.log(_num);
                if (_num == snapshot.val()) {
                    console.log("P1 Win")
                }
                else {
                    console.log("P1 lose")
                    firebase.database().ref('game/' + 'GTN/' + 'active/').child(sessionStorage.getItem('currentGame')).update({
                        turn: 1
                    })
                    //CountDown
                    firebase.database().ref('game/' + 'GTN/' + 'active/').child(sessionStorage.getItem('currentGame')).child('turn').on('value', (snapshot) => {
                        countDown();
                    })
                }
            })
        }

        if (firebase.auth().currentUser.uid != sessionStorage.getItem('currentGame') && turn == 1) {
            //Player 2 
            firebase.database().ref('game/' + 'GTN/' + 'active/' + sessionStorage.getItem('currentGame') + '/' + 'oneNum/').once('value', (snapshot) => {
                console.log(_num);
                if (_num == snapshot.val()) {
                    console.log("P2 Win")
                }
                else {
                    console.log("P2 lose")
                    firebase.database().ref('game/' + 'GTN/' + 'active/').child(sessionStorage.getItem('currentGame')).update({
                        turn: 0
                    })
                    //CountDown
                    firebase.database().ref('game/' + 'GTN/' + 'active/').child(sessionStorage.getItem('currentGame')).child('turn').on('value', (snapshot) => {
                        countDown();
                    })
                }
            })
        };

    })
}
GTN.guessNum = guessNum;


function countDown() {
    var timeleft = 10;
    var downloadTimer = setInterval(function() {
        if (timeleft <= 0) {
            clearInterval(downloadTimer);
        }
        document.getElementById("countDown").value = 10 - timeleft;
        timeleft -= 1;
    }, 1000);
}