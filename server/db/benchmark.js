const axios = require('axios');
const Promise = require('bluebird');
const base_url = 'http://localhost:4202';

const getProducts = (numberOfReqs, range) => {
	const baseUrl = base_url+'/api/products?page=';
	let urls = [];

	for(var i = 0; i < numberOfReqs; i++) {
		let k = Math.floor(Math.random() * Math.floor(range));
		urls.push(baseUrl+k);
	}
	
	return Promise.map(urls, (url) => {
		return axios.get(url)
	}, {
		concurrency: 1
	})
	.then(() => {
		return true;
	});
}

const getProduct = (numberOfReqs, range) => {
	const baseUrl = base_url+'/api/products/';
	let urls = [];

	for(var i = 0; i < numberOfReqs; i++) {
		let k = Math.floor(Math.random() * Math.floor(range));
		urls.push(baseUrl+k);
	}

	return Promise.map(urls, (url) => {
		return axios.get(url)
	}, {
		concurrency: 1
	})
	.then(() => {
		return true;
	});
}


const getProductSuggestions = (numberOfReqs, range) => {
	const baseUrl = base_url+'/api/products/';
	let urls = [];

	for(var i = 0; i < numberOfReqs; i++) {
		let k = Math.floor(Math.random() * Math.floor(range));
		urls.push(baseUrl+k);
	}

	return Promise.map(urls, (url) => {
		return axios.get(url+'/suggestions')
	}, {
		concurrency: 1
	})
	.then(() => {
		return true;
	});
}


getProducts(1000, 10000).then(() => {
	getProduct(1000, 10000)
	.then(() => {
		getProductSuggestions(100, 10000);
	})
})