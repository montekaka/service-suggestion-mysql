const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv')

dotenv.config();
let port = 3000;
if( process.env.NODE_ENV === 'development') {
  port = 4202;
}
// Router
const router = require('./routes.js');
const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

app.use(router);

app.get('*', (req, res) => res.status(200).send({
  message: `Welcome to the mysql of naboo.`,
}));

app.listen(port, () => {
  console.log(`Exapmle app listening on port ${port}!`);
});

module.exports = app;
