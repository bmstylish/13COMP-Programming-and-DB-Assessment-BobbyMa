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

    document.getElementById("lobbyWrapper").style.display = 'none';
    document.getElementById("GTN_lobby").style.display = 'none';
    document.getElementById("GTN").style.display = 'block';

    if (sessionStorage.getItem('gameStart') == 'false') {
        document.getElementById("barrierModal").style.display = 'block'
    }
    waitingForGame();
}
gameManager.createGame = createGame;

function waitingForGame() {
    firebase.database().ref('game/' + 'GTN/' + 'unActive/' + firebase.auth().currentUser.uid + '/' + 'twoUID/').on('value', (snapshot) => {
        if (snapshot.val() != '') {
            sessionStorage.setItem('gameStart', true);
            document.getElementById("barrierModal").style.display = 'none';
            waitingForNum();
        }
    });
}

function waitingForNum() {
    firebase.database().ref('game/' + 'GTN/' + 'active/' + sessionStorage.getItem('currentGame') + '/').on("value", (snapshot) =>{
    const player1 = snapshot.child('oneNum').exists() ? snapshot.child('oneNum').val() : null;
    const player2 = snapshot.child('twoNum').exists() ? snapshot.child('twoNum').val() : null;

        if(player1 && player2){
            gameBegin();
        }
    })
}

function gameBegin() {
  console.log('Both child nodes have values!');
}


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
        firebase.database().ref('game/' + 'GTN/' + 'active/').update({
            [_joinID]: currentGame
        });

        firebase.database().ref('game/' + 'GTN/' + 'unActive/' + _joinID + '/').remove();
    }))
    waitingForNum();
}