/*********************************************************** */
// Written by Bobby Ma Term 1 - 2 2023: Game & Firebase Database 
// Created in March 
// v01: Added basic GTN interaction with firebase. E.g set inital num, guess num etc 
// v02: Implemented timer function locally with minor bugs
//
// May Updates 
// v03: Added admin select data code for it be able to 
//      select all games in the lobby and write to database 
// v04: Added checkpoints for when both players have entered 
//      the game
// v05: Update timer to chess timer, starts when both players have entered num
// v06: Added win lose update, where local session storage will award the winnner 
//      the win flag 
// v07: Implmeneted lose on countdown end feature & disconnect features for unactive games 
// v08: Fixed bug with disconnect features 
/*********************************************************** */

// To Do:
// 1. Remember to change the variable names
// 2. Update UI to better suit the game 

var gameManager = {};
var gameList = [];
var selfCancel = false;
var waitingForNumRef;

function readNum() {
    var guessNum = document.getElementById('guessNum').value;
    document.getElementById('initalNum').style.display = 'none';
    document.getElementById("guessOpp").style.display = 'block';
    document.getElementById("submit-guess").style.display = 'none';
    document.getElementById("sync").innerHTML = "Waiting for Oppnent...";
    document.getElementById("initalGuessNum").innerHTML = guessNum;

    if (sessionStorage.getItem('currentGame') == firebase.auth().currentUser.uid) {
        //Player 1 
        // check for has child
        firebase.database().ref('game/' + 'GTN/' + 'active/').child(sessionStorage.getItem('currentGame')).update({
            oneNum: guessNum
        });
    }
    else {
        //Player 2 
        firebase.database().ref('game/' + 'GTN/' + 'active/').child(sessionStorage.getItem('currentGame')).update({
            twoNum: guessNum
        });
    }
}

// Function to create a new game in Game Lobby
function createGame() {
    selfCancel = false;

    firebase.database().ref('game/' + 'GTN/' + 'unActive/' + firebase.auth().currentUser.uid).set({
        oneUID: firebase.auth().currentUser.uid,
        twoUID: '',
        oneDN: sessionStorage.getItem('inGameName'),
        twoDN: '',
        turn: 0,
        win: '',
    });

    //Add on disconnect watcher 
    window.addEventListener('beforeunload', function() {
        //Deletes created game on disconnect 
        firebase.database().ref('game/' + 'GTN/' + 'unActive/' + firebase.auth().currentUser.uid).remove();
    })

    sessionStorage.setItem('gameStart', false);
    sessionStorage.setItem('currentGame', firebase.auth().currentUser.uid);

    // Hide lobby elements and show the game interface
    document.getElementById("lobbyWrapper").style.display = 'none';
    document.getElementById("GTN_lobby").style.display = 'none';
    document.getElementById("GTN").style.display = 'block';

    if (sessionStorage.getItem('gameStart') == 'false') {
        document.getElementById("barrierModal").style.display = 'block'
    }
    waitingForGame();
}
gameManager.createGame = createGame;

// Function to listen for the second player to join the game
function waitingForGame() {
    firebase.database().ref('game/' + 'GTN/' + 'unActive/' + firebase.auth().currentUser.uid + '/' + 'twoUID/').on('value', (snapshot) => {
        // P1 Watcher for Game has started 
        if (snapshot.val() != '') {
            sessionStorage.setItem('gameStart', true);
            document.getElementById("barrierModal").style.display = 'none';
            document.getElementById("notification").style.display = 'block'
            setTimeout(function() {
                document.getElementById("notification").style.display = 'none'
            }, 3000)
            waitingForNum();
        }
    });
    //Execute when the button is clicked
    document.getElementById("cancelLobby").addEventListener("click", function() {
        firebase.database().ref('game/' + 'GTN/' + 'unActive/' + firebase.auth().currentUser.uid).remove();
        sessionStorage.removeItem('currentGame');
        document.getElementById("GTN").style.display = 'none';

        document.getElementById("lobbyWrapper").style.display = 'block';
        document.getElementById("GTN_lobby").style.display = 'block';
        selectAllGame();
        selfCancel = true;
    });
}

// Function to listen for both players to select numbers
function waitingForNum() {
    console.log("waitingForNum")

    firebase.database().ref('game/' + 'GTN/' + 'active/' + sessionStorage.getItem('currentGame') + '/').once('value').then((snapshot) => {
        if (sessionStorage.getItem('uid') == sessionStorage.getItem('currentGame')) {
            document.getElementById('oppName').innerHTML = snapshot.val().twoDN;
        }
        else {
            document.getElementById('oppName').innerHTML = snapshot.val().oneDN;
        }
    })

    //Returns function on player1 deleting lobby
    if (selfCancel) {
        return;
    }

    firebase.database().ref('game/' + 'GTN/' + 'active/' + sessionStorage.getItem('currentGame') + '/').on("value", (snapshot) => {
        //Returns function on player1 deleting lobby
        if (selfCancel) {
            return;
        }

        const player1 = snapshot.child('oneNum').exists() ? snapshot.child('oneNum').val() : null;
        const player2 = snapshot.child('twoNum').exists() ? snapshot.child('twoNum').val() : null;

        //Gives time for the active record to be written .5 seconds before checking if exists
        //Disconnect observer
        setTimeout(function() {
            firebase.database().ref('game/' + 'GTN/' + 'active/' + sessionStorage.getItem('currentGame') + '/').on("value", (snapshot) => {
                //Returns function on player1 deleting lobby
                if (selfCancel) {
                    return;
                }
                else if (snapshot.exists() != true) {
                    //Display message
                    setTimeout(function() {
                        document.getElementById('notiMessage').innerHTML = "Opponent has disconnected";
                        document.getElementById('notification').style.display = 'block';
                    }, 1000)
                    //Disconnects the other player if one player disconnects
                    setTimeout(function() {
                        location.reload();
                    }, 2000)
                }
            })
        }, 500)

        //Deletes previous eventlistner on the Unactive game path on disconnect 
        window.removeEventListener('beforeunload', function() {
            firebase.database().ref('game/' + 'GTN/' + 'unActive/' + firebase.auth().currentUser.uid).remove();
        })
        //Adds new event listener to delete active record
        window.addEventListener('beforeunload', function() {
            firebase.database().ref('game/' + 'GTN/' + 'active/' + sessionStorage.getItem('currentGame')).remove()
        });

        if (player1 && player2) {
            countDown();
            document.getElementById("sync").innerHTML = '';
            firebase.database().ref('game/' + 'GTN/' + 'active/' + sessionStorage.getItem('currentGame') + '/').off();
            console.log("Gamestarts");

            //Win Condition Readon Observer  
            firebase.database().ref('game/' + 'GTN/' + 'active/' + sessionStorage.getItem('currentGame') + '/' + 'win/').on('value', (snapshot) => {
                if (snapshot.val() == "P1") {
                    console.log("P1 Wins");
                    window.location.href = "/win_lose.html";
                    if (sessionStorage.getItem('currentGame') == firebase.auth().currentUser.uid) {
                        sessionStorage.setItem('status', 'win');
                    }
                }
                else if (snapshot.val() == "P2") {
                    console.log("P2 Wins");
                    if (sessionStorage.getItem('currentGame') != firebase.auth().currentUser.uid) {
                        sessionStorage.setItem('status', 'win');
                    }
                    window.location.href = "/win_lose.html";
                }
            });
        }
    });
}

//Function to guessed num to determine win or lose 
function guessNum(_num) {
    console.log("guessNum");

    firebase.database().ref('game/' + 'GTN/' + 'active/' + sessionStorage.getItem('currentGame') + '/' + 'turn/').once('value', (snapshot) => {
        var turn = snapshot.val();

        if (firebase.auth().currentUser.uid == sessionStorage.getItem('currentGame') && turn == 0) {
            //Player 1 
            firebase.database().ref('game/' + 'GTN/' + 'active/' + sessionStorage.getItem('currentGame') + '/' + 'twoNum/').once('value', (snapshot) => {
                console.log(_num);
                if (_num == snapshot.val()) {
                    firebase.database().ref('game/' + 'GTN/' + 'active/').child(sessionStorage.getItem('currentGame')).update({
                        win: 'P1'
                    });
                }
                else {
                    console.log("P1 lose")
                    document.getElementById("submit-guess").style.display = 'none';
                    //Update turn 
                    firebase.database().ref('game/' + 'GTN/' + 'active/').child(sessionStorage.getItem('currentGame')).update({
                        turn: 1
                    });
                    //Clear input field
                    document.getElementById('guessOppNum').value = '';
                }
            });
        };

        if (firebase.auth().currentUser.uid != sessionStorage.getItem('currentGame') && turn == 1) {
            //Player 2 
            firebase.database().ref('game/' + 'GTN/' + 'active/' + sessionStorage.getItem('currentGame') + '/' + 'oneNum/').once('value', (snapshot) => {
                console.log(_num);
                if (_num == snapshot.val()) {
                    //Update P2 win 
                    firebase.database().ref('game/' + 'GTN/' + 'active/').child(sessionStorage.getItem('currentGame')).update({
                        win: 'P2'
                    });
                }
                else {
                    console.log("P2 lose")
                    document.getElementById("submit-guess").style.display = 'none';
                    //Update turn 
                    firebase.database().ref('game/' + 'GTN/' + 'active/').child(sessionStorage.getItem('currentGame')).update({
                        turn: 0
                    });
                    //Clear input field
                    document.getElementById('guessOppNum').value = '';
                }
            })
        };

    })
}
GTN.guessNum = guessNum;

// Function to count down play time during player guess
function countDown() {
    firebase.database().ref('game/' + 'GTN/' + 'active/' + sessionStorage.getItem('currentGame') + '/' + 'turn/').on('value', (snapshot => {

        switch (snapshot.val()) {
            case 0:
                //Starts timer for player 1 
                if (firebase.auth().currentUser.uid == sessionStorage.getItem('currentGame')) {
                    timer();
                    document.getElementById("submit-guess").style.display = 'block';
                }
                break;
            case 1:
                //Starts timer for player 2
                if (firebase.auth().currentUser.uid != sessionStorage.getItem('currentGame')) {
                    timer();
                    document.getElementById("submit-guess").style.display = 'block';
                }
                break;
        }
    }));

};

//10 Second Timer Function 
function timer() {
    var timeleft = 10;
    var downloadTimer = setInterval(function() {
        if (timeleft <= 0) {
            clearInterval(downloadTimer);
            document.getElementById("countDown").innerHTML = "Finished";
            console.log("Current Player Loses")

            //Makes player lose on time run out 
            if (sessionStorage.getItem('currentGame') == firebase.auth().currentUser.uid) {
                //Player 1 updates P2 win
                firebase.database().ref('game/' + 'GTN/' + 'active/').child(sessionStorage.getItem('currentGame')).update({
                    win: 'P2'
                });
            }
            else {
                //Player 2 updates P1 win
                firebase.database().ref('game/' + 'GTN/' + 'active/').child(sessionStorage.getItem('currentGame')).update({
                    win: 'P1'
                });
            }
        } else {
            document.getElementById("countDown").innerHTML = timeleft + " seconds remaining";
        }
        timeleft -= 1;
    }, 1000);

    // End countdown on guess submit 
    document.getElementById("submit-guess").addEventListener("click", function() {
        clearInterval(downloadTimer);
        console.log("Countdown Ended Early")
        document.getElementById("countDown").innerHTML = "Waiting for Oppnent..."
    });
}

// Function to select all unactive games 
function selectAllGame() {
    console.log("Select All id");
    document.getElementById("GTN_tablebody").innerHTML = "";
    firebase.database().ref('game/' + 'GTN/' + 'unActive/').once('value',
        function(AllRecords) {
            AllRecords.forEach(
                function(currentRecord) {
                    console.log("Current Record:")
                    console.log(currentRecord)

                    var refGameUID = currentRecord.val();

                    var gameName;

                    if (refGameUID.oneDN == null) {
                        return
                    }
                    else {
                        gameName = refGameUID.oneDN + "'s game";
                    }

                    var oneID = refGameUID.oneUID;
                    var oneDN = refGameUID.oneDN;
                    var twoID = refGameUID.twoUID;
                    var twoDN = refGameUID.twoDN;
                    var gameStatus = refGameUID.gameStart;

                    addToGameList(gameName, oneID, oneDN, twoID, twoDN, gameStatus);
                },
            );
        });
}

//Function to display all selected games into HTML page
function addToGameList(gameName, oneID, oneDN, twoID, twoDN, gameStatus) {
    var tbody = document.getElementById('GTN_tablebody');
    var trow = document.createElement('tr');
    var td0 = document.createElement('td');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var join = document.createElement('button')

    console.log("gameName:")
    console.log(gameName)

    td0.innerHTML = gameName;
    td1.innerHTML = '1/2';

    // Check if the game name is null
    // If null, ignore the game and move to the next record
    if (gameName == null) {
        return
    }
    else {
        join.type = 'button'
        join.innerHTML = 'Join'
        join.value = oneID;
        join.setAttribute("onclick", `joinGame("${oneID}")`)
    }

    gameList.push([gameName, oneID, oneDN, twoID, twoDN, gameStatus]);

    td2.appendChild(join);
    trow.appendChild(td0);
    trow.appendChild(td1);
    trow.appendChild(td2);

    tbody.appendChild(trow);
};

// Function for Player two to join a game
function joinGame(_joinID) {
    sessionStorage.setItem('currentGame', _joinID);
    console.log(_joinID);

    document.getElementById("lobbyWrapper").style.display = 'none';
    document.getElementById("GTN").style.display = 'block';

    firebase.database().ref('game/' + 'GTN/' + 'unActive/').child(_joinID).update({
        twoDN: sessionStorage.getItem('inGameName'),
        twoUID: sessionStorage.getItem('uid'),
    })

    firebase.database().ref('game/' + 'GTN/' + 'unActive/' + _joinID).once('value', (snapshot => {
        var currentGame = snapshot.val()
        // Move the game from the unactive games section to the active games
        firebase.database().ref('game/' + 'GTN/' + 'active/').update({
            [_joinID]: currentGame
        });
        //Deletes unactive record 
        firebase.database().ref('game/' + 'GTN/' + 'unActive/' + _joinID + '/').remove();
    }));
    waitingForNum();
}