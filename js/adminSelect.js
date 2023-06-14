/*********************************************************** */
// Written by Bobby Ma Term 1 - 2 2023: Game & Firebase Database 
// Creates the table, then read all from the database, then presents all using html Table
// Creates, Edit, Add new records into the HTML table as well as the firebase real time database 
// v01: Creating Admin Table
// v02: Table Compeleted, creates new js for table creation functions 
// v03: Simplfying table functions

// 2023 Versions
// v01: Added new fields, gender, phone etc. 
// v02: Implmented mods of these new fields so that admin 
//      can change the values
// v03: Added leaderboard mods, for the new paths under game/GTN
/*********************************************************** */

//Global variables 
var adminSelect = {};
var userList = [];
var once = false;
var userListCount;

var modName = document.getElementById('displayNameMod');
var modInGameName = document.getElementById('inGameNameMod');
var modEmail = document.getElementById('emailMod');
var modUid = document.getElementById('uidMod');
var modAge = document.getElementById('ageMod');
var modGender = document.getElementById('genderMod');
var modPhone = document.getElementById('phoneMod');
var modStNum = document.getElementById('stNumMod');
var modStreet = document.getElementById('streetMod');
var modSuburb = document.getElementById('suburbMod');
var modCity = document.getElementById('cityMod');
var modPostcode = document.getElementById('postcodeMod');
var modWins = document.getElementById('winsMod');
var modLoses = document.getElementById('losesMod');

var btnModAdd = document.getElementById('addModBtn');
var btnModUpd = document.getElementById('updModBtn');
var btnModDel = document.getElementById('delModBtn');

//Fills input boxes with data for the admin when editing data
function fillTboxes(index) {
    if (once == false) {
        userListCount = userList.length;
        userListCount = userListCount - 1;
        once = true;
    }

    if (index == null) {
        modName.value = "";
        modInGameName.value = "";
        modEmail.value = "";
        modUid.value = "";
        modUid.disabled = false;
        modAge.value = "";
        modGender.value = "";
        modPhone.value = "";
        modStNum.value = "";
        modStreet.value = "";
        modSuburb.value = "";
        modCity.value = "";
        modPostcode.value = "";
        modWins.value = "";
        modLoses.value = "";
        btnModAdd.style.display = 'inline-block';
        btnModUpd.style.display = 'none';
        btnModDel.style.display = 'none';
        document.getElementById('requiredUid').classList.add('required-field');
    }
    else {
        --index;
        console.log(index);
        modName.value = userList[index][0];
        modInGameName.value = userList[index][1];
        modEmail.value = userList[index][2];
        modAge.value = userList[index][3];
        modGender.value = userList[index][4];
        modPhone.value = userList[index][5];
        modStNum.value = userList[index][6];
        modStreet.value = userList[index][7];
        modSuburb.value = userList[index][8];
        modCity.value = userList[index][9];
        modPostcode.value = userList[index][10];
        modWins.value = userList[index][11];
        modLoses.value = userList[index][12];
        modUid.value = userList[index][13];
        modUid.disabled = true;
        document.getElementById('requiredUid').classList.remove('required-field');

        btnModAdd.style.display = 'none';
        btnModUpd.style.display = 'inline-block';
        btnModDel.style.display = 'inline-block';
    }
}
adminSelect.fillTboxes = fillTboxes;

//*****************************************  Add User  *****************************************************//
function addUser() {
    userListCount = userListCount + 1;
    // ********** Adding Private ********** // 
    if (modUid.value != "") {
        firebase.database().ref("userDetails/" + modUid.value).child("private").set({
            email: modEmail.value,
            name: modName.value,
        }, (error) => {
            if (error) {
                alert("Private record was not added, there was errors");
            }
            else {
                alert("Private record was added");
            }
        });

        // ********** Adding Private ********** // 
        firebase.database().ref("userDetails/" + modUid.value).child("public").set({
            uid: modUid.value,
        }, (error) => {
            if (error) {
                alert("Public record was not added, there was errors");
            }
            else {
                alert("Public record was added");
            }
        });

        // ********** Adding Register ********** // 
        firebase.database().ref("userDetails/" + modUid.value).child("registerData").set({
            regName: modInGameName.value,
            age: parseInt(modAge.value),
            gender: modGender.value,
            phone: parseInt(modPhone.value),
            stNum: modStNum.value,
            street: modStreet.value,
            suburb: modSuburb.value,
            city: modCity.value,
            postcode: modPostcode.value
        },
            (error) => {
                if (error) {
                    alert("Register record was not added, there was errors");
                }
                else {
                    alert("Register record was added");
                }
            });

        // ********** Adding Game Data ********** // 
        firebase.database().ref("userDetails/" + modUid.value + "/game/").child("GTN").set({
            totalWins: parseInt(modWins.value),
            Loses: parseInt(modLoses.value),
            WR: ''
        },
            (error) => {
                if (error) {
                    alert("Game record was not added, there was errors");
                }
                else {
                    alert("Game record was added");
                }
            });

        // ********** Adding leaderboard Data ********** // 
        firebase.database().ref('game/' + 'GTN/' + 'leaderboard/' + modUid.value).set({
            IGN: modInGameName.value,
            totalWins: parseInt(modWins.value),
            Loses: parseInt(modLoses.value),
            WR: ''
        })

        selectAllData();
        $("#exampleModalCenter").modal('hide');

    }
    else {
        alert("Please fill in the user UID");
    }
}
adminSelect.addUser = addUser;

//*****************************************  Update User  *****************************************************//
function updUser() {
    // ********** Updating Private ********** // 
    firebase.database().ref("userDetails/" + modUid.value).child("private").update({
        email: modEmail.value,
        name: modName.value,
    },
        (error) => {
            if (error) {
                alert("private record was not updated, there was errors");
            }
            else {
                alert("private record was updated");
            }
        });
    // ********** Updating Game data ********** // 
    firebase.database().ref("userDetails/" + modUid.value + "/game/").child("GTN").update({
        totalWins: parseInt(modWins.value),
        Loses: parseInt(modLoses.value)
    },
        (error) => {
            if (error) {
                alert("Game record was not updated, there was errors");
            }
            else {
                alert("game record was updated");
            }
        });

    // ********** Leaderboard Game data ********** //
        firebase.database().ref("game/" + 'GTN/' + 'leaderboard/' + modUid.value).update({
        IGN: modInGameName.value,
        totalWins: parseInt(modWins.value),
        Loses: parseInt(modLoses.value)
    },
        (error) => {
            if (error) {
                alert("Leaderboard record was not updated, there was errors");
            }
            else {
                alert("Leaderboard record was updated");
            }
        });

    // ********** Updating Register ********** // 
    firebase.database().ref("userDetails/" + modUid.value).child("registerData").update({
        regName: modInGameName.value,
        age: parseInt(modAge.value),
        gender: modGender.value,
        phone: parseInt(modPhone.value),
        stNum: modStNum.value,
        street: modStreet.value,
        suburb: modSuburb.value,
        city: modCity.value,
        postcode: modPostcode.value
    },
        (error) => {
            if (error) {
                alert("Register record was not updated, there was errors");
            }
            else {
                alert("Register record was updated");
            }
        });
    selectAllData();

    $("#exampleModalCenter").modal('hide');
}
adminSelect.updUser = updUser;

//*****************************************  Delete User  *****************************************************//
function delUser() {
    //Changing user count
    userListCount = userListCount - 1;
    console.log(modUid.value);
    firebase.database().ref("userDetails/" + modUid.value).remove().then(
        function() {
            alert("record was deleted");
            selectAllData();
        }
    );
    firebase.database().ref('game/' + 'GTN/' + 'leaderboard/' + modUid.value).remove();
    $("#exampleModalCenter").modal('hide');
}
adminSelect.delUser = delUser;

var userNo;

//Selects all data from Database
function selectAllData() {
    document.getElementById("tbody1").innerHTML = "";
    userNo = 0;
    firebase.database().ref('userDetails').once('value',
        function(AllRecords) {
            AllRecords.forEach(
                function(currentRecord) {
                    var private = currentRecord.val().private;
                    var name = private.name;
                    var email = private.email;

                    var public = currentRecord.val().public;
                    var uid = public.uid;

                    var registerData = currentRecord.val().registerData;
                    var inGameName;
                    var age;
                    var gender;
                    var phone;
                    var stNum;
                    var street;
                    var suburb;
                    var city;
                    var postcode;
                    if (registerData != null) {
                        inGameName = registerData.regName;
                        age = registerData.age;
                        gender = registerData.gender;
                        phone = registerData.phone;
                        stNum = registerData.stNum;
                        street = registerData.street;
                        suburb = registerData.suburb;
                        city = registerData.city;
                        postcode = registerData.postcode;
                    }
                    else {
                        inGameName = "No Data";
                        age = "No Data";
                        gender = "No Data";
                        phone = "No Data";
                        stNum = "No Data";
                        street = "No Data";
                        suburb = "No Data";
                        city = "No Data";
                        postcode = "No Data";
                    }
                    var gameData = currentRecord.val().game;
                    var wins = gameData.GTN.totalWins;
                    var loses = gameData.GTN.Loses;
                    addItemsToTable(name, inGameName, email, age, gender, phone, stNum, street, suburb, city, postcode, wins, loses, uid);
                }
            );
        });
}

function addItemsToTable(name, inGameName, email, age, gender, phone, stNum, street, suburb, city, postcode, wins, loses, uid) {

    while (userList.length > userListCount) {
        console.log("While Loop running");
        console.log(userList);
        userList.splice(0, 1);
    }

    var tbody = document.getElementById('tbody1');
    var trow = document.createElement('tr');
    var td0 = document.createElement('td');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    var td5 = document.createElement('td');
    var td6 = document.createElement('td');
    var td7 = document.createElement('td');
    var td8 = document.createElement('td');
    var td9 = document.createElement('td');
    var td10 = document.createElement('td');
    var td11 = document.createElement('td');
    var td12 = document.createElement('td');
    var td13 = document.createElement('td');
    var td14 = document.createElement('td');

    userList.push([name, inGameName, email, age, gender, phone, stNum, street, suburb, city, postcode, wins, loses, uid]);

    td0.innerHTML = ++userNo;
    td1.innerHTML = name;
    td2.innerHTML = inGameName;
    td3.innerHTML = email;
    td4.innerHTML = age;
    td5.innerHTML = gender;
    td6.innerHTML = phone;
    td7.innerHTML = stNum;
    td8.innerHTML = street;
    td9.innerHTML = suburb;
    td10.innerHTML = city;
    td11.innerHTML = postcode;
    td12.innerHTML = wins;
    td13.innerHTML = loses;
    td14.innerHTML = uid;

    trow.appendChild(td0);
    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    trow.appendChild(td5);
    trow.appendChild(td6);
    trow.appendChild(td7);
    trow.appendChild(td8);
    trow.appendChild(td9);
    trow.appendChild(td10);
    trow.appendChild(td11);
    trow.appendChild(td12);
    trow.appendChild(td13);
    trow.appendChild(td14);

    var controlDiv = document.createElement("div");
    controlDiv.innerHTML = '<button type="button" class="btn btn-primary my-2 ml-2" data-toggle="modal" data-target="#exampleModalCenter" onclick="adminSelect.fillTboxes(null)" > Add New Record </button>';
    controlDiv.innerHTML += '<button type="button" class="btn btn-primary my-2 ml-2" data-toggle="modal" data-backdrop="false" data-target="#exampleModalCenter" onclick="adminSelect.fillTboxes(' + userNo + ')"> Edit Record </button>';

    trow.appendChild(controlDiv);
    tbody.appendChild(trow);
}