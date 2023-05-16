/*********************************************************** */
// Written by Bobby Ma Term 1 - 2 2023: Mutiplayer Game Manager & Firebase Database 
// 15/5 v01: Created js
/*********************************************************** */

//Onload function
window.onload = winLose;

function winLose() {
    if (sessionStorage.getItem('status') == 'win') {
        document.getElementById('status').innerHTML = "Win";

        //Deletes finished game record 
        firebase.database().ref('game/' + 'GTN/' + 'active/' + sessionStorage.getItem('currentGame') + '/').remove();

        //Resetting local storage data 
        sessionStorage.removeItem('status');
        sessionStorage.removeItem('currentGame');

        firebase.database().ref('userDetails/' +
            sessionStorage.getItem('uid') + '/game/').child('GTN').update({
                totalWins: firebase.database.ServerValue.increment(1)
            });

        calculateWinRate();

        //Redirects back to homepage 
        setTimeout(redirect, 5000);
    }
    else {
        document.getElementById('status').innerHTML = "Lose";

        firebase.database().ref('userDetails/' +
            sessionStorage.getItem('uid') + '/game/').child('GTN').update({
                Loses: firebase.database.ServerValue.increment(1)
            });
        //Resetting local storage data 
        sessionStorage.removeItem('currentGame');


        calculateWinRate();
        //Redirects back to homepage
        setTimeout(redirect, 5000);
    }
}

function redirect() {
    window.location.href = "/index.html"
}

function calculateWinRate() {
    var totalWins;
    var totalLosses;

    // Retrieve total wins
    var winsPromise = firebase.database().ref('userDetails/' + sessionStorage.getItem('uid') + '/game/GTN/totalWins/').once('value')
        .then(snapshot => {
            totalWins = snapshot.val();
        });

    // Retrieve total losses
    var lossesPromise = firebase.database().ref('userDetails/' + sessionStorage.getItem('uid') + '/game/GTN/Loses/').once('value')
        .then(snapshot => {
            totalLosses = snapshot.val();
        });

    // Wait for both promises to resolve
    Promise.all([winsPromise, lossesPromise])
        .then(() => {
            if (totalWins == 0 && totalLosses == 0) {
                firebase.database().ref('userDetails/' + sessionStorage.getItem('uid') + '/game/GTN').update({
                    WR: 0
                });
            } else {
                var winRate = (totalWins / (totalWins + totalLosses)) * 100;
                winRate = winRate.toFixed(2);
                firebase.database().ref('userDetails/' + sessionStorage.getItem('uid') + '/game/GTN').update({
                    WR: winRate
                });
            }
        });
}
