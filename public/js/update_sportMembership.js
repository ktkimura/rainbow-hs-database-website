// Citation for update_sportMembership.js functionality:
// Date: 08/09/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 8
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// get update form
let updateSportMembershipForm = document.getElementById('update-sportMembership-form-ajax');

// modify objects we need
updateSportMembershipForm.addEventListener("submit", function (e) {
    // prevent form from submitting
    e.preventDefault();

    // get form fields we need to get data from
    let primaryKey = document.getElementById('studentHasSportID');
    let inputStudent = document.getElementById('studentSelect');
    let inputSportTeam = document.getElementById('sportSelect');
    let inputSportRole = document.getElementById('roleSelect');
    let inputPageNum = document.getElementById('pageNumInput');

    // get values from form fields
    let studentHasSportValue = primaryKey.value;
    let studentValue = inputStudent.value;
    let sportTeamValue = inputSportTeam.value;
    let sportRoleValue = inputSportRole.value;
    let pageNumValue = inputPageNum.value;

    // put data to send in javascript object
    let data = {
        studentHasSportID: studentHasSportValue,
        studentID: studentValue,
        sportID: sportTeamValue,
        sportRole: sportRoleValue,
        pageNum : pageNumValue
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-sport-membership-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let response = JSON.parse(xhttp.responseText);
            window.location.href = response.redirectUrl;
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});