// Citation for add_event.js functionality:
// Date: 08/04/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 5
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addEventForm = document.getElementById('add-event-form-ajax');

// Modify the objects we need
addEventForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let eventNameValue = document.getElementById("input-eventName").value;
    let eventDateValue = document.getElementById("input-eventDate").value;
    

    // Put our data we want to send in a javascript object
    let data = {
        eventName: eventNameValue,
        eventDate: eventDateValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-event-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            eventNameValue = '';
            eventDateValue = '';

            location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("events-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let eventNameCell = document.createElement("TD");
    let eventDateCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.id;
    eventNameCell.innerText = newRow.eventName;
    eventDateCell.innerText = newRow.date;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteEvent(newRow.id);
    };
    
    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(eventNameCell);
    row.appendChild(eventDateCell);
    
     // Add a row attribute so the deleteRow function can find a newly added row
     row.setAttribute('data-value', newRow.id);
     
    // Add the row to the table
    currentTable.appendChild(row);
}