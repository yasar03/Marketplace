const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');
const User = require('../models/User');
const Product = require('../models/Product');

router.get('/create', (req, res) => {
  res.render('createShop');
});

router.post('/create', async (req, res) => {
  try {
    const { name, productIds } = req.body;
    const products = await Product.find({ _id: { $in: productIds } });
    const shop = new Shop({ name, members: [req.session.userId] });
    await shop.save();
    const user = await User.findById(req.session.userId);
    user.shops.push(shop._id);
    await user.save();
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('products');
    res.render('shop', { shop });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/:id/chat', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    res.render('chat', { shop });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/:id/chat', async (req, res) => {
    try {
      const shop = await Shop.findById(req.params.id);
      const user = await User.findById(req.session.userId);
  
      if (!shop || !user) {
        return res.status(404).send('Shop or User not found');
      }
  
      const message = {
        sender: user._id,
        content: req.body.message
      };
  
      shop.messages.push(message);
      await shop.save();
  
      // Broadcast message to all members of the shop using Socket.IO
      req.app.io.to(`shop_${shop._id}`).emit('newMessage', {
        sender: user.username,
        content: req.body.message,
        createdAt: message.createdAt
      });
  
      res.redirect(`/shops/${shop._id}/chat`);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });

  

router.get('/:id/invite', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    res.render('invite', { shop });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/:id/invite', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (shop.members.length >= 20) {
      return res.status(400).send('Shop can have at most 20 members');
    }

    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Check if the user is already a member or invited to the shop
    if (shop.members.includes(user._id) || shop.invites.includes(user._id)) {
      return res.status(400).send('User is already a member or invited to this shop');
    }

    // Add an invite record to the shop
    shop.invites.push(user._id);
    await shop.save();

    // Add the shop to the user's pending invites list
    user.pendingInvites.push(shop._id);
    await user.save();

    res.redirect(`/shops/${shop._id}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/:id/join', async (req, res) => {
    try {
      const shop = await Shop.findById(req.params.id);
      const user = await User.findById(req.session.userId);
    
      if (!shop || !user) {
        return res.status(404).send('Shop or User not found');
      }
    
      if (!shop.invites.includes(req.session.userId)) {
        return res.status(403).send('You do not have an invite to join this shop');
      }
    
      if (shop.members.includes(req.session.userId)) {
        return res.redirect(`/shops/${shop._id}`);
      }
    
      // Add the user to the shop's members list
      shop.members.push(req.session.userId);
      // Remove the shop's ID from user's pending invites list
      user.pendingInvites = user.pendingInvites.filter(invite => !invite.equals(shop._id));
      
      await Promise.all([shop.save(), user.save()]);
    
      // Add the shop to the user's shops list
      user.shops.push(shop._id);
      await user.save();
    
      return res.redirect(`/shops/${shop._id}`);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
  

module.exports = router;
