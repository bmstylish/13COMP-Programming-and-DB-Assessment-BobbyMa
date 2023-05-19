// To Do:
// ! EXPAND REGISTRATION FORM 
// 1. Add leaderboard 
// 2. Change Admin to see path
// 3. Update UI to better suit the game 

var gameManager = {};
var gameList = [];
var gameListCount;

function readNum() {
    var guessNum = document.getElementById('guessNum').value;
    document.getElementById('initalNum').style.display = 'none';
    document.getElementById('guessOpp').style.display = 'block';

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
        })
    }
}

// Function to create a new game in Game Lobby
function createGame() {
    firebase.database().ref('game/' + 'GTN/' + 'unActive/' + firebase.auth().currentUser.uid).set({
        oneUID: firebase.auth().currentUser.uid,
        twoUID: '',
        oneDN: sessionStorage.getItem('inGameName'),
        twoDN: '',
        turn: 0,
        win: '',
    });

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
        // Game has started 
        if (snapshot.val() != '') {
            sessionStorage.setItem('gameStart', true);
            document.getElementById("barrierModal").style.display = 'none';
            waitingForNum();
        }
    });
}

// Function to listen for both players to select numbers
function waitingForNum() {
    firebase.database().ref('game/' + 'GTN/' + 'active/' + sessionStorage.getItem('currentGame') + '/').on("value", (snapshot) => {
        const player1 = snapshot.child('oneNum').exists() ? snapshot.child('oneNum').val() : null;
        const player2 = snapshot.child('twoNum').exists() ? snapshot.child('twoNum').val() : null;

        if (player1 && player2) {
            countDown();
            firebase.database().ref('game/' + 'GTN/' + 'active/' + sessionStorage.getItem('currentGame') + '/').off();
            console.log("Gamestars");

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
        //Starts timer for player 1 
        switch (snapshot.val()) {
            case 0:
                if (firebase.auth().currentUser.uid == sessionStorage.getItem('currentGame')) {
                    timer();
                }
                break;
            case 1:
                if (firebase.auth().currentUser.uid != sessionStorage.getItem('currentGame')) {
                    timer();
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
            return;
            /** *********************************** MAKE PLAYER LOSE ****************************************** */
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
    console.log(_joinID);

    document.getElementById("lobbyWrapper").style.display = 'none';
    document.getElementById("GTN").style.display = 'block';

    sessionStorage.setItem('currentGame', _joinID);

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