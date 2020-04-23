// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources are the database (db) to store the notes, and the unique ID for each note
// We also add in install requirements for the app ===============================================================================

var db = require("../db/db");
var fs = require("fs");
var util = require("util");
var uuidv4 = require("uuid/v4");

//Global constant that helps us write data to files ===============================================================================

const writeFile = util.promisify(fs.writeFileSync);

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // ---------------------------------------------------------------------------

  app.get("/api/notes", function (req, res) {
    res.json(db);
  });

  // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // ...the JSON is pushed to the appropriate JavaScript array
  // Then the server saves the data to the appropriate array)
  // ---------------------------------------------------------------------------

  app.post("/api/notes", function (req, res) {
    db.push(req.body);
    req.body.id = uuidv4();
    writeFile(__dirname + "/../db/db.json", JSON.stringify(db));
    res.json(db);
  });

  // ---------------------------------------------------------------------------
  // API Delete Requests
  //If a user no longer needs the note to be saved, they can submit a server request to delete the note from the array

  app.delete("/api/notes/:id", function (req, res) {
    let id = req.params.id;
    db = db.filter((object) => object.id !== id);
    writeFile(__dirname + "/../db/db.json", JSON.stringify(db));
    res.json(db);
  });
};
