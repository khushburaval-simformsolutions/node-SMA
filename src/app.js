// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const followerRoutes = require('./routes/followerRoutes');
const commentRoutes = require('./routes/commentRoutes');
const storyRoutes = require('./routes/storyRoutes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/followers', followerRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/stories', storyRoutes);

app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

module.exports = app;