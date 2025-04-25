-- =============================================
-- Authors: Group 26 (Katie Kimura, Skylar Soon, Annabel Wang)      
-- Create date: 07/18/2024
-- Description: Data definition queries script for CS340 Project (Step 2 Draft).
-- =============================================

-- turn off foreign key checks and autocommit mode to minimize import errors
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- Students table structure
CREATE TABLE Students (
    studentID int UNIQUE NOT NULL,
    firstName varchar(255) NOT NULL,
    lastName varchar(255) NOT NULL,
    gradClassID year NOT NULL,
    PRIMARY KEY (studentID),
    FOREIGN KEY (gradClassID) REFERENCES GradClasses(gradClassID)
);

-- GradClasses table structure
CREATE TABLE GradClasses (
    gradClassID year UNIQUE NOT NULL,
    pageStart int NOT NULL,
    pageEnd int NOT NULL,
    PRIMARY KEY (gradClassID)
);

-- Clubs table structure
CREATE TABLE Clubs (
    clubID int AUTO_INCREMENT UNIQUE NOT NULL,
    clubName varchar(255) NOT NULL, 
    PRIMARY KEY (clubID)
);

-- Sports table structure
CREATETABLE Sports (
    sportID int AUTO_INCREMENT UNIQUE NOT NULL,
    sportType varchar(255) NOT NULL,
    season ENUM('Fall', 'Winter', 'Spring') NOT NULL,
    varsityLevel ENUM('Varsity', 'Junior Varsity', 'Intramural') NOT NULL,
    PRIMARY KEY (sportID)
);

-- Events table structure
CREATE TABLE Events (
    eventID int AUTO_INCREMENT UNIQUE NOT NULL,
    eventName varchar(255) NOT NULL,
    eventDate date NOT NULL,
    PRIMARY KEY (eventID)
);

-- StudentHasClubs intersection table structure
CREATE TABLE StudentHasClubs(
    studentHasClubID int AUTO_INCREMENT UNIQUE NOT NULL,
    studentID int NULL,
    clubID int NOT NULL,
    clubRole ENUM('President', 'Vice-president', 'Secretary', 'Treasurer', 'Historian', 'Member') NOT NULL DEFAULT 'Member',
    pageNum int NOT NULL,
    PRIMARY KEY (studentHasClubID),
    FOREIGN KEY (studentID) REFERENCES Students(studentID) ON DELETE SET NULL,
    FOREIGN KEY (clubID) REFERENCES Clubs(clubID) ON DELETE CASCADE
);

-- StudentHasSports intersection table structure
CREATE TABLE StudentHasSports(
    studentHasSportID int AUTO_INCREMENT UNIQUE NOT NULL,
    studentID int NULL,
    sportID int NOT NULL,
    sportRole ENUM('Captain', 'Co-captain', 'Manager', 'Player') NOT NULL DEFAULT 'Player',
    pageNum int NOT NULL,
    PRIMARY KEY (studentHasSportID),
    FOREIGN KEY (studentID) REFERENCES Students(studentID) ON DELETE SET NULL,
    FOREIGN KEY (sportID) REFERENCES Sports(sportID) ON DELETE CASCADE
);

-- StudentHasEvents intersection table structure
CREATE TABLE StudentInEvents(
    studentInEventID int AUTO_INCREMENT UNIQUE NOT NULL,
    studentID int NULL,
    eventID int NOT NULL,
    eventRole ENUM('Chairperson', 'Board Member', 'Attendee') NOT NULL DEFAULT 'Attendee',
    pageNum int NOT NULL,
    PRIMARY KEY (studentInEventID),
    FOREIGN KEY (studentID) REFERENCES Students(studentID) ON DELETE SET NULL,
    FOREIGN KEY (eventID) REFERENCES Events(eventID) ON DELETE CASCADE
);


-- insert data into Students table
INSERT INTO Students (studentID, firstName, lastName, gradClassID)
VALUES  (1700000001, 'Kevin', 'Kim', '2024'),
        (1700000002, 'Daniel', 'Liu', '2025'), 
        (1700000003, 'Scarlet', 'Sun', '2024'),
        (1700000004, 'Cameron', 'Roberts', '2026'),
        (1700000005, 'Andy', 'Wong', '2027');

-- insert data into GradClasses table
INSERT INTO GradClasses (gradClassID, pageStart, pageEnd)
VALUES  (2024, 30, 530),
        (2025, 531, 1031),
        (2026, 1032, 1532),
        (2027, 1533, 2033);

-- insert data into Clubs table
INSERT INTO Clubs (clubName)
VALUES  ('Guitar Club'),
        ('Lettuce Eating Club'),
        ('National Honor Society');

-- insert data into Sports table
INSERT INTO Sports (sportType, season, varsityLevel)
VALUES  ('Basketball', 'Winter', 'Varsity'),
        ('Tennis', 'Spring', 'Varsity'),
        ('Football', 'Fall', 'Junior Varsity');

-- insert data into Events table
INSERT INTO Events (eventName, eventDate)
VALUES  ('Homecoming Dance', '2024-09-28'),
        ('Winter Ball', '2024-12-20'),
        ('Junior Prom', '2024-04-13');

-- insert data into StudentHasClubs table
INSERT INTO StudentHasClubs (studentID, clubID, clubRole, pageNum)
VALUES  (1700000004, 2, 'Member', 2580),  
        (1700000002, 3, 'President', 3000),
        (1700000001, 3, 'Member', 3001),
        (1700000001, 1, 'President', 3017);

-- insert data into StudentHasSports table
INSERT INTO StudentHasSports (studentID, sportID, sportRole, pageNum)
VALUES  (1700000001, 1, 'Captain', 4070),  
        (1700000002, 1, 'Player', 4071),
        (1700000003, 2, 'Player', 4076),
        (1700000004, 3, 'Manager', 4052);

-- insert data into StudentInEvents table
INSERT INTO StudentInEvents (studentID, eventID, eventRole, pageNum)
VALUES  (1700000005, 1, 'Attendee', 5032),
        (1700000001, 1, 'Attendee', 5033),
        (1700000003, 2, 'Chairperson', 5061),
        (1700000002, 3, 'Board Member', 5122);

-- turn on foreign key checks and make a commit 
SET FOREIGN_KEY_CHECKS=1;
COMMIT;