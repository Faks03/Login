const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /product
router.get('/', async (req, res) => {
    const products = await Product.find({});
    res.render('index', { products });
});

// Edit Product
router.get('/edit/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('edit', { product });
  } catch (err) {
    console.error(err);
    res.redirect('/view');
    
  }
});

router.post('/edit/:id', async (req, res) => {
  try {
    const { title, description, price, availability } = req.body;
    await Product.findByIdAndUpdate(req.params.id, { title, description, price });
    res.redirect('/view');
  } catch (err) {
    console.error(err);
    res.redirect('/view');
  }
});

// Delete Product
router.get('/delete/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/view');
  } catch (err) {
    console.error(err);
    res.redirect('/view');
  }
});

module.exports = router;
