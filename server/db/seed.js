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

const insertProducts = (n, k) => {
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

	return Promise.map(data, (products) => {
		return Product.bulkCreate(products()).then(() => {
			console.log('inserted')
		})
	}, {
		concurrency: 4
	})
	.then(() => {
		// console.log('done...');
		// const endTime = Date.now();
		// console.log(`finished in ${endTime}, ${startTime}`);
		// process.exit();
		return startTime;
	})
}

insertSuggestions = (totalProducts, numberOfSuggestProduct, numberOfSuggestionsPerProduct) => {
	//Product.findAll({offset: 0 , limit: 1})
	// randomly pick 100000 products, and create 20 suggestions for each of them.

	const offsets = [];
	while(offsets.length < numberOfSuggestProduct) {
		let k = Math.floor(Math.random() * Math.floor(totalProducts));
		if(offsets.includes(k) === false) {
			offsets.push(k);
		}
	}

	return Promise.map(offsets, (idx) => {
		let k = Math.floor(Math.random() * Math.floor(totalProducts));
		return Product.findAll({offset: idx , limit: 1}).then((product) => {
			let name = product[0]['name'];
			let id = product[0]['id'];
			return Product.findAll({offset: k, limit: numberOfSuggestionsPerProduct})
			.then((suggestProducts) => {
				var bulk = [];
				suggestProducts.forEach((suggestProduct) => {
					let _name = suggestProduct['name'];
					let _id = suggestProduct['id'];
					if(_id !== id) {
						let score = stringSimilarity.compareTwoStrings(_name, name);
						bulk.push({ ProductId: id, suggestProductId: _id, score: score });
					}
				});
				Suggestion.bulkCreate(bulk).then(() => {
					console.log('inserted suggestions')
				})
			});			
		})
	}, {
		concurrency: 10
	}).then(() => {
		return true;
	})
}

const seed = (totalProducts, k, numberOfSuggestProduct, numberOfSuggestionsPerProduct) => {
	insertProducts(totalProducts, k).then((startTime) => {
		console.log(`done inserted products from ${startTime}`);
		insertSuggestions(totalProducts, numberOfSuggestProduct, numberOfSuggestionsPerProduct)
    .then(() => {
			console.log('done inserted suggestions');
			process.exit();	
		})
	});
}

seed(10000000, 10000, 10000, 30);
