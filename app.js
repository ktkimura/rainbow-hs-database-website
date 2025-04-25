// Citation for app.js setup and CRUD routes:
// Date: 08/01/2024
// Adapted from CS340 2024 Summer Term Node.js starter code steps 3-8
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

/*
    SETUP
*/
var express = require("express");
var app = express();
PORT = process.env.PORT || 3000;

/*
    HELPERS
*/
const dateFormat = require("handlebars-dateformat"); // for formatting eventDate in MM/DD/YYYY
const Handlebars = require("handlebars"); // to create custom helpers
Handlebars.registerHelper("convertNull", function (value) {
  // for styling tables to have cells with 'NULL' instead of being blank
  if (value === null) {
    // if there is a NULL value there (studentID and studentName columns)
    return "NULL";
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
  },
});

// Express and handlebars imports
const { engine } = require("express-handlebars");
var exphbs = require("express-handlebars");
app.engine(
  ".hbs",
  engine({ extname: ".hbs", helpers: { dateFormat: dateFormat } })
);
app.set("view engine", ".hbs"); // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Allow Express to parse JSON input and serve static files in public directory
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

/*
    LISTENER
*/
app.listen(PORT, function () {
  console.log(
    "Express started on http://localhost:" +
      PORT +
      "; press Ctrl-C to terminate."
  );
});

/* 
    DATABASE
*/
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error("error connecting to the database:", err.stack);
  } else {
    console.log("connected to the database");
  }
});
/*
    ROUTES
*/

// Home page
app.get("/", function (req, res) {
  res.render("index");
});

// Citation for students route functionality:
// Date: 08/01/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 4
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
app.get("/students", function (req, res) {
  let getStudents = `SELECT studentID AS "Student ID", firstName AS "First Name", lastName AS "Last Name", gradClassID AS "Graduating Class" FROM Students ORDER BY studentID;`;
  let getGradClasses = `SELECT gradClassID FROM GradClasses ORDER BY gradClassID;`;

  db.pool.query(getStudents, function (error, rows, fields) {
    let students = rows;

    db.pool.query(getGradClasses, (error, rows, fields) => {
      let gradClasses = rows;

      return res.render("students", {
        students: students,
        gradClasses: gradClasses,
      });
    });
  });
});

// Citation for add-student-ajax route functionality:
// Date: 08/09/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 5
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
app.post("/add-student-ajax", function (req, res) {
  let data = req.body;

  if (data.studentID && data.firstName && data.lastName && data.gradClassID) {
    query1 = `INSERT INTO Students (studentID, firstName, lastName, gradClassID) VALUES (?, ?, ?, ?);`;
    const values1 = [
      data.studentID,
      data.firstName,
      data.lastName,
      data.gradClassID,
    ];

    db.pool.query(query1, values1, function (error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        query2 = `SELECT * FROM Students;`;
        db.pool.query(query2, function (error, rows, fields) {
          if (error) {
            console.log(error);
            res.sendStatus(400);
          }
          // send back data including new student entry
          else {
            res.send(rows);
          }
        });
      }
    });
  }
});

// Citation for put-student-ajax route functionality:
// Date: 08/05/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 8
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
app.put("/put-student-ajax", function (req, res, next) {
  let data = req.body;

  let studentID = parseInt(data.studentID);
  let gradClassID = parseInt(data.gradClassID);

  let queryUpdateStudent = `UPDATE Students SET gradClassID = ? WHERE studentID = ?;`;

  db.pool.query(
    queryUpdateStudent,
    [gradClassID, studentID],
    function (error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        res.send(rows);
      }
    }
  );
});

// Citation for delete-student-ajax route functionality:
// Date: 08/09/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 7
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
app.delete("/delete-student-ajax/", function (req, res, next) {
  let data = req.body;
  let studentID = parseInt(data.studentID);
  let deleteStudent = `DELETE FROM Students WHERE studentID = ?;`;

  db.pool.query(deleteStudent, [studentID], function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
  });
});

// Citation for gradClasses route functionality:
// Date: 08/01/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 4
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
app.get("/gradClasses", function (req, res) {
  let getGradClasses = `SELECT gradClassID AS "Graduating Class Year", pageStart AS "Start Page", pageEnd AS "End Page" FROM GradClasses ORDER BY gradClassID;`;

  db.pool.query(getGradClasses, function (error, rows, fields) {
    res.render("gradClasses", { data: rows });
  });
});

// Citation for add-grad-class-ajax route functionality:
// Date: 08/09/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 5
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
app.post("/add-grad-class-ajax", function (req, res) {
  let data = req.body;

  // Capture blank inputs and set them to NULL for SQL handling
  let pageStart = parseInt(data.pageStart);
  if (isNaN(pageStart)) {
    pageStart = "NULL";
  }

  let pageEnd = parseInt(data.pageEnd);
  if (isNaN(pageEnd)) {
    pageEnd = "NULL";
  }

  if (data.gradClassID && data.pageStart && data.pageEnd) {
    query1 = `INSERT INTO GradClasses (gradClassID, pageStart, pageEnd) VALUES (?, ?, ?)`;
    values1 = [data.gradClassID, data.pageStart, data.pageEnd];
    db.pool.query(query1, values1, function (error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        query2 = `SELECT * FROM GradClasses;`;
        db.pool.query(query2, function (error, rows, fields) {
          if (error) {
            console.log(error);
            res.sendStatus(400);
          }
          // send back data including new gradClass entry
          else {
            res.send(rows);
          }
        });
      }
    });
  }
});

// Citation for delete-gradClass-ajax route functionality:
// Date: 08/09/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 7
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
app.delete("/delete-gradClass-ajax/", function (req, res, next) {
  let data = req.body;
  let gradClassID = parseInt(data.gradClassID);
  let deleteGradClass = `DELETE FROM GradClasses WHERE gradClassID = ?;`;

  db.pool.query(deleteGradClass, [gradClassID], function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
  });
});

// Citation for clubs route functionality:
// Date: 08/01/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 4
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
app.get("/clubs", function (req, res) {
  let getClubs = `SELECT clubID AS "Club ID", clubName AS "Club Name" FROM Clubs ORDER BY clubID;`;

  db.pool.query(getClubs, function (error, rows, fields) {
    res.render("clubs", { data: rows });
  });
});

// Citation for add-club-ajax route functionality:
// Date: 08/09/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 5
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
app.post("/add-club-ajax", function (req, res) {
  let data = req.body;

  if (data.clubName) {
    query1 = `INSERT INTO Clubs (clubName) VALUES (?);`;
    db.pool.query(query1, [data.clubName], function (error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        query2 = `SELECT * FROM Clubs;`;
        db.pool.query(query2, function (error, rows, fields) {
          if (error) {
            console.log(error);
            res.sendStatus(400);
          }
          // send back data including new club entry
          else {
            res.send(rows);
          }
        });
      }
    });
  }
});

// Citation for delete-club-ajax route functionality:
// Date: 08/09/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 7
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
app.delete("/delete-club-ajax/", function (req, res, next) {
  let data = req.body;
  let clubID = parseInt(data.clubID);
  let deleteClubs = `DELETE FROM Clubs WHERE clubID = ?`;

  db.pool.query(deleteClubs, [clubID], function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
  });
});

// Citation for sports route functionality:
// Date: 08/01/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 4
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
app.get("/sports", function (req, res) {
  let getSports = `SELECT sportID AS "Sport ID", sportType AS "Sport", season AS "Season", varsityLevel AS "Varsity Level" FROM Sports ORDER BY sportID;`;

  db.pool.query(getSports, function (error, rows, fields) {
    res.render("sports", { data: rows });
  });
});

// Citation for add-sport-ajax route functionality:
// Date: 08/09/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 5
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
app.post("/add-sport-ajax", function (req, res) {
  let data = req.body;

  if (data.sportType && data.season && data.varsityLevel) {
    query1 = `INSERT INTO Sports (sportType, season, varsityLevel) VALUES (?, ?, ?);`;
    values1 = [data.sportType, data.season, data.varsityLevel];

    db.pool.query(query1, values1, function (error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        query2 = `SELECT * FROM Sports;`;
        db.pool.query(query2, function (error, rows, fields) {
          if (error) {
            console.log(error);
            res.sendStatus(400);
          }
          // send back data including new sport entry
          else {
            res.send(rows);
          }
        });
      }
    });
  }
});

// Citation for delete-sport-ajax route functionality:
// Date: 08/09/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 7
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
app.delete("/delete-sport-ajax/", function (req, res, next) {
  let data = req.body;
  let sportID = parseInt(data.sportID);
  let deleteSport = `DELETE FROM Sports WHERE sportID = ?;`;

  db.pool.query(deleteSport, [sportID], function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
  });
});

// Citation for events route functionality:
// Date: 08/01/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 4
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
app.get("/events", function (req, res) {
  let getEvents = `SELECT eventID AS "Event ID", eventName AS "Event Name", eventDate AS "Event Date" FROM Events ORDER BY eventID;`;

  db.pool.query(getEvents, function (error, rows, fields) {
    res.render("events", { data: rows });
  });
});

// Citation for add-event-ajax route functionality:
// Date: 08/10/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 5
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
app.post("/add-event-ajax", function (req, res) {
  let data = req.body;

  if (data.eventName && data.eventDate) {
    query1 = `INSERT INTO Events (eventName, eventDate) VALUES (?, ?)`;
    values1 = [data.eventName, data.eventDate];

    db.pool.query(query1, values1, function (error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        // If there was no error, perform a SELECT * on Events
        query2 = `SELECT * FROM Events;`;
        db.pool.query(query2, function (error, rows, fields) {
          if (error) {
            console.log(error);
            res.sendStatus(400);
          }
          // send back data including new event entry
          else {
            res.send(rows);
          }
        });
      }
    });
  }
});

// Citation for delete-event-ajax route functionality:
// Date: 08/10/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 7
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
app.delete("/delete-event-ajax/", function (req, res, next) {
  let data = req.body;
  let eventID = parseInt(data.id);

  let deleteEvent = `DELETE FROM Events WHERE eventID = ?`;

  db.pool.query(deleteEvent, [eventID], function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
  });
});

// Citation for club memberships route functionality:
// Date: 08/01/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 4
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
app.get("/clubMemberships", function (req, res) {
  // grab club memberships with enhanced readability by grabbing student names and club names
  let getClubMemberships = `SELECT studentHasClubID, StudentHasClubs.studentID AS "Student ID", CONCAT(Students.firstName, " ", Students.lastName) AS "Student Name", 
        StudentHasClubs.clubID AS "Club ID", Clubs.clubName AS "Club Name", StudentHasClubs.clubRole AS "Club Role", StudentHasClubs.pageNum AS "Page Num." 
            FROM StudentHasClubs
                LEFT JOIN Students ON Students.studentID = StudentHasClubs.studentID
                INNER JOIN Clubs ON Clubs.clubID = StudentHasClubs.clubID
                ORDER BY studentHasClubID;`;

  let getStudentInfo = `SELECT * FROM Students;`; // for student dropdown population

  let getClubsInfo = `SELECT * FROM Clubs;`; // for club dropdown population

  db.pool.query(getClubMemberships, function (error, rows, fields) {
    let clubMemberships = rows;

    db.pool.query(getStudentInfo, (error, rows, fields) => {
      let students = rows;

      db.pool.query(getClubsInfo, (error, rows, fields) => {
        let clubs = rows;

        return res.render("clubMemberships", {
          data: clubMemberships,
          students: students,
          clubs: clubs,
        });
      });
    });
  });
});

// Citation for add-club-membership-ajax route functionality:
// Date: 08/10/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 5
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
app.post("/add-club-membership-ajax", function (req, res) {
  let data = req.body;

  // checking if user selected NULL from student dropdown
  let studentID = data.studentID ? parseInt(data.studentID) : null;

  query1 = `INSERT INTO StudentHasClubs (studentID, clubID, clubRole, pageNum) VALUES (?, ?, ?, ?)`;

  db.pool.query(
    query1,
    [studentID, data.clubID, data.clubRole, data.pageNum],
    function (error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        query2 = `SELECT studentHasClubID, StudentHasClubs.studentID AS "Student ID", CONCAT(Students.firstName, " ", Students.lastName) AS "Student Name", StudentHasClubs.clubID AS "Club ID", 
                      Clubs.clubName AS "Club Name", StudentHasClubs.clubRole AS "Club Role", StudentHasClubs.pageNum AS "Page Num." 
                        FROM StudentHasClubs
                            LEFT JOIN Students ON Students.studentID = StudentHasClubs.studentID
                            INNER JOIN Clubs ON Clubs.clubID = StudentHasClubs.clubID
                            ORDER BY studentHasClubID;`;
        db.pool.query(query2, function (error, rows, fields) {
          if (error) {
            console.log(error);
            res.sendStatus(400);
          }
          // send back data with new club membership entry
          else {
            res.send(rows);
          }
        });
      }
    }
  );
});

// Citation for delete-club-membership-ajax route functionality:
// Date: 08/10/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 7
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
app.delete("/delete-club-membership-ajax/", function (req, res, next) {
  let data = req.body;
  let clubMembershipID = parseInt(data.id);

  let deleteClubMembership = `DELETE FROM StudentHasClubs WHERE studentHasClubID = ?`;

  db.pool.query(
    deleteClubMembership,
    [clubMembershipID],
    function (error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        res.sendStatus(204);
      }
    }
  );
});

// Citation for sport memberships route functionality:
// Date: 08/01/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 4
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
app.get("/sportMemberships", function (req, res) {
  // grab sport memberships with enhanced readability by grabbing student names and sport teams (varsityLevel + sportType)
  let getSportMemberships = `SELECT studentHasSportID, StudentHasSports.studentID AS "Student ID", CONCAT(Students.firstName, " ", Students.lastName) AS "Student Name", 
        StudentHasSports.sportID AS "Sport ID", CONCAT(Sports.varsityLevel, " ", Sports.sportType) AS "Sport Team", StudentHasSports.sportRole AS "Sport Role", 
        StudentHasSports.pageNum AS "Page Num." 
            FROM StudentHasSports
                LEFT JOIN Students ON Students.studentID = StudentHasSports.studentID
                INNER JOIN Sports ON Sports.sportID = StudentHasSports.sportID
                ORDER BY studentHasSportID;`;

  let getStudentInfo = `SELECT * FROM Students;`; // for student dropdown population
  let getSportsInfo = `SELECT * FROM Sports;`; // for sport team dropdown population

  db.pool.query(getSportMemberships, function (error, rows, fields) {
    let sportsMemberships = rows;

    db.pool.query(getStudentInfo, (error, rows, fields) => {
      let students = rows;

      db.pool.query(getSportsInfo, (error, rows, fields) => {
        let sports = rows;

        return res.render("sportMemberships", {
          data: sportsMemberships,
          students: students,
          sports: sports,
        });
      });
    });
  });
});

// Citation for add-sport-membership-ajax route functionality:
// Date: 08/05/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 5
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
app.post("/add-sport-membership-ajax", function (req, res) {
  let data = req.body;

  // checking if user selected NULL from student dropdown
  let studentID = data.studentID ? parseInt(data.studentID) : null;

  query1 = `INSERT INTO StudentHasClubs (studentID, clubID, clubRole, pageNum) VALUES (?, ?, ?, ?)`;

  db.pool.query(
    query1,
    [studentID, data.clubID, data.clubRole, data.pageNum],
    function (error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        query2 = `SELECT studentHasSportID, StudentHasSports.studentID AS "Student ID", CONCAT(Students.firstName, " ", Students.lastName) AS "Student Name", 
            StudentHasSports.sportID AS "Sport ID", CONCAT(Sports.varsityLevel, " ", Sports.sportType) AS "Sport Team", StudentHasSports.sportRole AS "Sport Role", 
            StudentHasSports.pageNum AS "Page Num." 
                FROM StudentHasSports
                    LEFT JOIN Students ON Students.studentID = StudentHasSports.studentID
                    INNER JOIN Sports ON Sports.sportID = StudentHasSports.sportID
                    ORDER BY studentHasSportID;`;
        db.pool.query(query2, function (error, rows, fields) {
          if (error) {
            console.log(error);
            res.sendStatus(400);
          }
          // send back data with new sport membership entry
          else {
            res.send(rows);
          }
        });
      }
    }
  );
});

// Citation for delete-sport-membership-ajax route functionality:
// Date: 08/05/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 7
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
app.delete("/delete-sport-membership-ajax/", function (req, res, next) {
  let data = req.body;
  let sportMembershipID = parseInt(data.id);

  let deleteSportMembership = `DELETE FROM StudentHasSports WHERE studentHasSportID = ?`;

  db.pool.query(
    deleteSportMembership,
    [sportMembershipID],
    function (error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        res.sendStatus(204);
      }
    }
  );
});

// Citation for edit-sport-membership-view route functionality:
// Date: 08/09/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Steps 4 and 6
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
app.get("/edit-sport-membership-view", function (req, res) {
  // NOTE: this route is solely to initially display the selected sport membership data; the following route has the actual editing functionality
  let sportMembershipID = parseInt(req.query.id); // primary key of entry to view is passed in

  let getSportMembership = `SELECT StudentHasSports.studentHasSportID, StudentHasSports.studentID, CONCAT(Students.firstName, " ", Students.lastName) AS "Student Name", 
            StudentHasSports.sportID, CONCAT(Sports.varsityLevel, " ", Sports.sportType) AS "Sport Team", StudentHasSports.sportRole, StudentHasSports.pageNum 
                FROM StudentHasSports
                    LEFT JOIN Students ON Students.studentID = StudentHasSports.studentID
                    INNER JOIN Sports ON Sports.sportID = StudentHasSports.sportID
                    WHERE studentHasSportID = ?`;

  let getStudents = `SELECT studentID, firstName, lastName, gradClassID FROM Students ORDER BY studentID;`;
  let getSports = `SELECT sportID, CONCAT(Sports.varsityLevel, " ", Sports.sportType) AS "Sport Team" FROM Sports ORDER BY sportID;`;

  db.pool.query(
    getSportMembership,
    [sportMembershipID],
    function (error, rows, fields) {
      let sportMembershipData = rows;

      db.pool.query(getStudents, function (error, rows, fields) {
        let students = rows;

        db.pool.query(getSports, function (error, rows, fields) {
          let sports = rows;

          res.render("editSportMembership", {
            sportMembership: sportMembershipData[0],
            students: students,
            sports: sports,
          });
        });
      });
    }
  );
});

// Citation for put-sport-membership-ajax route functionality:
// Date: 08/09/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 8
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
app.put("/put-sport-membership-ajax", function (req, res) {
  let data = req.body;
  let studentHasSportID = parseInt(data.studentHasSportID);
  let studentID = parseInt(data.studentID);
  let sportID = parseInt(data.sportID);
  let sportRole = data.sportRole;
  let pageNum = parseInt(data.pageNum);

  let queryUpdateSportMembership = `
        UPDATE StudentHasSports 
        SET studentID = ?, sportID = ?, sportRole = ?, pageNum = ? 
        WHERE studentHasSportID = ?;
    `;

  db.pool.query(
    queryUpdateSportMembership,
    [studentID, sportID, sportRole, pageNum, studentHasSportID],
    function (error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        res.json({ success: true, redirectUrl: "/sportMemberships" }); // return to the sport memberships page from the edit page
      }
    }
  );
});

// Citation for event memberships route functionality:
// Date: 08/01/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 4
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
app.get("/eventMemberships", function (req, res) {
  // grab event memberships with enhanced readability by grabbing student names and eventnames
  let getEventMemberships = `SELECT studentInEventID, StudentInEvents.studentID AS "Student ID", CONCAT(Students.firstName, " ", Students.lastName) AS "Student Name", 
        StudentInEvents.eventID AS "Event ID", Events.eventName AS "Event Name", StudentInEvents.eventRole AS "Event Role", StudentInEvents.pageNum AS "Page Num." 
            FROM StudentInEvents
                LEFT JOIN Students ON Students.studentID = StudentInEvents.studentID
                INNER JOIN Events ON Events.eventID = StudentInEvents.eventID
                ORDER BY studentInEventID;`;

  let getStudentInfo = `SELECT * FROM Students;`; // for student dropdown population
  let getEventsInfo = `SELECT * FROM Events;`; // for event dropdown population

  db.pool.query(getEventMemberships, function (error, rows, fields) {
    let eventMemberships = rows;

    db.pool.query(getStudentInfo, (error, rows, fields) => {
      let students = rows;

      db.pool.query(getEventsInfo, (error, rows, fields) => {
        let events = rows;

        return res.render("eventMemberships", {
          data: eventMemberships,
          students: students,
          events: events,
        });
      });
    });
  });
});

// Citation for add-event-membership-ajax route functionality:
// Date: 08/10/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 5
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
app.post("/add-event-membership-ajax", function (req, res) {
  let data = req.body;

  // checking if user selected NULL from student dropdown
  let studentID = data.studentID ? parseInt(data.studentID) : null;

  query1 = `INSERT INTO StudentInEvents (studentID, eventID, eventRole, pageNum) VALUES (?, ?, ?, ?)`;

  db.pool.query(query1, [studentID, data.eventID, data.eventRole, data.pageNum], function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      query2 = `SELECT studentInEventID, StudentInEvents.studentID AS "Student ID", CONCAT(Students.firstName, " ", Students.lastName) AS "Student Name", StudentInEvents.eventID AS "Event ID", 
                      Events.eventName AS "Event Name", StudentInEvents.eventRole AS "Event Role", StudentInEvents.pageNum AS "Page Num." 
                        FROM StudentInEvents
                            LEFT JOIN Students ON Students.studentID = StudentInEvents.studentID
                            INNER JOIN Events ON Events.eventID = StudentInEvents.eventID
                            ORDER BY studentInEventID;;`;
      db.pool.query(query2, function (error, rows, fields) {
        if (error) {
          console.log(error);
          res.sendStatus(400);
        }
        // send back data with new event membership entry
        else {
          res.send(rows);
        }
      });
    }
  });
});

// Citation for delete-event-membership-ajax route functionality:
// Date: 08/10/2024
// Adapted from CS340 2024 Summer Term Node.js starter code Step 7
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
app.delete("/delete-event-membership-ajax/", function (req, res, next) {
  let data = req.body;
  let eventMembershipID = parseInt(data.id);

  let deleteEventMembership = `DELETE FROM StudentInEvents WHERE studentInEventID = ?`;

  db.pool.query(
    deleteEventMembership,
    [eventMembershipID],
    function (error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        res.sendStatus(204);
      }
    }
  );
});
