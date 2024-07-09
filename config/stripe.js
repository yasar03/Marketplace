const Stripe = require('stripe');
const stripe = Stripe('sk_test_51PaZF9RxPgqbz4tEVm0ltEtvIySgSUH8jLWQOGfC6alRO833bSw66cc40hIB4CCgTxqSEC2IgxD3RadZ8MSied6s00HCD1L4vR'); // Replace 'your_stripe_secret_key' with your actual secret key

module.exports = stripe;
