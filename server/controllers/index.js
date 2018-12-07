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
        const pageNumber = req.query.page ? Number(req.query.page) : 0;
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        // get page number 
        Product.findAll({})
        .then((products) => {
          const n = products.length;
          const totalPages = Math.ceil(n / limit);
          const previousPage = pageNumber > 0 ? pageNumber - 1 : 0;
          const nextPage = pageNumber < totalPages ? pageNumber + 1 : totalPages;
          Product.findAll({offset: pageNumber, limit: limit}).then((products) => {
            res.set({
              'totalPages': totalPages,
              'currentPage': pageNumber,
              'previousPage': previousPage,
              'nextPage': nextPage
            })
            res.json(products);
          })          
        });
      }
    },
    post: (req, res) => {
      const name = req.body['name']
      const params = {
       name: name, 
       imageUrl: req.body['imageUrl']
      };
      Product.create(params)
      .then((product) => {
        return product;
      })
      // .then(() => {
      //   res.sendStatus(201)
      // })
      .then((product) => {
        // handle suggestion
        Product.findAll({
          where: {
            id: {
              [Op.ne]: product.id
            }
          }
        })
        .then((products) => {
          var bulk = [];
          products.forEach((x) => {
            let score = stringSimilarity.compareTwoStrings(x['name'], name);
            bulk.push({ ProductId: product.id, suggestProductId: x.id, score: score });
            bulk.push({ ProductId: x.id, suggestProductId: product.id, score: score });          
          });          
          return Suggestion.bulkCreate(bulk);
        })
        .then(() => {
          res.sendStatus(201);
        })
        .catch(() => {
          res.sendStatus(404);
        })
      })
      .catch(() => {
        res.sendStatus(404);
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
