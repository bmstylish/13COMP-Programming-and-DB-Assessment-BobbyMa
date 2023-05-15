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

        //Redirects back to homepage 
        //setTimeout(redirect, 5000);
    }
    else {
        document.getElementById('status').innerHTML = "Lose";
        sessionStorage.removeItem('currentGame');

        //Redirects back to homepage
        //setTimeout(redirect, 5000);
    }
}

function redirect (){
    window.location.href = "/index.html"
}