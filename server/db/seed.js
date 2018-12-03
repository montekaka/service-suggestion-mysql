const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('./index.js');
const Product = db.Product;
const Suggestion = db.Suggestion;
const stringSimilarity = require('string-similarity');
const fake = require('./../../libs/fake.js');

const dataGenerator = fake.generator;

const seedProducts = (n) => {
	var products = [];
	for(var i = 0; i < n; i++) {
		let data = dataGenerator();
		products.push(data);
	}	
	return products;
}

const calculateSuggestions = (products) => {
	var suggestions = [];
	products.forEach((product) => {
		products.forEach((_product) => {
			if(product.id !== _product.id) {
				let score = stringSimilarity.compareTwoStrings(product['name'], _product['name']);
				suggestions.push({ProductId: product.id, suggestProductId: _product.id, score: score });
				suggestions.push({ProductId: _product.id, suggestProductId: product.id, score: score });
			}
		})
	});
	return suggestions;
}

const seed = (n) => {
	let products = seedProducts(n);
	Product.bulkCreate(products).then(() => {		
		// create suggestions per product
		Product.findAll({})
		.then((products) => {
			return calculateSuggestions(products);
		})
		.then((suggestions) => {
			console.log(suggestions.length)
			return Suggestion.bulkCreate(suggestions).then(() => {
				console.log('done suggestions')
			})
			.catch((err) => {
				console.log('error suggestions')
			})
		})
		.then(() => {
			console.log('done');	
			process.exit();			
		})			
	})
	.catch((err) => {
		console.log('err');
	})
}

seed(100)
