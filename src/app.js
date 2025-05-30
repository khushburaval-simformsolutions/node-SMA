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
const feedRoutes = require('./routes/feedRoutes');

const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./docs/swagger');
const config = require('./config/config');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (config.environment === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

const corsOptions = {
  origin: config.environment === 'development' ? '*' : 'your-production-domain.com'
};
app.use(cors(corsOptions));

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/followers', followerRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/feeds', feedRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

module.exports = app;