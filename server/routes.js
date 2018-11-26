const controller = require('./controllers');
const router = require('express').Router();

router.get('/api/products', controller.products.get);
router.post('/api/products', controller.products.post);
router.put('/api/products/:id', controller.products.put);

module.exports = router;
