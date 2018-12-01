const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../db');
const Product = db.Product;
const Suggestion = db.Suggestion;
const stringSimilarity = require('string-similarity');

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
      .then((product) => {
        return product;
      })
      .then((product) => {
        // handle suggestion
        Product.findAll({})
        .then((products) => {
          for(var i = 0; i < products.length; i++) {
            if( products[i].id !== product.id ) {
              let score = stringSimilarity.compareTwoStrings(products[i]['name'], product['name']);
              Suggestion.bulkCreate([ 
                { ProductId: product.id, suggestProductId: products[i].id, score: score },
                { ProductId: products[i].id, suggestProductId: product.id, score: score }
              ])
              .then(() => {
                return true;
              })
            }
          }
          return true;        
        })
        .then(() => {
          res.sendStatus(201);
        })
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
    },
    delete: (req, res) => {
      const id = req.params.id;
      Product.findOne({where: {id: id}})
      .then((product) => {
        if(product) {
          // remove all association with product
          Suggestion.destroy({
            where: {
              [Op.or]: [{productId: id}, {suggestProductId: id}]
            }
          })
          .then(() => {
            return product.destroy();
          })          
          .then(() => {
            res.json({message: `deleted product ${id}`});
          })
          .catch(() => {
            res.sendStatus(404);
          })
        } else {
          res.sendStatus(404);
        }
      })      
    },
    deleteAll: (req, res) => {
      Suggestion.destroy({ truncate : true, cascade: false })
      .then(() => {
        Product.destroy({ truncate : true, cascade: false })
        .then(() => {
          res.json({'message':'truncated all'})
        });
      })      
    }
  },
  suggestions: {
    get: (req, res) => {
      Suggestion.findAll({})
      .then((suggestions) => {
        res.json(suggestions);
      });      
    },
    delete: (req, res) => {
      const id = req.params.id;
      Suggestion.findOne({where: {id: id}})
      .then((suggestion) => {
        if(suggestion) {
          return {suggestion: suggestion.destroy(), error: null};
        } else {
          return {suggestion: null, error: 'Error'};
        }
      })
      .then((result) => {
        if(result.suggestion) {
          res.json({message: `deleted suggestion ${id}`});
        } else {
          res.sendStatus(404);  
        }
      })      
    }    
  }
};
