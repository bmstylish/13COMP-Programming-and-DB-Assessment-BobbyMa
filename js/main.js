/************************************************************/
// Written by Bobby Ma Term 1 - 2 2022: Game & Firebase Database 
// The main registration functions that regestier user logins and writes to 
// the firebase database, creates local variables for user, eg.score, name 
// v01: Allows user login and user signout  
// v02: Reads userDetails from database 
// v03: Writes to userDetails/user.uid/private, /public, 
// v04: Creates the highscore function 
// v05: Finish highscore update, checks for highscore and updates highscore\
// v06: Starts the registration function, creates validate.js 
// v07: Finish validation function inorder, then finished registration function, and updates firebase realtime database 
/*********************************************************** */

//Global Variables 
var mainApp = {};
var highScore;

(function() {
    var firebase = app_firebase;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            //Signed in
            const PRIVATEREF = firebase.database().ref('userDetails/' + firebase.auth().currentUser.uid + '/private');
            const PUBLICREF = firebase.database().ref('userDetails/' + firebase.auth().currentUser.uid + '/public');

            //Write userData to database
            firebase.database().ref('userDetails/' +
                firebase.auth().currentUser.uid + '/public' + '/highscore/').on('value', (snapshot) => {
                    //Writing data for user with existing account
                    if (snapshot.exists()) {
                        console.log("Highscore exists!");
                        highScore = snapshot.val();
                        PRIVATEREF.set({
                            name: firebase.auth().currentUser.displayName,
                            email: firebase.auth().currentUser.email,
                        });

                        PUBLICREF.set({
                            uid: firebase.auth().currentUser.uid,
                            photoURL: firebase.auth().currentUser.photoURL,
                            score: 0,
                            highscore: snapshot.val(),
                        });
                    }
                    else {
                        //Writing data for user without an account
                        console.log("Highscore doesn't exist!");
                        highScore = snapshot.val();
                        PRIVATEREF.set({
                            name: firebase.auth().currentUser.displayName,
                            email: firebase.auth().currentUser.email,
                        });

                        PUBLICREF.set({
                            uid: firebase.auth().currentUser.uid,
                            photoURL: firebase.auth().currentUser.photoURL,
                            score: 0,
                            highscore: 0,
                        });
                    }
                });

            //User Registering Data
            firebase.database().ref('userDetails/' +
                firebase.auth().currentUser.uid + '/registerData').on('value', (snapshot) => {
                    if (snapshot.exists()) {
                        console.log("register data exist");
                        document.getElementById('welMsg').innerHTML = "Welcome " + snapshot.child("displayName").val();
                    }
                    else {
                        console.log("register data doesn't exist");
                        //Displays Register Model
                        document.getElementById('register').style.display = "block";
                        //Sets user profile photo
                        firebase.database().ref('userDetails/' + firebase.auth().currentUser.uid + '/public' + '/photoURL').on('value', (snapshot) => {
                            console.log(snapshot.val());
                            document.getElementById("avatar").src = snapshot.val();
                        });
                        //Sets userName Welcome message 
                        firebase.database().ref('userDetails/' + firebase.auth().currentUser.uid + '/private' + '/name').on('value', (snapshot) => {
                            console.log(snapshot.val());
                            document.getElementById("userName").innerHTML = snapshot.val();
                        });
                    }
                });

            //Sets Highscore and welcome message
            firebase.database().ref('userDetails/' +
                firebase.auth().currentUser.uid + '/public' + '/highscore').on('value', (snapshot) => {
                    document.getElementById("highScore").innerHTML = snapshot.val();
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

    function logOut() {
        firebase.auth().signOut();
    }
    mainApp.logOut = logOut;

    var once = false;
    function adminCheck() {
        console.log("running");
        var adminUID;
        var userUID = firebase.auth().currentUser.uid;
        const adminRef = firebase.database().ref('userRoles/' + 'admin/' + 'uid/');

        adminRef.on('value', (snapshot) => {
            adminUID = snapshot.val();
            if (adminUID == userUID) {
                //Only displays for admin users
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
                //Even if accidently displayed, still has procedures]
                alert("Access denied");
                console.log("admin: " + adminUID);
                console.log("user: " + userUID);
            }
        });
    }
    mainApp.adminCheck = adminCheck;

})();

function scoreUpdate(_value) {
    //Updates active score in database and checks for highscore update
    firebase.database().ref('userDetails/' + firebase.auth().currentUser.uid).child('public').update({ 'score': _value });

    firebase.database().ref('userDetails/' + firebase.auth().currentUser.uid + '/public' + '/highscore/').on('value', (snapshot) => {
        highScore = snapshot.val();
        console.log("highscore: " + highScore);
        if (_value > highScore) {
            firebase.database().ref('userDetails/' + firebase.auth().currentUser.uid).child('public').update({ 'highscore': _value });
        }
    });
}