const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('./index.js');
const Product = db.Product;
const Suggestion = db.Suggestion;
const stringSimilarity = require('string-similarity');
const fake = require('./../../libs/fake.js');

const dataGenerator = fake.generator;

var generateData = (n, k) => {
	var p = Promise.resolve();
	var e = n / k;
	for(var j = 0; j < e; j++) {
		var products = [];
		for(var i = 0; i < k; i++) {			
			let data = dataGenerator();
			products.push(data);			
		}
		p = p.then(() => {
			return Product.bulkCreate(products).then(() => {
				console.log(`bulkCreate ${j}`);
			});
		});		
	}
	return p;
}

// print start time
// generateData(10000000, 100000) # 20min
generateData(10000000, 10000).then(() => {
	console.log('done');
	// console.log end time,,, please ...
	process.exit();		
});