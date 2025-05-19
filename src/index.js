// src/index.js
const app = require('./app');
const connectDB = require('./config/db');

connectDB();

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});