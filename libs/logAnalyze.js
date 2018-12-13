const fs = require('fs');
const _ = require('underscore');

const observation = (string) => {
	let strings = string.split('|');
	let requestType = strings[1];
	let requestTime = strings[3];	
	let unit = string[4];

	let GET_PRODUCTS = /\/api\/products\?page=\d+/; 
	let GET_PRODUCT = /\/api\/products\/\d+/;
	let GET_SUGGESTIONS = /\/api\/products\/\d+\/suggestions/;
	let type = 'Other';
	if( requestType ) {
		if(requestType.match(GET_PRODUCTS)) {
			type = 'GET_PRODUCTS';
		} else if (requestType.match(GET_SUGGESTIONS)) {
			type = 'GET_SUGGESTIONS';
		} else if (requestType.match(GET_PRODUCT)) {
			type = 'GET_PRODUCT';
		}
		return {requestType: type, requestTime: Number(requestTime), unit: unit}
	}
}

const getLogText = (file_path) => {
	return new Promise((resolve, reject) => {
		fs.readFile(file_path, 'utf8', (err, contents) => {
			err ? reject(err) : resolve(contents);
		})
	})
}

const summary = (data) => {
	let n = 0;
	let total = 0;
	data.forEach((row) => {
		n+=1;
		total += row.requestTime;
	});
	return {count: n, total: total, average: total / n};
}

const getSummaryStats = (file_path, category_name) => {
	return getLogText(file_path).then((contents) => {
		return contents.split('\n');
	}).then((rows) => {
		var data = [];
		rows.forEach((row) => {
			data.push(observation(row));
		})
		return data;	
	}).then((data) => {
		return _.groupBy(data, (row) => {
			return row.requestType;
		});
	}).then((data) => {
		const keys = Object.keys(data);
		var summarized = [];
		keys.forEach((key) => {
			var stats = summary(data[key]);
			stats[category_name] = key;
			summarized.push(stats);
		});
		return summarized;	
	}).then((data) => {
		return data;
	})	
};

const FILE_PATH = './../server/access.log';
getSummaryStats(FILE_PATH, 'requestType').then((data) => {
	console.table(data)
})