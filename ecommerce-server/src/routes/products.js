const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = './src/data/productos.json';

const readData = () => {
  const data = fs.readFileSync(path, 'utf-8');
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

router.get('/', (req, res) => {
  const products = readData();
  const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
  res.json(products.slice(0, limit));
});

router.get('/:pid', (req, res) => {
  const products = readData();
  const product = products.find(p => p.id === req.params.pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

router.post('/', (req, res) => {
  const products = readData();
  const newProduct = {
    id: String(Date.now()),
    title: req.body.title,
    description: req.body.description,
    code: req.body.code,
    price: req.body.price,
    status: req.body.status !== undefined ? req.body.status : true,
    stock: req.body.stock,
    category: req.body.category,
    thumbnails: req.body.thumbnails || []
  };

  if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || newProduct.status === undefined || !newProduct.stock || !newProduct.category) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
  }

  products.push(newProduct);
  writeData(products);
  res.status(201).json(newProduct);
});

router.put('/:pid', (req, res) => {
  const products = readData();
  const productIndex = products.findIndex(p => p.id === req.params.pid);

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const updatedProduct = { ...products[productIndex], ...req.body };
  products[productIndex] = updatedProduct;
  writeData(products);
  res.json(updatedProduct);
});

router.delete('/:pid', (req, res) => {
  const products = readData();
  const newProducts = products.filter(p => p.id !== req.params.pid);

  if (products.length === newProducts.length) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  writeData(newProducts);
  res.json({ message: 'Producto eliminado' });
});

module.exports = router;
