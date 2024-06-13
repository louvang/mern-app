import express, { Express, Request, Response } from 'express';

// Environment variable configuration
if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({
    path: `${__dirname}/.env.production.local`,
  });
} else {
  require('dotenv').config({
    path: `${__dirname}/.env.development.local`,
  });
}

// Express
const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
