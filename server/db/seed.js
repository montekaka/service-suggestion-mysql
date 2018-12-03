const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('./index.js');
const Product = db.Product;
const Suggestion = db.Suggestion;
const stringSimilarity = require('string-similarity');
const fake = require('./../../libs/fake.js');

const dataGenerator = fake.generator;

const promiseProduct = function(n) {
	return new Promise (
		(resolve, reject) => {
			var products = [];
			for(var i = 0; i < n; i++) {
				let data = dataGenerator();
				products.push(data);
			}				
			Product.bulkCreate(products).then(() => {
				resolve(true)
			}).catch((err) =>{
				reject(err);
			})
		}
	)
}

const promiseProducts = (k, n) => {
	var promisesAllProducts = [];
	var p = k / n;
	for(var i = 0; i < p; i++) {
		promisesAllProducts.push(promiseProduct(n));
	}
	return promisesAllProducts;
}

const partition = (k, n) => {
	var allProducts = promiseProducts(k, n);
	Promise.all(allProducts).then(() => {
		console.log('done');
		process.exit();	
	})
	.catch((err) => {
		console.log(err)
		process.exit();	
	})
}
// 100*100*100
// 97480
partition(1000000, 1000)
// seed(100)
