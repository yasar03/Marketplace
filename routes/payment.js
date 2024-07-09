const express = require('express');
const router = express.Router();
const stripe = require('../config/stripe');
const Product = require('../models/Product'); // Ensure you have the Product model imported

router.get('/', (req, res) => {
    res.render('payment'); // Assuming 'payment' is your EJS template file
  });

// // Import PayPal SDK
// const paypal = require('@paypal/checkout-server-sdk');

// // Configure PayPal client
// const client = new paypal.core.PayPalHttpClient({
//   clientId: 'AaHAa23EtkKnl0HhphmLNiMl4mHYJJWMMyb0PHVZLSwqQk2jXydNAARx5hV0GF92fP4ZOiOIwfR4wJA4',
//   clientSecret: 'ED-KhNdQg0RpKIuRAPrRhBaN6W9_XLcbRvvS7VUyKnMvNjRWAzkEjImTMunhN3MPWGcT-SoW1ws8Peu8'
// });

// Function to calculate total cart cost
// function calculateCartTotal(cart) {
//   let total = 0;
//   cart.forEach(product => {
//     total += product.price;
//   });
//   console.log(total);
//   return total.toFixed(2); // Ensure total is formatted properly
// }

// GET route to render the payment page
// router.get('/', (req, res) => {
//   const totalCost = calculateCartTotal(req.session.cart); // Calculate total cost of cart items
//   console.log('Total Cost:', totalCost);
//   res.render('payment', { totalCost });
// });

// POST route to create a Stripe checkout session
router.post('/create-checkout-session', async (req, res) => {
  const cart = req.session.cart; // Assuming you are using sessions to store the cart

  // Create line items for Stripe checkout session
  const lineItems = cart.map(product => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: product.name,
      },
      unit_amount: product.price * 100, // Stripe expects the amount in cents
    },
    quantity: 1,
  }));

  try {
    // Create a new Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'https://marketplace-3zxf.onrender.com/payment/success',
      cancel_url: 'https://marketplace-3zxf.onrender.com/payment/cancel',
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    res.status(500).json({ error: 'Failed to create Stripe checkout session' });
  }
});

// POST route to create a PayPal order
// router.post('/create-paypal-order', async (req, res) => {
//   const { price } = req.body;

//   // Create PayPal order request
//   const request = new paypal.orders.OrdersCreateRequest();
//   request.prefer('return=representation');
//   request.requestBody({
//     intent: 'CAPTURE',
//     purchase_units: [{
//       amount: {
//         currency_code: 'USD',
//         value: price.toString() // Replace with the amount you want to charge
//       }
//     }]
//   });

//   try {
//     // Execute PayPal request to create an order
//     const response = await client.execute(request);
//     res.status(200).json({ orderId: response.result.id });
//   } catch (error) {
//     console.error('Error creating PayPal order:', error);
//     res.status(500).json({ error: 'Failed to create PayPal order' });
//   }
// });

module.exports = router;
