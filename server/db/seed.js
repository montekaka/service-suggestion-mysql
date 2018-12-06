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
		concurrency: 1
	})
	.then(() => {
		// console.log('done...');
		// const endTime = Date.now();
		// console.log(`finished in ${endTime}, ${startTime}`);
		// process.exit();
		return startTime;
	})
}

insertSuggestions = (n) => {
	//Product.findAll({offset: 0 , limit: 1})
	const offsets = [];
	for(var i = 0; i < n; i++) {
		offsets.push(i);
	};
	return Promise.map(offsets, (idx) => {
		return Product.findAll({offset: idx , limit: 1}).then((product) => {
			let name = product[0]['name'];
			let id = product[0]['id'];

			return Promise.map(offsets, (idy) => {
				return Product.findAll({offset: idy , limit: 1}).then((suggestProduct) => {
					let _name = suggestProduct[0]['name'];
					let _id = suggestProduct[0]['id'];
					var bulk = [];
					if(_id !== id) {
						// add suggestions
						let score = stringSimilarity.compareTwoStrings(_name, name);
						bulk.push({ ProductId: id, suggestProductId: _id, score: score });
						bulk.push({ ProductId: _id, suggestProductId: id, score: score });
						Suggestion.bulkCreate(bulk).then(() => {
							console.log('inserted suggestions')
						});
					}
				})
			}, {
				concurrency: 1
			}).then(() => {
				return true;
			})

		})
	}, {
		concurrency: 1
	}).then(() => {
		return true;
	})
}

const seed = (n, k) => {
	insertProducts(n, k).then((startTime) => {
		console.log(`done inserted products from ${startTime}`);
		insert suggestions
		insertSuggestions(n).then(() => {
			console.log('done inserted suggestions');
			process.exit();	
		})
	});
}

// seed(10000, 1000);
