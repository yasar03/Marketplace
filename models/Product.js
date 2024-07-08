const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }
});

module.exports = mongoose.model('Product', ProductSchema);
