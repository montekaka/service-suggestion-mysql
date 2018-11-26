const Sequelize = require('sequelize');
const orm = new Sequelize('productsuggestion', 'root','password');

const Product = orm.define('Product', {
  name: Sequelize.STRING,
  imageUrl: DataTypes.STRING
});

const Suggestion = orm.define('Suggestion', {
  productId: DataTypes.INTEGER,
  suggestProductId: DataTypes.INTEGER,
  score: DataTypes.FLOAT  
});

Product.hasMany(Suggestion);
Suggestion.belongsTo(Product);

Product.sync();
Suggestion.sync();

exports.Product = Product;
exports.Suggestion = Suggestion;
