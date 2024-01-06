const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "notesread.db");

let db = null;

// initialization of DatabaseAndServer

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

// Middleware Function for all the APIs

const authenticationToken = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, "MY_SECRET_KEY", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        next();
      }
    });
  }
};

// get all notes API GET Method

app.get("/notes", authenticationToken, async (request, response) => {
  const getNotesQuery = `
    SELECT
    *
    FROM
    notesRead
    ORDER BY notes_id;`;
  const notesArray = await db.all(getNotesQuery);
  response.send(notesArray);
});

// Register user API

app.post("/register", async (request, response) => {
  const { username, password, gender } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const userQuery = `
    SELECT 
    *
    FROM
    users
    WHERE username='${username}';`;
  try {
    const dbUser = await db.get(userQuery);
    if (dbUser === undefined) {
      const createUserQuery = `
                INSERT INTO users (username, password, gender)
                VALUES (
                    '${username}', '${hashedPassword}', '${gender}'
                );`;
      await db.run(createUserQuery);
      response.status(200);
      response.send("User Created Successfully");
    } else {
      response.status(400);
      response.send("User already exists");
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
});

// Login user API

app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const fetchUserQuery = `
    SELECT 
    *
    FROM
    users
    WHERE username='${username}';`;

  try {
    const dbUser = await db.get(fetchUserQuery);

    if (dbUser === undefined) {
      response.status(200);
      response.send("Invalid user");
    } else {
      const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
      if (isPasswordMatched === true) {
        const payload = { username: username };
        const jwtToken = jwt.sign(payload, "MY_SECRET_KEY");
        response.send(jwtToken);
      } else {
        response.status(400);
        response.send("Invalid Password");
      }
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
});

//Create notes API POST Method

app.post("/notes", authenticationToken, async (request, response) => {
  const notesDetails = request.body;
  const { title, data, created_at } = notesDetails;
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

// get Notes of particular id API

app.get("/notes/:id", authenticationToken, async (request, response) => {
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

// Update Notes API

app.put("/notes/:id", authenticationToken, async (request, response) => {
  const notesId = request.params.id;
  console.log(notesId);
  const updatedNotesDetails = request.body;
  const { title, data, created_at } = updatedNotesDetails;
  const updateNotesQuery = `
    UPDATE notesRead
    SET 
        title='${title}',
        data='${data}',
        created_at='${created_at}'
    WHERE notes_id = ${notesId};`;
  try {
    const dbResponse = await db.run(updateNotesQuery);
    response.send("Notes Updated Successfully");
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
});

// Delete notes API

app.delete("/notes/:id", authenticationToken, async (request, response) => {
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
