// Citation for add_sportMembership.js functionality:
// Date: 08/04/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 5
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addSportMembershipForm = document.getElementById('add-sports-membership-form-ajax');

// Modify the objects we need
addSportMembershipForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let studentIDValue = document.getElementById("input-studentID").value;
    let sportIDValue = document.getElementById("input-sportID").value;
    let sportRoleValue = document.getElementById("input-sport-role").value;
    let pageNumValue = document.getElementById("input-page-number").value;

    if (studentIDValue === 'NULL'){
        studentIDValue = null;
    }

    // Put our data we want to send in a javascript object
    let data = {
        studentID: studentIDValue,
        sportID: sportIDValue,
        sportRole: sportRoleValue,
        pageNum: pageNumValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-sports-membership-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            studentIDValue = '';
            sportIDValue = '';
            sportRoleValue = '';
            pageNumValue = '';

            location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})

// Citation for adding delete button to new rows:
// Date: 08/04/2024
// Copied from CS340 2024 Summer Term Node.js starter code Step 7 (lines 90, 101-105, 114, 117)
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Creates a single row from an Object representing a single record from StudentHasSports
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("sport-memberships-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 6 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let studentIDCell = document.createElement("TD");
    let studentNameCell = document.createElement("TD");
    let sportIDCell = document.createElement("TD");
    let sportRoleCell = document.createElement("TD");
    let pageNumCell = document.createElement("TD");

    // Create a cell for housing the delete button
    let deleteCell = document.createElement("TD")

    // Fill the cells with correct data
    idCell.innerText = newRow.id;
    studentIDCell.innerText = newRow.studentID;
    studentNameCell.innerText = newRow.name;
    sportIDCell.innerText = newRow.sportID;
    sportRoleCell.innerText = newRow.sportRole;
    pageNumCell.innerText = newRow.pageNum;

    // Fill in the delete cell and make it function like a typical delete button
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteSportMembership(newRow.id);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(studentIDCell);
    row.appendChild(studentNameCell);
    row.appendChild(sportIDCell);
    row.appendChild(sportRoleCell);
    row.appendChild(pageNumCell);
    row.appendChild(deleteCell);

    // Add row attribute so deleteRow function can find newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);
}