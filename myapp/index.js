const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "notesread.db");

let db = null;

const initializeDatabaseAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDatabaseAndServer();

// get all notes API GET Method

app.get("/notes", async (request, response) => {
  const getNotesQuery = `
    SELECT
    *
    FROM
    notesRead
    ORDER BY notes_id;`;
  const notesArray = await db.all(getNotesQuery);
  response.send(notesArray);
});

app.post("/notes", async (request, response) => {
  const notesDetails = request.body;
  const { notes_id, title, data, created_at } = notesDetails;
  const createNotesQuery = `
    INSERT INTO notesRead (title, data, created_at)
    VALUES (
        '${title}',
        '${data}',
        '${created_at}'
    );`;
  try {
    const dbResponse = await db.run(createNotesQuery);
    const notesId = dbResponse.lastID;
    response.send({ notesId: notesId });
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
});

app.get("/notes/:id", async (request, response) => {
  const notesId = request.params.id;
  const getNotesQuery = `
    SELECT
    *
    FROM
    notesRead
    WHERE notes_id=${notesId}`;
  try {
    const noteBook = await db.get(getNotesQuery);
    response.send(noteBook);
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
});

app.delete("/notes/:id", async (request, response) => {
  const notesId = request.params.id;
  const getNotesQuery = `
    DELETE
    FROM
    notesRead
    WHERE notes_id=${notesId}`;
  try {
    const noteBook = await db.get(getNotesQuery);
    response.send("notes deleted successfully");
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
});
