# 🧩 Group Todo App – Backend

A backend system for a group todo app, built as a technical assessment.  
Designed to support multi-user organizations with authentication, project grouping, and protected task management.

---

##📝 Focus of This Implementation
This project intentionally focuses on the backend architecture, database design, and API implementation.

##✅ The backend is fully implemented and tested

##⚠️ The frontend and test files are present from the original forked repo, but were not updated to match the extended functionality (organizations, projects, invite codes, etc.)

##🎯 This decision was made to maximize depth in backend logic, security, and data structure within the time constraints of the assessment

---

## 🚀 Features

- ✅ User authentication with JWT
- 🏢 Organizations with unique invite codes
- 👥 Multi-user support per organization
- 🗂️ Project-based task grouping
- 📝 Todos linked to projects, assigned to users
- 🔐 Route protection and scoped access
- 🧪 Fully tested with Jest + Supertest

---

## 📦 Tech Stack

- **Node.js + Express** – Server & API
- **PostgreSQL + Knex.js** – Database layer
- **JWT** – Auth & session handling

---

## Installation

1. Clone this repository.

    `git clone git@github.com:tonycheang/todo-backend-express-knex.git`

2. Install dependencies.

    `yarn install`

3. Create a postgres database for the project.

    ```Bash
    % psql postgres -U your_username_here
    postgres=> CREATE DATABASE name_of_db;
    postgres=> GRANT ALL PRIVILEGES ON DATABASE name_of_db TO your_username_here;
    postgres=> \q
    ```

    > You could change the default database, but Knex's .returning() method will only work for PostgreSQL, MSSQL, and Oracle databases. Modifications will be needed for other databases to meet the todo-backend spec.

4. Add Postgres credentials into server/.env to allow Knex to connect to the database.
5. Install Knex globally.

    `npm install knex -g`

6. Set up the database using Knex migrations.

    `cd server && knex migrate:latest`

7. Start the server on [http://localhost:5000](http://localhost:5000).

    `yarn server`