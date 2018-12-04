const Promise = require('bluebird');
const _ = require('lodash');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('./index.js');
const Product = db.Product;
const Suggestion = db.Suggestion;
const stringSimilarity = require('string-similarity');
const fake = require('./../../libs/fake.js');

const dataGenerator = fake.generator;

// const insertProducts = (n, k) => {
// 	var p = Promise.resolve();
// 	var e = n / k;
// 	for(var j = 0; j < e; j++) {
// 		p = p.then(() => {
// 			var products = [];
// 			for(var i = 0; i < k; i++) {			
// 				let data = dataGenerator();
// 				products.push(data);			
// 			}
// 			return Product.bulkCreate(products).then(() => {
// 				console.log(`bulkCreated`);
// 			});
// 		});		
// 	}
// 	return p;
// }

const insertPromiseProducts = (n, k) => {
	var e = n / k;
	const data = [];
	const startTime = Date.now();
	const generateProducts = () => {
		var products = [];		
		for(var i = 0; i < k; i++) {
			let product = dataGenerator();
			products.push(product);
		}
		return products;
	}
	for(var j = 0; j < e; j++) {		
		data.push(generateProducts);
	}

	Promise.map(data, (products) => {
		return Product.bulkCreate(products()).then(() => {
			console.log('inserted')
		})
	}, {
		concurrency: 1
	})
	.then(() => {
		console.log('done...');
		const endTime = Date.now();
		console.log(`finished in ${endTime}, ${startTime}`);
		process.exit();
	})
}

//const startTime = Date.now();
insertPromiseProducts(10000000, 1000);

// print start time
// generateData(10000000, 10000) # 1min
// generateProducts(10000000, 10000).then(() => {
// 	console.log(`start at ${startTime}, finished at ${Date.now()}, diff: ${(Date.now() - startTime) / (24 * 3600 * 1000)}`);
// 	process.exit();		
// });