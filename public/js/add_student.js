// Citation for add_student.js functionality:
// Date: 08/09/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 5
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addStudentForm = document.getElementById('add-student-form-ajax');

// Modify the objects we need
addStudentForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputStudentID = document.getElementById("input-studentID");
    let inputFirstName = document.getElementById("input-fname");
    let inputLastName = document.getElementById("input-lname");
    let inputGradClass = document.getElementById("input-grad-class");

    // Get the values from the form fields
    let studentIDValue = inputStudentID.value;
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let gradClassValue = inputGradClass.value;

    // Put our data we want to send in a javascript object
    let data = {
        studentID: studentIDValue,
        firstName: firstNameValue,
        lastName: lastNameValue,
        gradClassID: gradClassValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-student-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputStudentID.value = '';
            inputFirstName.value = '';
            inputLastName.value = '';
            inputGradClass.value = '';

            location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


addRowToTable = (data) => {

    let currentTable = document.getElementById("student-table");

    let newRowIndex = currentTable.rows.length;

    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let firstNameCell = document.createElement("TD");
    let lastNameCell = document.createElement("TD");
    let gradClassCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.id;
    firstNameCell.innerText = newRow.fname;
    lastNameCell.innerText = newRow.lname;
    gradClassCell.innerText = newRow.gradClassID;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function () {
        deletePerson(newRow.id);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(gradClassCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);
}