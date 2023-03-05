/************************************************************/
// Written by Bobby Ma Term 1 - 2 2022: Game & Firebase Database 
// Connecting website to backend firebase realtime database 
// v01: Copy and paste all essential infomation from realtime firebase database 
// to this document(firebase.js)
/************************************************************/

var app_firebase = {};
(function() {
    const firebaseConfig = {
        apiKey: "AIzaSyAac5JUWkgbGFFg0eoueSHqjCk99zAdsoM",
        authDomain: "comp-cd621.firebaseapp.com",
        projectId: "comp-cd621",
        storageBucket: "comp-cd621.appspot.com",
        messagingSenderId: "894172637064",
        appId: "1:894172637064:web:7e5cf88aee0bb94e0bbc3d",
        measurementId: "G-XKSS949QDC"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    app_firebase = firebase;
})()