/*********************************************************** */
// Written by Bobby Ma Term 1 - 2 2022: Game & Firebase Database 
// This is the validaation process behind user regeister for the website 
// By selecting a type of data to validate, then checking aginst the criterias  
// v01: Adding regex to name validation, and finishing name validation
// v02: Adding age validation 
// v03: Adding submit function 
/*********************************************************** */

//Submit Function, validates data then writes to the firebase realtime database
function userSubmit() {
    //Validation 
    console.log("submit");
    var age = validate("age", "i_age", "ageErr");
    var displayName = validate("displayName", "i_displayName", "displayNameErr");

    console.log(age);
    if (age != null && displayName != null) {
        //Writes to the firebase realtime database
        firebase.database().ref('userDetails/' +
            firebase.auth().currentUser.uid + '/registerData').set({
                displayName: displayName,
                age: age,
            });
        //Displays users displayName on the website, and closes the register model
        document.getElementById('welMsg').innerHTML = "Welcome " + displayName;
        document.getElementById('register').style.display = "none";
    }
}

//Validate Function 
function validate(_iType, _iValue, _pValueErr) {
    var displayName = /^[0-9a-zA-z._]{5,16}$/;
    var iValue;
    //Selecting type to validate - displayName
    if (_iType == "displayName") {
        iValue = document.getElementById(_iValue).value;
        console.log("DisplayName:" + iValue);
        if (displayName.test(iValue) == true) {
            //Return validation pass value
            document.getElementById(_pValueErr).innerHTML = null;
            return iValue;
        }
        else {
            //Return validation fail value
            document.getElementById(_pValueErr).innerHTML = "Please enter a valid username using letters, numbers and . (5-16 characters)";
            return;
        }
    }

    //Selecting type to validate - age
    if (_iType == "age") {
        iValue = document.getElementById(_iValue).value;
        console.log("Age:" + iValue);
        if (iValue > 0 && iValue < 100) {
            //Return validation pass value
            document.getElementById(_pValueErr).innerHTML = null;
            return iValue;
        }
        else {
            //Return validation fail value
            document.getElementById(_pValueErr).innerHTML = "Please enter an age between 1-99";
            return;
        }
    }
}