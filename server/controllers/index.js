const db = require('../db');
const Product = db.Product;

module.exports = {
  products: {
    get: (req, res) => {
      const id = req.params.id;
      if (id) {
        Product.findOne({where: {id: id}})
        .then((product) => {
          res.json(product);
        });
      } else {
        Product.findAll({})
        .then((products) => {
          res.json(products);
        });
      }
    },
    post: (req, res) => {
      const params = {
       name: req.body['name'], 
       imageUrl: req.body['imageUrl']
      };
      Product.create(params)
      .then((err, results) => {
        res.sendStatus(201);
      })
    },
    put: (req, res) => {
      const id = req.params.id;
      const params = req.body;
      Product.findOne({where: {id: id}})
      .then((product) => {
        if(product) {
          product.update(params)
          .then((results) => {
            res.json(results);
          })
        } else {
          res.sendStatus(404);  
        }
      })
    }
  }
};
