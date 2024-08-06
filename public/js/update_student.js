// Citation for update_student.js functionality:
// Date: 08/05/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 8
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// get update form
let updateStudentForm = document.getElementById('update-student-form-ajax');

// modify objects we need
updateStudentForm.addEventListener("submit", function (e) {
    // prevent form from submitting
    e.preventDefault();

    // get form fields we need to get data from
    let inputStudent = document.getElementById('studentSelect');
    let inputGradClass = document.getElementById('gradClassSelect');

    // get values from form fields
    let studentValue = inputStudent.value;
    let gradClassValue = inputGradClass.value;

    // put data to send in javascript object
    let data = {
        studentID: studentValue,
        gradClassID: gradClassValue
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-student-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, studentValue);

            location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

function updateRow(data, studentID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("student-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == studentID) {

            // Get the location of the row where we found the matching student ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of gradClass value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign gradClass to our value we updated to
            td.innerHTML = parsedData.gradClassID; 
       }
    }
}