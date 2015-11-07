var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var priceSchema = new Schema({
	product: { type: Schema.ObjectId, ref: 'Product', index: { unique: true } },
	price: [{
		date: { type: String, required: true, trim: true },
		formattedDate: { type: String, required: true },
		amazonPrice: { type: Number, required: true },
		superSavingShipping: { type: Boolean, required: true},
		primeShipping: { type: Boolean, required: true}
	}]
});

module.exports = mongoose.model('Price', priceSchema);