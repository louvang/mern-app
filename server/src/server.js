const express = require('express');

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
const app = express();

app.get('/', (req, res) => {
  res.send('Hello world');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
