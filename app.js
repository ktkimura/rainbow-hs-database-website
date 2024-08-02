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

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');         // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));      // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                     // Tell express to use the handlebars engine whenever it encounters a *.hbs file.


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
/*
    ROUTES
*/

app.get('/', function(req, res)
    {  
        res.render('index');
    });    


app.get('/students', function(req, res)
    {  
        let query1 = "SELECT studentID AS 'Student ID', firstName AS 'First Name', lastName AS 'Last Name', gradClassID AS 'Graduating Class' FROM Students;"             

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            res.render('students', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                                         // received back from the query

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});

/* 
    DATABASE
*/
var db = require('./database/db-connector')