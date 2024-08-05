// Citation for app.js setup:
// Date: 08/01/2024
// Adapted from CS340 2024 Summer Term Node.js starter code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 4021;                 // Set a port number at the top so it's easy to change in the future

// Access dateFormat handlebars-helper for formatting eventDate
const dateFormat = require('handlebars-dateformat');

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');         // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs", helpers: {dateFormat: dateFormat}}));      // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                     // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Allow Express to parse JSON input and serve static files in public directory
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))


/*
    ROUTES
*/

//ALL PAGE LOADS
app.get('/', function(req, res){  
    res.render('index');
});    


app.get('/students', function(req, res){  
    let getStudents = `SELECT studentID AS "Student ID", firstName AS "First Name", lastName AS "Last Name", gradClassID AS "Graduating Class" FROM Students;`;
             
    db.pool.query(getStudents, function(error, rows, fields){    // Execute the query

        res.render('students', {data: rows});               // Render the students.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});                                                         // received back from the query


app.get('/gradClasses', function(req, res) {
    let getGradClasses = `SELECT gradClassID AS "Graduating Class Year", pageStart AS "Start Page", pageEnd AS "End Page" FROM GradClasses;`;

    db.pool.query(getGradClasses, function(error, rows, fields){
        res.render('gradClasses', {data: rows});
    })
})

app.get('/clubs', function(req, res) {
    let getClubs = `SELECT clubID AS "Club ID", clubName AS "Club Name" FROM Clubs;`;

    db.pool.query(getClubs, function(error, rows, fields){
        res.render('clubs', {data: rows});
    })
})

app.get('/sports', function(req, res) {
    let getSports = `SELECT sportID AS "Sport ID", sportType AS "Sport", season AS "Season", varsityLevel AS "Varsity Level" FROM Sports;`;

    db.pool.query(getSports, function(error, rows, fields){
        res.render('sports', {data: rows});
    })
})

app.get('/events', function(req, res) {
    let getEvents = `SELECT eventID AS "Event ID", eventName AS "Event Name", eventDate AS "Event Date" FROM Events;`;

    db.pool.query(getEvents, function(error, rows, fields){
        res.render('events', {data: rows});
    })
})

app.get('/clubMemberships', function(req, res) {
    let getClubMemberships = `SELECT StudentHasClubs.studentID AS "Student ID", CONCAT(Students.firstName, " ", Students.lastName) AS "Student Name", 
        StudentHasClubs.clubID AS "Club ID", Clubs.clubName AS "Club Name", StudentHasClubs.clubRole AS "Club Role", StudentHasClubs.pageNum AS "Page Num." 
            FROM StudentHasClubs
                INNER JOIN Students ON Students.studentID = StudentHasClubs.studentID
                INNER JOIN Clubs ON Clubs.clubID = StudentHasClubs.clubID;`;

    db.pool.query(getClubMemberships, function(error, rows, fields){
        res.render('clubMemberships', {data: rows});
    })
})

app.get('/sportMemberships', function(req, res) {
    let getSportMemberships = `SELECT StudentHasSports.studentID AS "Student ID", CONCAT(Students.firstName, " ", Students.lastName) AS "Student Name", 
        StudentHasSports.sportID AS "Sport ID", CONCAT(Sports.varsityLevel, " ", Sports.sportType) AS "Sport Team", StudentHasSports.sportRole AS "Sport Role", 
        StudentHasSports.pageNum AS "Page Num." 
            FROM StudentHasSports
                INNER JOIN Students ON Students.studentID = StudentHasSports.studentID
                INNER JOIN Sports ON Sports.sportID = StudentHasSports.sportID;`;

    db.pool.query(getSportMemberships, function(error, rows, fields){
        res.render('sportMemberships', {data: rows});
    })
})

// POST request to add a sports membership
app.post('/add-sports-membership-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let studentID = parseInt(data.studentID);
    if (isNaN(studentID)) {
        studentID = 'NULL'
    }

    let sportID = parseInt(data.sportID);
    if (isNaN(sportID)) {
        sportID = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO StudentHasSports (studentID, sportID, sportRole, pageNum) VALUES ('${data.studentID}', '${data.sportID}', ${data.sportRole}, ${data.pageNum})`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM StudentHasSports;`;
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    res.send(rows);
                }
            })
        }
    })
});

app.get('/eventMemberships', function(req, res) {
    let getEventMemberships = `SELECT StudentInEvents.studentID AS "Student ID", CONCAT(Students.firstName, " ", Students.lastName) AS "Student Name", 
        StudentInEvents.eventID AS "Event ID", Events.eventName AS "Event Name", StudentInEvents.eventRole AS "Event Role", StudentInEvents.pageNum AS "Page Num." 
            FROM StudentInEvents
                INNER JOIN Students ON Students.studentID = StudentInEvents.studentID
                INNER JOIN Events ON Events.eventID = StudentInEvents.eventID;`;

    db.pool.query(getEventMemberships, function(error, rows, fields){
        res.render('eventMemberships', {data: rows});
    })
})





















/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});

/* 
    DATABASE
*/
var db = require('./database/db-connector');
const handlebarsDateformat = require('handlebars-dateformat');
