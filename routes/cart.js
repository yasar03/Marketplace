const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Ensure you have the Product model imported
const YOUR_DOMAIN = 'http://localhost:3000/payment';

let cart = []; // Temporary cart array

router.post('/add', async (req, res) => {
  const productId = req.body.productId;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const cartItem = { ...product.toObject(), uniqueId: new Date().getTime().toString() };
    cart.push(cartItem);
    req.session.cart = cart; // Store cart in session
    return res.status(200).json({ message: 'Product added to cart' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to add product to cart' });
  }
});

router.get('/', (req, res) => {
  const cart = req.session.cart || [];
  const totalCost = cart.reduce((total, product) => total + product.price, 0);
  res.render('cart', { cart, totalCost });
});

router.post('/remove', (req, res) => {
  const uniqueId = req.body.uniqueId;
  cart = cart.filter(product => product.uniqueId !== uniqueId);
  req.session.cart = cart; // Update cart in session
  res.redirect('/cart');
});

// Create checkout session route
router.post('/create-checkout-session', async (req, res) => {
  const lineItems = cart.map(product => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: product.name,
      },
      unit_amount: product.price * 100, // Stripe requires amount in cents
    },
    quantity: 1,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success`, // Replace with your success URL
      cancel_url: `${YOUR_DOMAIN}/cancel`, // Replace with your cancel URL
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// router.get('/cart', (req, res) => {
//   const totalCost = calculateCartTotal(req.session.cart); // Calculate total cost of cart items
//   res.render('cart', { cart: req.session.cart, totalCost });
// });


module.exports = router;
