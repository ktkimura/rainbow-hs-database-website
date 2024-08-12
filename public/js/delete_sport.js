// Citation for delete_sport.js functionality:
// Date: 08/09/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 7
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

function deleteSport(sportID) {
    // Put our data we want to send in a javascript object
    let data = {
        sportID: sportID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-sport-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(sportID);
            location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(sportID) {

    let table = document.getElementById("sport-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == sportID) {
            table.deleteRow(i);
            break;
        }
    }
}