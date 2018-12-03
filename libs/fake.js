const faker = require('faker');
const randomImgUrl = 'https://picsum.photos/200/200/?image=';

function generator() {
	const randomNum = Math.floor(Math.random() * 1000) + 1;
	const randomName = faker.commerce.productName();
  return {
    name: randomName,
    imageUrl: randomImgUrl+randomNum
  }	
}

exports.generator = generator;

