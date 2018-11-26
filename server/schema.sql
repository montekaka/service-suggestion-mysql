CREATE DATABASE productsuggestion;

USE productsuggestion;

CREATE TABLE products (
  id int NOT NULL AUTO_INCREMENT,
	name varchar(200) NOT NULL,
	imageUrl varchar(MAX) NOT NULL,
	PRIMARY KEY (ID)
);

CREATE TABLE suggestions (
  id int NOT NULL AUTO_INCREMENT,
	productId int not null,
	suggestProductId int not null,
	PRIMARY KEY (ID)
);