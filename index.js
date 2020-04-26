const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const uuidv4 = require('uuid').v4;

global.MessageUtils = require('./utils/Messages');
const RestRouter = require('./repository/RestRouter');

app.use(session({
  secret: 'fate-system',
  genid: (req) => {return uuidv4();},
  resave: false,
  saveUninitialized: false
}));
app.use('/rest', RestRouter);
app.use('/modules', express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'web-components')));

app.listen(3000, () => {
  console.log("Listening on 3000");
});
