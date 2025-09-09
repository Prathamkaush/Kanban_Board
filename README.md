                                                                                   Kanban Board

A simple kanban board app where you can add, edit, delete and move tasks between Todo, In Progress, and Done.

                                                                                    Tech Used

Node.js + Express

PostgreSQL

HTML, CSS, JavaScript

                                                                                    How to Run

Clone this project

Go inside backend folder

Install dependencies

npm install


Make a .env file and put your db info:

DB_USER=postgres
DB_HOST=localhost
DB_NAME=kanban_db
DB_PASS=yourpassword
DB_PORT=5432


Create a table in PostgreSQL:

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  status VARCHAR(50) DEFAULT 'todo'
);


Start backend

node index.js


It runs on http://localhost:5000

Open index.html in browser for frontend
