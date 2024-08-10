// Citation for add_sport.js functionality:
// Date: 08/09/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 5
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
let addPersonForm = document.getElementById('add-sport-form-ajax');

// Modify the objects we need
addPersonForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputSportType = document.getElementById("input-sport-type");
    let inputSeason = document.getElementById("input-season");
    let inputVarsityLevel = document.getElementById("input-varsity-level");

    // Get the values from the form fields
    let sportTypeValue = inputSportType.value;
    let seasonValue = inputSeason.value;
    let varsityLevelValue = inputVarsityLevel.value;

    // Put our data we want to send in a javascript object
    let data = {
        sportType: sportTypeValue,
        season: seasonValue,
        varsityLevel: varsityLevelValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-sport-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputSportType.value = '';
            inputSeason.value = '';
            inputVarsityLevel.value = '';

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
    let currentTable = document.getElementById("sport-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let sportTypeCell = document.createElement("TD");
    let seasonCell = document.createElement("TD");
    let varsityLevelCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.id;
    sportTypeCell.innerText = newRow.sportType;
    seasonCell.innerText = newRow.season;
    varsityLevelCell.innerText = newRow.varsityLevel;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(sportTypeCell);
    row.appendChild(seasonCell);
    row.appendChild(varsityLevelCell);

    // Add the row to the table
    currentTable.appendChild(row);
}