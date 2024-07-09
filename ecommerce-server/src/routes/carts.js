const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = './src/data/carrito.json';

const readData = () => {
  const data = fs.readFileSync(path, 'utf-8');
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

router.post('/', (req, res) => {
  const carts = readData();
  const newCart = {
    id: String(Date.now()),
    products: []
  };

  carts.push(newCart);
  writeData(carts);
  res.status(201).json(newCart);
});

router.get('/:cid', (req, res) => {
  const carts = readData();
  const cart = carts.find(c => c.id === req.params.cid);

  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

router.post('/:cid/product/:pid', (req, res) => {
  const carts = readData();
  const cart = carts.find(c => c.id === req.params.cid);

  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  const product = cart.products.find(p => p.product === req.params.pid);
  if (product) {
    product.quantity += 1;
  } else {
    cart.products.push({ product: req.params.pid, quantity: 1 });
  }

  writeData(carts);
  res.json(cart);
});

module.exports = router;
