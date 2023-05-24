/************************************************************/
// Written by Bobby Ma Term 1 - 2 2023: Mutiplayer Game Manager & Firebase Database 
// The main registration functions that regestier user logins and writes to 
// the firebase database, creates local variables for user, eg.score, name 
// v01: Allows user login and user signout  
// v02: Reads userDetails from database 
// v03: Writes to userDetails/user.uid/private, /public, 
// v04: Creates the highscore function 
// v05: Finish highscore update, checks for highscore and updates highscore
// v06: Starts the registration function, creates validate.js 
// v07: Finish validation function inorder, then finished registration function, and updates firebase realtime database 

// 2023 Versions 
// v01: Changed the reg data into html, stops checking for highscore,
//      checking for totalwins instead (including creation of game path), 
//      redirect to reg.html instead of popping up reg modal 
// v02: Added function stats check, to display the 3 core stats on index
//      on load
/*********************************************************** */

//Global Variables 
var mainApp = {};

(function() {
    var firebase = app_firebase;
    //Function to detect on user sign in 
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            const PRIVATEREF = firebase.database().ref('userDetails/' + firebase.auth().currentUser.uid + '/private');
            const PUBLICREF = firebase.database().ref('userDetails/' + firebase.auth().currentUser.uid + '/public');
            const GAMEREF = firebase.database().ref('userDetails/' + firebase.auth().currentUser.uid + '/game');
            sessionStorage.setItem('uid', firebase.auth().currentUser.uid);

            //Write function
            firebase.database().ref('userDetails/' +
                firebase.auth().currentUser.uid + '/game/' + 'GTN/' + 'totalWins/').once('value', (snapshot) => {
                    //Write userData to database if first time visiting site 
                    if (snapshot.exists() != true) {
                        console.log("No Record exists!");

                        PRIVATEREF.set({
                            name: firebase.auth().currentUser.displayName,
                            email: firebase.auth().currentUser.email,
                        });

                        PUBLICREF.set({
                            uid: firebase.auth().currentUser.uid,
                            photoURL: firebase.auth().currentUser.photoURL,
                        });

                        GAMEREF.child('GTN').set({
                            totalWins: 0,
                            WR: 0,
                            Loses: 0
                        })
                    }
                });

            //User Registering Data
            firebase.database().ref('userDetails/' +
                firebase.auth().currentUser.uid + '/registerData/' + '/regName/').on('value', (snapshot) => {
                    if (snapshot.exists()) {
                        console.log("register data exist");
                        sessionStorage.setItem("inGameName", snapshot.val())
                        document.getElementById('welMsg').innerHTML = "Welcome " + sessionStorage.getItem("inGameName");
                    }
                    else {
                        console.log("register data doesn't exist");
                        //Transfers to register 
                        window.location.replace("reg.html");
                    }
                });
        }
        else {
            //Not signed in
            window.location.replace("login.html");
        }

        firebase.database().ref('userRoles/' + 'admin/' + 'uid/').on('value', (snapshot) => {
            var adminUID = snapshot.val();
            if (adminUID == firebase.auth().currentUser.uid) {
                //Only displays for admin users
                document.getElementById('adminButton').style.display = "block";
            }
        });

    });

    //Logout function 
    function logOut() {
        firebase.auth().signOut();
    }
    mainApp.logOut = logOut;

    //Checking for admin UID 
    var once = false;
    function adminCheck() {
        console.log("running");
        var adminUID;
        var userUID = firebase.auth().currentUser.uid;
        const adminRef = firebase.database().ref('userRoles/' + 'admin/' + 'uid/');

        adminRef.on('value', (snapshot) => {
            adminUID = snapshot.val();
            if (adminUID == userUID) {
                //Only displays admin signin for admin users
                alert("You're Admin");
                document.getElementById('adminButton').style.display = "block";

                console.log("admin: " + adminUID);
                console.log("user: " + userUID);
                document.getElementById('adminTable').style.display = 'block';
                if (once == false) {
                    selectAllData();
                    once = true;
                }
            }
            else {
                //Even if accidently displayed, still has procedures
                alert("Access denied");
                console.log("admin: " + adminUID);
                console.log("user: " + userUID);
            }
        });
    }
    mainApp.adminCheck = adminCheck;
})();

//Displays stats on index.html laod
window.onload = statCheck;
function statCheck() {
    var totalWins;
    var totalLoses;

    firebase.database().ref('userDetails/' +
        sessionStorage.getItem('uid') + '/game/' + 'GTN/' + 'totalWins/').once('value', (snapshot) => {
            totalWins = snapshot.val();
            document.getElementById("totalWins").innerHTML = totalWins;
        });

    firebase.database().ref('userDetails/' +
        sessionStorage.getItem('uid') + '/game/' + 'GTN/' + 'Loses/').once('value', (snapshot) => {
            totalLoses = snapshot.val()
            document.getElementById("loss").innerHTML = totalLoses;
        });


    firebase.database().ref('userDetails/' +
        sessionStorage.getItem('uid') + '/game/' + 'GTN/' + 'WR/').once('value', (snapshot) => {
            document.getElementById("WR").innerHTML = snapshot.val();
        });
}
