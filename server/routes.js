const controller = require('./controllers');
const router = require('express').Router();

router.get('/api/products', controller.products.get);

module.exports = router;
