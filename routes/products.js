const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Shop = require('../models/Shop');

router.post('/add', async (req, res) => {
  try {
    const { name, price, shopId } = req.body;
    const product = new Product({ name, price, shop: shopId });
    await product.save();
    const shop = await Shop.findById(shopId);
    shop.products.push(product._id);
    await shop.save();
    res.redirect(`/shops/${shopId}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
