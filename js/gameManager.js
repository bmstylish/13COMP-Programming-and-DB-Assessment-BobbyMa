var gameManager = {};
var gameList;
var gameListCount;

function createGame(){
    firebase.database().ref('game/' + 'TTT/' + firebase.auth().currentUser.uid).set({
        oneUID: firebase.auth().currentUser.uid,
        twoUID: '',
        oneDN: '',
        twoDN: '',
        gameStart: false
    });
}
gameManager.createGame = createGame;

function selectAllGame(){
    document.getElementById("ttt_tablebody").innerHTML = "";
    firebase.database().ref('game/' + 'TTT/').on('value',
        function(AllRecords) {
            console.log("All" + AllRecords)
            AllRecords.forEach(
                function(currentRecord) {
                    console.log(currentRecord)
                    var refGameUID = currentRecord.val();
                    var gameUID = currentRecord..keys(snapshot.val())[0];;
                    
                    var oneID = refGameUID.oneUID;
                    console.log("oneID" + oneID);
                    
                    var oneDN = refGameUID.oneDN;
                    var twoID = refGameUID.twoUID;
                    var twoDN = refGameUID.twoDN;

                    var gameStatus = refGameUID.gameStart;
                    
                    addToGameList(gameUID,oneID,oneDN,twoID,twoDN,gameStatus);
                }
            );
        });
}


function addToGameList(gameUID,oneID,oneDN,twoID,twoDN,gameStatus){

    var tbody = document.getElementById('ttt_tablebody');
    var trow = document.createElement('tr');
    var td0 = document.createElement('td');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');

    td0.innerHTML = gameUID;
    td1.innerHTML = '1/2';
    td2.innerHTML = "join";

    trow.appendChild(td0);
    trow.appendChild(td1);
    trow.appendChild(td2);

    tbody.appendChild(trow);
}