/*********************************************************** */
// Written by Bobby Ma Term 1 - 2 2023: Mutiplayer Game Manager & Firebase Database 
// Created on 22/5
// v01: Able to retrive data successfully, however, 
//      However, due to the nature of firebase method,
//      the value is ascending
// v02: Added reverse function, however rank is not inversed alongside 
// v03: Fixed by getting numChildren() instead of setting default 
/*********************************************************** */
var leaderboard = {};

//Reads all wins related detail and output onto ranking table
function addToBoard() {
    document.getElementById('ranking').style.display = 'block';

    var leaderboardTable = document.getElementById('rankBoard').getElementsByTagName('tbody')[0];

    //Clears existing rows 
    leaderboardTable.innerHTML = '';

    
    firebase.database().ref('game/' + 'GTN/' + 'leaderboard/').orderByChild('totalWins').once("value", function(snapshot) {
        var rank = snapshot.numChildren();

        //Reads and stores data in local variables
        snapshot.forEach(function(userSnapshot) {
            var totalWins = userSnapshot.child("totalWins/").val();
            var inGameName = userSnapshot.child("IGN").val();

            var row = leaderboardTable.insertRow();

            var rankCell = row.insertCell(0);
            var nameCell = row.insertCell(1);
            var winsCell = row.insertCell(2);

            rankCell.textContent = rank;
            nameCell.textContent = inGameName;
            winsCell.textContent = totalWins;

            rank--;
        });

        //Reversing data 
        var rows = Array.from(leaderboardTable.rows);
        rows.reverse();
        leaderboardTable.innerHTML = "";
        rows.forEach(function(row) {
            leaderboardTable.appendChild(row);
        })
    });
}

leaderboard.addToBoard = addToBoard;