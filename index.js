const express = require('express');
const bodyParser = require('body-parser'); 
const cors = require('cors'); 
const morgan = require('morgan'); // Added morgan
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Allow all origins for development
app.use(morgan('dev')); // Log HTTP requests in development mode

app.get('/', (req, res) => {
  res.send('Welcome to the Social Media App Backend!');
});

app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});