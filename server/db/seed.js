const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('./index.js');
const Product = db.Product;
const Suggestion = db.Suggestion;
const stringSimilarity = require('string-similarity');
const fake = require('./../../libs/fake.js');

const dataGenerator = fake.generator;

var generateData = (n) => {
	var p = Promise.resolve();
	var products = [];
	for(var i = 0; i < n; i++) {
		let data = dataGenerator();
		p = p.then(() => {
			return Product.create(data).then(() => {
			});
		})
	}		
	return p;
}

generateData(100).then(() => {
	console.log('done');
	process.exit();		
});