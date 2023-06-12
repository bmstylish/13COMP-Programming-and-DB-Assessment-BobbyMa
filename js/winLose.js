/*********************************************************** */
// Written by Bobby Ma Term 1 - 2 2023: Mutiplayer Game Manager & Firebase Database 
// 15/5 v01: Created js, checks sesssion storage for win condition
// 16/5 v02: Reset default on function called after.
//           Implentmenting winrate calculation function 
// 18/5 v03: Added winrate calculation. Discovered that snapshot.val() returns 
//           promise hence cannot retrive value directly but need to resolve 
//           first. Calculate winrate function working. 
// 24/5 v04: Tried to fix a bug where WR sometimes will be displayed as NaN
//           But think its more of a firebase issue than the code
/*********************************************************** */

//Onload function on 
if (window.location.href.match('win_lose.html')) {
    window.onload = winLose;
}
else if (window.location.href.match('index.html') || window.location.href.match('/')) {
    calculateWinRate();
}

function winLose() {
    console.log("Running winLose")
    if (sessionStorage.getItem('status') == 'win') {
        document.getElementById('status').innerHTML = "Win";

        firebase.database().ref('userDetails/' +
            sessionStorage.getItem('uid') + '/game/').child('GTN').update({
                totalWins: firebase.database.ServerValue.increment(1)
            });

        //Deletes finished game record 
        firebase.database().ref('game/' + 'GTN/' + 'active/' + sessionStorage.getItem('currentGame') + '/').remove();

        //Resetting local storage data 
        sessionStorage.removeItem('status');
        sessionStorage.removeItem('currentGame');
        sessionStorage.removeItem('gameStart');


        calculateWinRate();

        //Redirects back to homepage 
        setTimeout(redirect, 10000);
    }
    else {
        document.getElementById('status').innerHTML = "Lose";

        firebase.database().ref('userDetails/' +
            sessionStorage.getItem('uid') + '/game/').child('GTN').update({
                Loses: firebase.database.ServerValue.increment(1)
            });
        //Resetting local storage data 
        sessionStorage.removeItem('currentGame');
        sessionStorage.removeItem('gameStart');

        calculateWinRate();

        //Redirects back to homepage
        setTimeout(redirect, 10000);
    }
}

function redirect() {
    window.location.href = "/index.html"
}

function calculateWinRate() {
    console.log("calcWinrate")

    // Retrieve total wins
    var winsPromise = firebase.database().ref('userDetails/' + sessionStorage.getItem('uid') + '/game/' + 'GTN/' + 'totalWins/').get('value').then(snapshot => snapshot.val())

    // Retrieve total losses
    var lossesPromise = firebase.database().ref('userDetails/' + sessionStorage.getItem('uid') + '/game/' + 'GTN/' + 'Loses/').get('value').then(snapshot => snapshot.val())

    // Wait for both promises to resolve  
    Promise.all([winsPromise, lossesPromise])
        .then(results => {
            var totalWins = parseInt(results[0]);
            var totalLosses = parseInt(results[1]);

            console.log("totalWins:" + totalWins);
            console.log(totalLosses);

            //Avoids 0/0
            if (totalWins == 0) {
                firebase.database().ref('userDetails/' + sessionStorage.getItem('uid') + '/game/GTN').update({
                    WR: 0
                });
            }
            else {
                var winRate = (totalWins / (totalWins + totalLosses)) * 100;
                winRate = winRate.toFixed(2);
                firebase.database().ref('userDetails/' + sessionStorage.getItem('uid') + '/game/GTN').update({
                    WR: winRate
                });
            }
        })
}
