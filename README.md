## NotesRead API
This repository contains a simple Node.js Express application for managing notes. It utilizes SQLite for data storage, bcrypt for password hashing, and JSON Web Tokens (JWT) for user authentication.

### Installation
#### 1. Clone the Repository

`git clone https://github.com/your-username/notesread-api.git
cd notesread-api`
#### 2. Install Dependencies
Make sure you have Node.js and npm installed. Then, install the required packages using the following command:
`npm install`
#### 3. Create Database
The application uses an SQLite database. Run the following command to create the database file:
`touch notesread.db`
#### 4. Run the Application
Start the application using the following command:
`node app.js`
The server will be running at http://localhost:3000/.

### API Endpoints
#### 1. Register User : Registers the user if the user does not exist.
- Endpoint: /register
- Method: POST
- Payload: { "username": "your_username", "password": "your_password", "gender": "your_gender" }
#### 2. Login User : Takes username generates JWT-Token if username already exists and password matches with the previous password. Makes the login.
- Endpoint: /login
- Method: POST
- Payload: { "username": "your_username", "password": "your_password" }
- Returns: JWT token for authentication
#### 3. Get All Notes : Retreives all the existing notes from the DB.
- Endpoint: /notes
- Method: GET
- Authentication: JWT token in the Authorization header
#### 4. Get Notes by ID : Retrieves single record from the DB depending on the ID parameter.
- Endpoint: /notes/:id
- Method: GET
- Authentication: JWT token in the Authorization header
#### 5. Create Note : Create the note with the help of ID as primary key.
- Endpoint: /notes
- Method: POST
- Payload: { "title": "note_title", "data": "note_data", "created_at": "note_created_at" }
- Authentication: JWT token in the Authorization header
#### 6. Update Note by ID : Updates the note with new data using ID parameter.
- Endpoint: /notes/:id
- Method: PUT
- Payload: { "title": "updated_title", "data": "updated_data", "created_at": "updated_created_at" }
- Authentication: JWT token in the Authorization header
#### 7. Delete Note by ID : Deletes a note based on the ID parameter.
- Endpoint: /notes/:id
- Method: DELETE
- Authentication: JWT token in the Authorization header
