require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const weatherRouter = require('./src/routes/weather');

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('tiny'));

app.use('/api/weather', weatherRouter);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});