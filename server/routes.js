const controller = require('./controllers');
const router = require('express').Router();

router.get('/api/products', controller.products.get);
router.get('/api/products/:id', controller.products.get);
router.post('/api/products', controller.products.post);
router.put('/api/products/:id', controller.products.put);
router.delete('/api/products/:id', controller.products.delete);


router.get('/api/suggestions', controller.suggestions.get);
router.delete('/api/suggestions/:id', controller.suggestions.delete);

module.exports = router;
