 /************************************************************/
// Written by Bobby Ma Term 1 - 2 2022: Game & Firebase Database 
// Creates the table, then read all from the database, then presents all using html Table
// Creates, Edit, Add new records into the HTML table as well as the firebase real time database 
// v01: Creating Admin Table
// v02: Table Compeleted, creates new js for table creation functions 
// v03: Simplfying table functions
/************************************************************/
//Global variables 
var dataSelect = {};
var userList = [];
var once = false;
var userListCount;

var modName = document.getElementById('nameMod');
var modDName = document.getElementById('dNameMod');
var modEmail = document.getElementById('emailMod');
var modUid = document.getElementById('uidMod');
var modAge = document.getElementById('ageMod');
var modHighScore = document.getElementById('highScoreMod');

var btnModAdd = document.getElementById('addModBtn');
var btnModUpd = document.getElementById('updModBtn');
var btnModDel = document.getElementById('delModBtn');

//Fills input boxes with data
function fillTboxes(index) {
    if (once == false) {
        userListCount = userList.length;
        userListCount = userListCount - 1;
        once = true;
    }

    if (index == null) {
        modName.value = "";
        modDName.value = "";
        modEmail.value = "";
        modUid.value = "";
        modUid.disabled = false;
        modAge.value = "";
        modHighScore.value = "";
        btnModAdd.style.display = 'inline-block';
        btnModUpd.style.display = 'none';
        btnModDel.style.display = 'none';
        document.getElementById('requiredUid').classList.add('required-field');
    }
    else {
        --index;
        console.log(index);
        modName.value = userList[index][0];
        modDName.value = userList[index][1];
        modEmail.value = userList[index][2];
        modAge.value = userList[index][3];
        modUid.value = userList[index][4];
        modUid.disabled = true;
        modHighScore.value = userList[index][5];
        document.getElementById('requiredUid').classList.remove('required-field');

        btnModAdd.style.display = 'none';
        btnModUpd.style.display = 'inline-block';
        btnModDel.style.display = 'inline-block';
    }
}
dataSelect.fillTboxes = fillTboxes;

//*****************************************  Add User  *****************************************************//
function addUser() {
    userListCount = userListCount + 1;
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

        firebase.database().ref("userDetails/" + modUid.value).child("public").set({
            highscore: modHighScore.value,
            uid: modUid.value,
        }, (error) => {
            if (error) {
                alert("Public record was not added, there was errors");
            }
            else {
                alert("Public record was added");
            }
        });

        firebase.database().ref("userDetails/" + modUid.value).child("registerData").set({
            age: modAge.value,
            displayName: modDName.value,
        },
            (error) => {
                if (error) {
                    alert("Register record was not added, there was errors");
                }
                else {
                    alert("Register record was added");
                }
            });
        selectAllData();
        $("#exampleModalCenter").modal('hide');

    }
    else {
        alert("Please fill in the user UID");
    }
}
dataSelect.addUser = addUser;

//*****************************************  Update User  *****************************************************//
function updUser() {
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

    firebase.database().ref("userDetails/" + modUid.value).child("public").update({
        highscore: modHighScore.value,
    },
        (error) => {
            if (error) {
                alert("Public record was not updated, there was errors");
            }
            else {
                alert("Public record was updated");
            }
        });

    firebase.database().ref("userDetails/" + modUid.value).child("registerData").update({
        age: modAge.value,
        displayName: modDName.value,
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
dataSelect.updUser = updUser;

//*****************************************  Delete User  *****************************************************//
function delUser() {
    //Changing
    userListCount = userListCount - 1;
    firebase.database().ref("userDetails/" + modUid.value).remove().then(
        function() {
            alert("record was deleted");
            selectAllData();
        }
    );
    $("#exampleModalCenter").modal('hide');
}
dataSelect.delUser = delUser;

var userNo;

//Selects all data from Database
function selectAllData() {
    document.getElementById("tbody1").innerHTML = "";
    userNo = 0;
    firebase.database().ref('userDetails').on('value',
        function(AllRecords) {
            AllRecords.forEach(
                function(currentRecord) {
                    var private = currentRecord.val().private;
                    var name = private.name;
                    var email = private.email;

                    var public = currentRecord.val().public;
                    var uid = public.uid;
                    var highScore = public.highscore;

                    var registerData = currentRecord.val().registerData;
                    var displayName;
                    var age;
                    if (registerData != null) {
                        displayName = registerData.displayName;
                        age = registerData.age;
                    }
                    else {
                        displayName = "No Data";
                        age = "No Data";
                    }
                    addItemsToTable(name, displayName, email, age, uid, highScore);
                }
            );
        });
}

function addItemsToTable(name, displayName, email, age, uid, highScore) {

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

    userList.push([name, displayName, email, age, uid, highScore]);

    td0.innerHTML = ++userNo;
    td1.innerHTML = name;
    td2.innerHTML = displayName;
    td3.innerHTML = email;
    td4.innerHTML = age;
    td5.innerHTML = uid;
    td6.innerHTML = highScore;

    td4.style.width = "80px";
    td6.style.width = "80px";

    trow.appendChild(td0);
    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    trow.appendChild(td5);
    trow.appendChild(td6);

    var controlDiv = document.createElement("div");
    controlDiv.innerHTML = '<button type="button" class="btn btn-primary my-2 ml-2" data-toggle="modal" data-target="#exampleModalCenter" onclick="dataSelect.fillTboxes(null)" > Add New Record </button>';
    controlDiv.innerHTML += '<button type="button" class="btn btn-primary my-2 ml-2" data-toggle="modal" data-backdrop="false" data-target="#exampleModalCenter" onclick="dataSelect.fillTboxes(' + userNo + ')"> Edit Record </button>';

    trow.appendChild(controlDiv);
    tbody.appendChild(trow);
}