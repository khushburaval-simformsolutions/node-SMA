const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Welcome to the Social Media App Backend!');
});

app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});