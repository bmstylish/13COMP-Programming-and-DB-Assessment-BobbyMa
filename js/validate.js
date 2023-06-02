/*********************************************************** */
// Written by Bobby Ma Term 1 - 2 2023: Mutiplayer Game Manager & Firebase Database 
// This is the validaation process behind user regeister for the website 
// By selecting a type of data to validate, then checking aginst the criterias  
// v01: Adding regex to name validation, and finishing name validation
// v02: Adding age validation 
// v03: Adding submit function 
// v04: Changing whole of validate function to make it suitable for this 
//      project. 19/05
/*********************************************************** */

function valid_validateForm(event) {
    event.preventDefault();

    const REGNAME = document.getElementById("i_regName").value
    const AGE = document.getElementById("i_age").value
    const GENDER = document.getElementById("i_gender").value
    const PHONE = document.getElementById("i_phone").value
    const STREETNUM = document.getElementById("i_stNum").value
    const STREET = document.getElementById("i_st").value
    const SUBURB = document.getElementById("i_suburb").value
    const CITY = document.getElementById("i_city").value
    const POSTCODE = document.getElementById("i_postcode").value

    let isValid = true;

    if (!REGNAME.match(/^[0-9a-zA-z._]{5,16}$/)) {
        document.getElementById("regNameErr").textContent = "Please enter a valid username using letters, numbers and . (5-16 characters)";
        isValid = false;
    }

    if (isNaN(AGE) || AGE <= 0) {
        document.getElementById("ageErr").textContent = "Please enter a valid age between 1-99";
        isValid = false;
    }

    if (!GENDER) {
        document.getElementById("genderErr").textContent = "Please select a gender";
        isValid = false;
    }

    if (isNaN(PHONE)) {
        document.getElementById("phoneErr").textContent = "Please enter a valid phone number";
        isValid = false;
    }

    if (!STREETNUM.trim()) {
        document.getElementById("stNumErr").textContent = "Please enter a valid street number";
        isValid = false;
    }

    if (!STREET.trim()) {
        document.getElementById("stErr").textContent = "Please enter a valid street name";
        isValid = false;
    }

    if (!SUBURB.trim()) {
        document.getElementById("suburbErr").textContent = "Please enter a valid suburb";
        isValid = false;
    }

    if (!CITY.trim()) {
        document.getElementById("cityErr").textContent = "Please enter a valid city name";
        isValid = false;
    }

    if (!POSTCODE.match(/^\d{4}$/) || isNaN(POSTCODE)) {
        document.getElementById("cityErr").textContent = "Please enter a valid postcode";
        isValid = false;
    }

    if (isValid) {
        //Writes to database and redirect back to index.html
        console.log("valid Input")
        sessionStorage.setItem("inGameName",REGNAME)
        firebase.database().ref('userDetails/' + firebase.auth().currentUser.uid + '/registerData').set({
            regName: REGNAME,
            age: parseInt(AGE),
            gender: GENDER,
            phone: parseInt(PHONE),
            stNum: STREETNUM,
            street: STREET,
            suburb: SUBURB,
            city: CITY,
            postcode: parseInt(POSTCODE)
        });
        
        window.location.replace("index.html");
    }
}