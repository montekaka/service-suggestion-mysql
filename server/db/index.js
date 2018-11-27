const Sequelize = require('sequelize');
const orm = new Sequelize('productsuggestion', 'root','password', {
  dialect: 'mysql'
});

const Product = orm.define('Product', {
  name: Sequelize.STRING,
  imageUrl: Sequelize.STRING
});

const Suggestion = orm.define('Suggestion', {
  suggestProductId: Sequelize.INTEGER,
  score: Sequelize.FLOAT  
});

Product.hasMany(Suggestion);
Suggestion.belongsTo(Product);

Product.sync();
Suggestion.sync();

exports.Product = Product;
exports.Suggestion = Suggestion;
