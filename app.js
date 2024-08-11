// Citation for app.js setup and CRUD routes:
// Date: 08/01/2024
// Adapted from CS340 2024 Summer Term Node.js starter code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 4022;                 // Set a port number at the top so it's easy to change in the future

// Helpers
const dateFormat = require('handlebars-dateformat');            // for formatting eventDate in MM/DD/YYYY
const Handlebars = require('handlebars');                       
Handlebars.registerHelper('convertNull', function(value) {      // for styling tables to have cells with 'NULL' instead of being blank
    if (value === null){                                        // if there is a NULL value there (studentID and studentName columns)
        return 'NULL';
    } else {
        return value;
    }
});

// Citation for Handlebars Conditional Helper:
// Date: 08/04/2024
// Copied from user "kevlened"'s discussion reply last updated on April 20, 2020 17:20
// Source URL: https://stackoverflow.com/questions/8853396/logical-operator-in-a-handlebars-js-if-conditional
Handlebars.registerHelper({
    eq: (v1, v2) => v1 === v2,
    ne: (v1, v2) => v1 !== v2,
    and() {
        return Array.prototype.every.call(arguments, Boolean);
    },
    or() {
        return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
    }
});

// Express and handlebars imports
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');         // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs", helpers: {dateFormat: dateFormat}}));      // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                     // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Allow Express to parse JSON input and serve static files in public directory
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))


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
/*
    ROUTES
*/
app.get('/', function(req, res){  
    res.render('index');
});    


app.get('/students', function(req, res){  
    let getStudents = `SELECT studentID AS "Student ID", firstName AS "First Name", lastName AS "Last Name", gradClassID AS "Graduating Class" FROM Students ORDER BY studentID;`;
    
    let getGradClasses = `SELECT gradClassID FROM GradClasses ORDER BY gradClassID;`;

    db.pool.query(getStudents, function(error, rows, fields){

        let students = rows;

        db.pool.query(getGradClasses, (error, rows, fields) => {

            let gradClasses = rows;

            return res.render('students', { students: students, gradClasses: gradClasses});
        });
    });
});   

// Citation for add-student-ajax route functionality:
// Date: 08/09/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 5
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

app.post('/add-student-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    if (data.studentID && data.firstName && data.lastName && data.gradClassID) {

        // Create the query and run it on the database
        query1 = `INSERT INTO Students (studentID, firstName, lastName, gradClassID) VALUES ('${data.studentID}', '${data.firstName}', '${data.lastName}', ${data.gradClassID});`;
        db.pool.query(query1, function (error, rows, fields) {

            // Check to see if there was an error
            if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else {
                query2 = `SELECT * FROM Students;`;
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
    }
});


app.put('/put-student-ajax', function(req,res,next){
    let data = req.body;
  
    let studentID = parseInt(data.studentID);
    let gradClassID = parseInt(data.gradClassID);
  
    let queryUpdateStudent = `UPDATE Students SET gradClassID = ? WHERE studentID = ?;`;
  
    db.pool.query(queryUpdateStudent, [gradClassID, studentID], function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            res.send(rows);
        }
  })});

app.get('/gradClasses', function(req, res) {
    let getGradClasses = `SELECT gradClassID AS "Graduating Class Year", pageStart AS "Start Page", pageEnd AS "End Page" FROM GradClasses ORDER BY gradClassID;`;

    db.pool.query(getGradClasses, function(error, rows, fields){
        res.render('gradClasses', {data: rows});
    })
})

// Citation for add-grad-class-ajax route functionality:
// Date: 08/09/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 5
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

app.post('/add-grad-class-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let pageStart = parseInt(data.pageStart);
    if (isNaN(pageStart)) {
        pageStart = 'NULL'
    }

    let pageEnd = parseInt(data.pageEnd);
    if (isNaN(pageEnd)) {
        pageEnd = 'NULL'
    }

    if (data.gradClassID && data.pageStart && data.pageEnd) {
        // Create the query and run it on the database
        query1 = `INSERT INTO GradClasses (gradClassID, pageStart, pageEnd) VALUES ('${data.gradClassID}', ${pageStart}, ${pageEnd})`;
        db.pool.query(query1, function (error, rows, fields) {

            // Check to see if there was an error
            if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else {
                query2 = `SELECT * FROM GradClasses;`;
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
    }
});

app.get('/clubs', function(req, res) {
    let getClubs = `SELECT clubID AS "Club ID", clubName AS "Club Name" FROM Clubs ORDER BY clubID;`;

    db.pool.query(getClubs, function(error, rows, fields){
        res.render('clubs', {data: rows});
    })
})

app.get('/sports', function(req, res) {
    let getSports = `SELECT sportID AS "Sport ID", sportType AS "Sport", season AS "Season", varsityLevel AS "Varsity Level" FROM Sports ORDER BY sportID;`;

    db.pool.query(getSports, function(error, rows, fields){
        res.render('sports', {data: rows});
    })
})

// Citation for add-sport-ajax route functionality:
// Date: 08/09/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 5
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

app.post('/add-sport-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    if (data.sportType && data.season && data.varsityLevel){
        // Create the query and run it on the database
        query1 = `INSERT INTO Sports (sportType, season, varsityLevel) VALUES ('${data.sportType}', '${data.season}', '${data.varsityLevel}');`;
        db.pool.query(query1, function (error, rows, fields) {

            // Check to see if there was an error
            if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else {
                // If there was no error, perform a SELECT * on Sports
                query2 = `SELECT * FROM Sports;`;
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
    }
});

app.get('/events', function(req, res) {
    let getEvents = `SELECT eventID AS "Event ID", eventName AS "Event Name", eventDate AS "Event Date" FROM Events ORDER BY eventID;`;

    db.pool.query(getEvents, function(error, rows, fields){
        res.render('events', {data: rows});
    })
})

app.get('/clubMemberships', function(req, res) {
    let getClubMemberships = `SELECT studentHasClubID, StudentHasClubs.studentID AS "Student ID", CONCAT(Students.firstName, " ", Students.lastName) AS "Student Name", 
        StudentHasClubs.clubID AS "Club ID", Clubs.clubName AS "Club Name", StudentHasClubs.clubRole AS "Club Role", StudentHasClubs.pageNum AS "Page Num." 
            FROM StudentHasClubs
                LEFT JOIN Students ON Students.studentID = StudentHasClubs.studentID
                INNER JOIN Clubs ON Clubs.clubID = StudentHasClubs.clubID
                ORDER BY studentHasClubID;`;

    db.pool.query(getClubMemberships, function(error, rows, fields){
        res.render('clubMemberships', {data: rows});
    })
})

/* 
*   StudentHasSports Page aka Sport Memberships page
*/

// initial page load 
app.get('/sportMemberships', function(req, res) {

    let getSportMemberships = `SELECT studentHasSportID, StudentHasSports.studentID AS "Student ID", CONCAT(Students.firstName, " ", Students.lastName) AS "Student Name", 
        StudentHasSports.sportID AS "Sport ID", CONCAT(Sports.varsityLevel, " ", Sports.sportType) AS "Sport Team", StudentHasSports.sportRole AS "Sport Role", 
        StudentHasSports.pageNum AS "Page Num." 
            FROM StudentHasSports
                LEFT JOIN Students ON Students.studentID = StudentHasSports.studentID
                INNER JOIN Sports ON Sports.sportID = StudentHasSports.sportID
                ORDER BY studentHasSportID;`;

    let getStudentInfo = `SELECT * FROM Students;`;

    let getSportsInfo = `SELECT * FROM Sports;`;

    db.pool.query(getSportMemberships, function(error, rows, fields){
        // res.render('sportMemberships', {data: rows});

        let sportsMemberships = rows;

        db.pool.query(getStudentInfo, (error, rows, fields) => {

            let students = rows;

            db.pool.query(getSportsInfo, (error, rows, fields) => {

                let sports = rows;

                return res.render('sportMemberships', { data: sportsMemberships, students: students, sports: sports});
            })
        })
    })
})

// POST request to add a sports membership
app.post('/add-sports-membership-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // checking if user selected NULL from student dropdown
    let query1;
    let studentID = parseInt(data.studentID);
    if (isNaN(studentID)){  // NULL wasn't being passed in correctly unless I typed it raw into the SQL query, so this is my workaround - Katie
        query1 = `INSERT INTO StudentHasSports (studentID, sportID, sportRole, pageNum) VALUES (NULL, '${data.sportID}', ${data.sportRole}, ${data.pageNum})`;
    } else {
        query1 = `INSERT INTO StudentHasSports (studentID, sportID, sportRole, pageNum) VALUES ('${studentID}', '${data.sportID}', ${data.sportRole}, ${data.pageNum})`;
    }


    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            query2 = `SELECT studentHasSportID, StudentHasSports.studentID AS "Student ID", CONCAT(Students.firstName, " ", Students.lastName) AS "Student Name", 
            StudentHasSports.sportID AS "Sport ID", CONCAT(Sports.varsityLevel, " ", Sports.sportType) AS "Sport Team", StudentHasSports.sportRole AS "Sport Role", 
            StudentHasSports.pageNum AS "Page Num." 
                FROM StudentHasSports
                    LEFT JOIN Students ON Students.studentID = StudentHasSports.studentID
                    INNER JOIN Sports ON Sports.sportID = StudentHasSports.sportID
                    ORDER BY studentHasSportID;`;
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

// DELETE request to remove a sport membership
app.delete('/delete-sport-membership-ajax/', function(req,res,next){
    let data = req.body;
    let sportMembershipID = parseInt(data.id);
    
    let deleteSportMembership = `DELETE FROM StudentHasSports WHERE studentHasSportID = ?`;
  
          // Run the 1st query
          db.pool.query(deleteSportMembership, [sportMembershipID], function(error, rows, fields){
              if (error) {
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
              }
              else
              {
                res.sendStatus(204);
              }
})});

app.get('/eventMemberships', function(req, res) {
    let getEventMemberships = `SELECT studentInEventID, StudentInEvents.studentID AS "Student ID", CONCAT(Students.firstName, " ", Students.lastName) AS "Student Name", 
        StudentInEvents.eventID AS "Event ID", Events.eventName AS "Event Name", StudentInEvents.eventRole AS "Event Role", StudentInEvents.pageNum AS "Page Num." 
            FROM StudentInEvents
                LEFT JOIN Students ON Students.studentID = StudentInEvents.studentID
                INNER JOIN Events ON Events.eventID = StudentInEvents.eventID
                ORDER BY studentInEventID;`;

    db.pool.query(getEventMemberships, function(error, rows, fields){
        res.render('eventMemberships', {data: rows});
    })
})