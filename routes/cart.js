const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Adjust the path as needed

// In-memory cart for demonstration purposes (replace with database in production)
let cart = [];

// Add to cart route
router.post('/add', async (req, res) => {
  const productId = req.body.productId;
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).send('Product not found');
  }
  cart.push(product);
  res.redirect('/cart');
});

// Remove from cart route
router.post('/remove', (req, res) => {
  const productId = req.body.productId;
  cart = cart.filter(product => product._id.toString() !== productId);
  res.redirect('/cart');
});

// View cart route
router.get('/', (req, res) => {
  const totalCost = cart.reduce((total, product) => total + product.price, 0);
  res.render('cart', { cart, totalCost });
});

module.exports = router;
