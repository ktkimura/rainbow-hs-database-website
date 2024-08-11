// Citation for add_student.js functionality:
// Date: 08/09/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 5
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addGradClassForm = document.getElementById('add-grad-class-form-ajax');

// Modify the objects we need
addGradClassForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputGradClass = document.getElementById("input-grad-class");
    let inputPageStart = document.getElementById("input-page-start");
    let inputPageEnd = document.getElementById("input-page-end");

    // Get the values from the form fields
    let gradClassValue = inputGradClass.value;
    let pageStartValue = inputPageStart.value;
    let pageEndValue = inputPageEnd.value;;

    // Put our data we want to send in a javascript object
    let data = {
        gradClassID: gradClassValue,
        pageStart: pageStartValue,
        pageEnd: pageEndValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-grad-class-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputGradClass.value = '';
            inputPageStart.value = '';
            inputPageEnd.value = '';

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

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("gradClass-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let pageStartCell = document.createElement("TD");
    let pageEndCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.id;
    pageStartCell.innerText = newRow.pageStart;
    pageEndCell.innerText = newRow.pageEnd;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function () {
        deletePerson(newRow.id);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(pageStartCell);
    row.appendChild(pageEndCell);
    row.appendChild(deleteCell);

    // Add the row to the table
    currentTable.appendChild(row);
}