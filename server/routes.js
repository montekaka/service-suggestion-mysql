const controller = require('./controllers');
const router = require('express').Router();

router.get('/api/products', controller.products.get);
router.get('/api/products/:id', controller.products.get);
router.post('/api/products', controller.products.post);
router.put('/api/products/:id', controller.products.put);
router.delete('/api/products/:id', controller.products.delete);

module.exports = router;
