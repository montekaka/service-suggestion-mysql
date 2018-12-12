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
		return startTime;
	})
}

insertSuggestions = (totalProducts, numberOfSuggestProduct, numberOfSuggestionsPerProduct) => {
	//Product.findAll({offset: 0 , limit: 1})
	// randomly pick 10000 products, and create 30 suggestions for each of them.

	const offsets = [];
  // picking the 10000 products
	while(offsets.length < numberOfSuggestProduct) {
		let k = Math.floor(Math.random() * Math.floor(totalProducts));
		if(offsets.includes(k) === false) {
			offsets.push(k);
		}
	}

	const offsetBulks = [];
	var offsetBulk = [];
	for(var i = 0; i < offsets.length; i++ ) {
		if( i % 100 === 0) {
			if(offsetBulk.length > 0) {
				offsetBulks.push(offsetBulk);
			}
			offsetBulk = [offsets[i]];
		} else {
			offsetBulk.push(offsets[i]);
		}
	}
	
	offsetBulks.push(offsetBulk)

	return Promise.map(offsetBulks, (offsetBulk) => {
		return Product.findAll({
			where: {
				id: {[Op.or]: offsetBulk}
			}
		}).then((products) => {
			let k = Math.floor(Math.random() * Math.floor(totalProducts));
			return Product.findAll({offset: k, limit: numberOfSuggestionsPerProduct}).then((suggestions) => {				
				return Promise.map(products, (product) => {
					var name = product['name'];
					var id = product['id'];
					var bulk = [];
					suggestions.forEach((suggestProduct) => {
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
				}, {
					concurrency: 10
				})
			})
		});
	}, {
		concurrency: 4
	})
}

//insertSuggestions(10000, 1000, 30);

// console.log(insertSuggestions(10000, 1000, 30));

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
