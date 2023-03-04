/************************************************************/ 
// Written by Bobby Ma Term 1 - 2 2022: Game & Firebase Database 
// Connecting website to backend firebase realtime database 
// v01: Copy and paste all essential infomation from realtime firebase database 
// to this document(firebase.js)
/************************************************************/ 

var app_firebase = {};
(function(){
    const firebaseConfig = {
      apiKey: "AIzaSyDMtiSbtW6tbfKKmqFQ3R3GVfyUolIfjpk",
      authDomain: "comp-2022-bobby.firebaseapp.com",
      databaseURL: "https://comp-2022-bobby-default-rtdb.firebaseio.com",
      projectId: "comp-2022-bobby",
      storageBucket: "comp-2022-bobby.appspot.com",
      messagingSenderId: "419493940660",
      appId: "1:419493940660:web:a6c1dffaf142219885b6e1",
      measurementId: "G-JDRL0M7M15"
      };
    
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      app_firebase = firebase;
})()