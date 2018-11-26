const express = require('express');

const app = express();
let port = 4202;

app.get('*', (req, res) => res.status(200).send({
  message: `Welcome to the mysql of naboo.`,
}));

app.listen(port, () => {
  console.log(`Exapmle app listening on port ${port}!`);
});

module.exports = app;
