var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var productSchema = new Schema({
	name: { type: String, required: true },
	itemId: { type: String, required: true, index: { unique: true } },
	prices: [ { type:Schema.ObjectId, ref:"Price" } ]
});

module.exports = mongoose.model('Product', productSchema);