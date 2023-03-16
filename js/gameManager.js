var gameManager = {};
var gameList = [];
var gameListCount;

function createGame() {
    firebase.database().ref('game/' + 'TTT/' + firebase.auth().currentUser.uid).set({
        oneUID: firebase.auth().currentUser.uid,
        twoUID: '',
        oneDN: sessionStorage.getItem('inGameName'),
        twoDN: '',
        gameStart: false,
        turn: 0
    });
    sessionStorage.setItem('gameStart', false);
    
    document.getElementById("lobbyWrapper").style.display = 'none';
    document.getElementById("TTT_lobby").style.display = 'none';
    document.getElementById("TTT").style.display = 'block';
    
    if (sessionStorage.getItem('gameStart') == 'false') {
        document.getElementById("barrierModal").style.display = 'block'
    }

}
gameManager.createGame = createGame;

function selectAllGame() {
    console.log("Select All id");
    document.getElementById("ttt_tablebody").innerHTML = "";
    firebase.database().ref('game/' + 'TTT/').once('value',
        function(AllRecords) {
            AllRecords.forEach(
                function(currentRecord) {
                    console.log("Current Record:")
                    console.log(currentRecord)
                    
                    var refGameUID = currentRecord.val();                
                    
                    var gameName = refGameUID.oneDN + "'s game";
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
    var tbody = document.getElementById('ttt_tablebody');
    var trow = document.createElement('tr');
    var td0 = document.createElement('td');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var join = document.createElement('button')

    console.log("gameName:")
    console.log(gameName)

    td0.innerHTML = gameName;
    td1.innerHTML = '1/2';
    join.type = 'button'
    join.innerHTML = 'Join'
    join.value = oneID;
    join.setAttribute("onclick",`joinGame("${oneID}")` )

    gameList.push([gameName, oneID, oneDN, twoID, twoDN, gameStatus]);

    td2.appendChild(join);
    trow.appendChild(td0);
    trow.appendChild(td1);
    trow.appendChild(td2);

    tbody.appendChild(trow);
};

function joinGame(_joinID){
    console.log(_joinID);
    
    document.getElementById("lobbyWrapper").style.display = 'none';
    document.getElementById("TTT_lobby").style.display = 'none';
    document.getElementById("TTT").style.display = 'block';

    firebase.database().ref('game/' + 'TTT/').child(_joinID).update({
        twoDN: sessionStorage.getItem('inGameName'),
        twoUID: sessionStorage.getItem('uid')
    })
}