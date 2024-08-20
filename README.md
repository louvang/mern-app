# mern-app

mern-app is a boilerplate that uses the MERN stack with email authentication.

## Setting .env

If you are forking this repo to create your own project, you'll need set up the following keys in your .env file (**.env.development.local**):

```
MONGO_URI=
SESSION_SECRET=
NODEMAILER_HOST=
NODEMAILER_PORT=
NODEMAILER_USER=
NODEMAILER_PASS=
JWT_SECRET=
```

## Running your development server

In the main directory, run `npm run dev` to start up your development server.

- Client will be located at http://localhost:5173
- Server will be located at http://localhost:5500
