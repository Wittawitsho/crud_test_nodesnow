## Frontend : React + Tailwindcss
* npm create vite@latest frontend
* cd frontend
* npm install
* npm run dev
* npm install tailwindcss @tailwindcss/vite
* npm install react-router-dom
* npm install axios
* npm install uuid
* npm install formik yup
* npm install --save-dev vitest @testing-library/react @testing-library/jest-dom

## Backend: : Nestjs
* nest new backend
* npm install @nestjs/sequelize sequelize pg pg-hstore sequelize-typescript
* npm install --save @nestjs/passport passport passport-local
* npm install bcrypt
* npm install passport-jwt
* npm install @nestjs/config
* npm install --save-dev @types/passport-jwt
* npm install --save @nestjs/jwt
* npm install cookie-parser
* npm install @nestjs/platform-express
* npm install class-validator class-transformer
* npm install cors
* nest g resource user
* nest g resource auth
* nest g resource task

# Databaes : PostgreSQL
* host: 'localhost',
* port: 5433,
* username: 'myuser',
* password: 'mypassword',
* database: 'mydb',

## API
## Authentication
* register : POST /user/register
* login : POST /auth/login
* profile user : GET /user/profile
* logout : POST /auth/logout

## Task
* Create a new task : POST  /tasks
* Get all tasks : GET  /tasks
* Get details of a specific task : GET  /tasks/:id
* Update a task : PATCH  /tasks/:id
* Delete a specific task : DELETE  /tasks/:id
## วิธี run
* docker compose -d up
* cd frontend
* npm run dev
* cd backend
* npm run start:dev


