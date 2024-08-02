-- =============================================
-- Authors: Group 26 (Katie Kimura, Skylar Soon, Annabel Wang)      
-- Create date: 07/23/2024
-- Description: Data manipulation queries script for CS340 Project (Step 3 Draft).
-- =============================================

-- NOTE: All variables that will have data from the backend programming language are denote with colon : character.
-- To denote where the variable came from, refer to the list of phrases that will be appended to the end of the attribute:
--    1. "_input" for user-entered values
--    2. "_foreignKey_option" for foreign key dropdown values
--    3. "_dropdown_option" for ENUM data fields
--    4. "_from_table" for auto-populated form fields (ex. each student table row has an edit and delete button that will auto-populate actions with that row's primary key)

-- =============================================
-- Students Queries (NOTE: studentID is not an auto-incrementing key)
-- =============================================

-- Students page table
SELECT studentID AS "Student ID", firstName AS "First Name", lastName AS "Last Name", gradClassID AS "Graduating Class" FROM Students;

-- Add a new student 
INSERT INTO Students (studentID, firstName, lastName, gradClassID) VALUES 
    (:studentID_input, :firstName_input, :lastName_input, :gradClassID_foreignKey_option);

-- Edit a student's data 
UPDATE Students
    SET studentID = :studentID_input, firstName = :firstName_input, lastName = :lastName_input, gradClassID = :gradClassID_foreignKey_optio
    WHERE studentID = :studentID_from_table; 

-- Delete a student 
DELETE FROM Students WHERE studentID = :studentID_from_table;

-- Get all students to populate foreign key dropdowns in StudentHasClubs, StudentHasSports, and StudentInEvents
SELECT studentID, CONCAT(firstName, " ", lastName) FROM Students;

-- =============================================
-- GradClasses Queries (NOTE: gradClassID's year datatype doesn't allow auto-increment)
-- =============================================

-- GradClasses page table
SELECT gradClassID AS "Graduating Class Year", pageStart AS "Start Page", pageEnd AS "End Page" FROM GradClasses;

-- Add a new graduating class 
INSERT INTO GradClasses (gradClassID, pageStart, pageEnd) VALUES
    (:gradClassID_input, :pageStart_input, :pageEnd_input);

-- Edit a graduating class
UPDATE GradClasses
    SET gradClassID = :gradClassID_input, pageStart = :pageStart_input, pageEnd = :pageEnd_input
    WHERE gradClassID = :gradClassID_from_table;

-- Delete a graduating class
DELETE FROM GradClasses WHERE gradClassID = :gradClassID_from_table;

-- Get all graduating classes to populate foreign key dropdown in Students table
SELECT gradClassID FROM GradClasses;

-- =============================================
-- Clubs Queries
-- =============================================

-- Clubs page table
SELECT clubID AS "Club ID", clubName AS "Club Name" FROM Clubs;

-- Add a new club
INSERT INTO Clubs (clubName) VALUES (:clubName_input);

-- Edit a club's data
UPDATE Clubs
    SET clubName = :clubName_input
    WHERE clubID = :clubID_from_table;

-- Delete a club
DELETE FROM Clubs WHERE clubID = :clubID_from_table;

-- Get all clubs to populate foreign key dropdown in StudentHasClubs table
SELECT clubID, clubName FROM Clubs;

-- =============================================
-- Sports Queries
-- =============================================

-- Sports page table
SELECT sportID AS "Sport ID", sportType AS "Sport", season AS "Season", varsityLevel AS "Varsity Level" FROM Sports;

-- Add a new sport
INSERT INTO Sports (sportType, season, varsityLevel) VALUES
    (:sportType_input, :season_input, :varsityLevel_input);

-- Edit a sport's data
UPDATE Sports
    SET sportType = :sportType_input, season = :season_dropdown_option, varsityLevel = :varsityLevel_dropdown_option
    WHERE sportID = :sportID_from_table;

-- Delete a sport
DELETE FROM Sports WHERE sportID = :sportID_from_table;

-- Get all sports to populate foreign key dropdown in StudentHasSports table
SELECT sportID, CONCAT(varsityLevel, " ", sportType) FROM Sports;

-- =============================================
-- Events Queries
-- =============================================

-- Events page table
SELECT eventID AS "Event ID", eventName AS "Event Name", eventDate AS "Event Date" FROM Events;

-- Add a new event
INSERT INTO Events (eventName, eventDate) VALUES
    (:eventName_input, :eventDate_input);

-- Edit a event's data
UPDATE Events
    SET eventName = :eventName_input, eventDate = :eventDate_input
    WHERE eventID = :eventID_from_table;

-- Delete a event
DELETE FROM Events WHERE eventID = :eventID_from_table;

-- Get all events to populate foreign key dropdown in StudentHasEvents table
SELECT eventID, eventName FROM Events;

-- =============================================
-- StudentHasClubs
-- =============================================

-- StudentHasClubs page table
SELECT StudentHasClubs.studentID AS "StudentID", CONCAT(Students.firstName, " ", Students.lastName) AS "Student Name", StudentHasClubs.clubID AS "Club ID", 
    Clubs.clubName AS "Club Name", StudentHasClubs.clubRole AS "Club Role", StudentHasClubs.pageNum AS "Page Num." 
        FROM StudentHasClubs
            INNER JOIN Students ON Students.studentID = StudentHasClubs.studentID
            INNER JOIN Clubs ON Clubs.clubID = StudentHasClubs.clubID;

-- Add a new student-club membership
INSERT INTO StudentHasClubs (studentID, clubID, clubRole, pageNum) VALUES
    (:studentID_foreignKey_option, :clubID_foreignKey_option, :clubRole_dropdown_option, :pageNum_input);

-- Edit student's club membership data
UPDATE StudentHasClubs
    SET clubRole = :clubRole_dropdown_option, pageNum = :pageNum_input
    WHERE studentHasClubID = :studentHasClubID_from_table;

-- Delete a student's club membership
DELETE FROM StudentHasClubs WHERE studentHasClubID = :studentHasClubID_from_table;

-- =============================================
-- StudentHasSports
-- =============================================

-- StudentHasSports page table
SELECT StudentHasSports.studentID AS "StudentID", CONCAT(Students.firstName, " ", Students.lastName) AS "Student Name", StudentHasSports.sportID AS "Sport ID", 
    CONCAT(Sports.varsityLevel, " ", Sports.sportType) AS "Sport Team", StudentHasSports.sportRole AS "Sport Role", StudentHasSports.pageNum AS "Page Num." 
        FROM StudentHasSports
            INNER JOIN Students ON Students.studentID = StudentHasSports.studentID
            INNER JOIN Sports ON Sports.sportID = StudentHasSports.sportID;

-- Add a new student-sport membership
INSERT INTO StudentHasSports (studentID, sportID, sportRole, pageNum) VALUES
    (:studentID_foreignKey_option, :sportID_foreignKey_option, :sportRole_dropdown_option, :pageNum_input);

-- Edit student's sport membership data
UPDATE StudentHasSports
    SET sportRole = :sportRole_dropdown_option, pageNum = :pageNum_input
    WHERE studentHasSportID = :studentHasSportID_from_table;

-- Delete a student's sport membership 
DELETE FROM StudentHasSports WHERE studentHasSportID = :studentHasSportID_from_table;

-- =============================================
-- StudentInEvents
-- =============================================

-- StudentInEvents page table
SELECT StudentInEvents.studentID AS "StudentID", CONCAT(Students.firstName, " ", Students.lastName) AS "Student Name", StudentInEvents.eventID AS "Event ID", 
    Events.eventName AS "Event Name", StudentInEvents.eventRole AS "Event Role", StudentInEvents.pageNum AS "Page Num." 
        FROM StudentInEvents
            INNER JOIN Students ON Students.studentID = StudentInEvents.studentID
            INNER JOIN Events ON Events.eventID = StudentInEvents.eventID;

-- Add a new student-event membership
INSERT INTO StudentInEvents (studentID, eventID, eventRole, pageNum) VALUES
    (:studentID_foreignKey_option, :eventID_foreignKey_option, :eventRole_dropdown_option, :pageNum_input);
    
-- Edit student's event membership data
UPDATE StudentInEvents
    SET eventRole = :eventRole_dropdown_option, pageNum = :pageNum_input
    WHERE studentInEventID = :studentInEventID_from_table;

-- Delete a student's event membership 
DELETE FROM StudentInEvents WHERE studentHasEventID = :studentHasEventID_from_table;