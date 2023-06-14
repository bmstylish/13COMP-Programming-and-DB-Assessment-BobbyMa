/************************************************************ */
// Written by Bobby Ma Term 1 - 2 2023: Mutiplayer Game Manager & Firebase Database 
// 19/05 v01: Created js - created registration set up page to display authentication side 
//              information onto the registration page 
/************************************************************ */
window.onload = reg_setUp

function reg_setUp() {
    //Sets user profile photo
    firebase.database().ref('userDetails/' + sessionStorage.getItem("uid") + '/public' + '/photoURL/').once('value', (snapshot) => {
        console.log(snapshot.val());
        document.getElementById("avatar").src = snapshot.val();
    });
    //Sets userName Welcome message 
    firebase.database().ref('userDetails/' + sessionStorage.getItem("uid") + '/private' + '/name/').once('value', (snapshot) => {
        console.log(snapshot.val());
        document.getElementById("userName").innerHTML = snapshot.val();
    });
}


