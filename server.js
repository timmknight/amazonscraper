var aws = require('aws-lib'),
	mongoose = require('mongoose'),
	fs = require('fs'),
	moment = require('moment'),
	Price = require('./models/price'),
	Product = require('./models/product');

mongoose.connect('mongodb://localhost/pricetracker');

var host = "http://webservices.amazon.co.uk/onca/xml"
var prodAdvOptions = {host: "webservices.amazon.co.uk", region: "UK"};

var prodAdv = aws.createProdAdvClient('AKIAJMDKHUMZSKL32UMQ', 'lxIAiU1jbixmOQuosSDdGLOi1+mOadp/ONamOuOX', 'timmknightgit-21', prodAdvOptions );

var options = {
	ItemId: "B0087CL98K",
	ResponseGroup: "OfferFull, ItemAttributes",
	Condition: "New",
	MerchantId: "Amazon"
}

prodAdv.call("ItemLookup", options, function(err, result) {

	var productName = result.Items.Item.ItemAttributes.Title;
	var itemId = result.Items.Item.ASIN;

	var date = moment();
	var formattedDate = moment().format('D/M/YY H:mm:SS');

	var amazonPrice = result.Items.Item.Offers.Offer.OfferListing.Price.FormattedPrice;
	// Remove currency symbol
	var amazonPrice = amazonPrice.substring(1);
	//Make price in pennies 
	var amazonPrice = Math.round(parseFloat(amazonPrice)*100);
	var currencyCode = result.Items.Item.ItemAttributes.ListPrice.CurrencyCode;
	var superSavingShipping = result.Items.Item.Offers.Offer.OfferListing.IsEligibleForSuperSaverShipping;
	var primeShipping = result.Items.Item.Offers.Offer.OfferListing.IsEligibleForPrime;

	product = {
		name: productName,
		itemId: itemId
	};

	price = {
		date: date,	
		formattedDate: formattedDate,	
		amazonPrice: amazonPrice,	
		currencyCode: currencyCode,
		superSavingShipping: superSavingShipping,	
		primeShipping: primeShipping
	};
	saveProduct(product, price);
});

function saveProduct(productObj, priceObj) {
	var product = new Product();
	var price = new Price({product:product._id});

	product.name = productObj.name;
	product.itemId = productObj.itemId;
	price.price.push(priceObj);

	product.save( function(err) {
		if (err.code == 11000) {
			price.price.push(priceObj);
			savePrice(price);
		} else if (err) {
			console.log(err);
		} else {
			console.log('Product saved');
			savePrice(price);
		}
	});





};

function savePrice(price) {
	price.save( function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log('price saved');
		}
	});
};


