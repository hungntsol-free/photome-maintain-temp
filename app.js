const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
dotenv.config({path: './config.env'});

const mongoUrl = process.env.mongoUri;
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to DB');
});

mongoose.connection.on('error', err => {
  console.log('error', err);
});

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/health', require('./router/health-check'));
app.use('/api/user', require('./router/user'));
app.use('/api/login', require('./router/login'));
app.use('/api/account', require('./router/account')); // Minh test
app.use('/api/profile', require('./router/profile'));
app.use('/api/newfeed', require('./router/newfeed'));
app.use('/api/liked', require('./router/liked'));
app.use('/api/comment', require('./router/comment'));
app.use('/api/follow', require('./router/follow'));

app.get('/', (req, res) => {
  res.send('Welcome to PhotoMe App');
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
