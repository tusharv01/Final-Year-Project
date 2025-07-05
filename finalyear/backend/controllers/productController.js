import * as productService from '../services/productService.js';

export const createProduct = async (req, res) => {
  try {
    const supplierId = req.user.id;
    const product = await productService.addProduct(req.body, supplierId);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const fetchAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchProductsBySupplier = async (req, res) => {
  try {
    const products = await productService.getProductsBySupplier(req.user.id);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const editProduct = async (req, res) => {
  try {
    const updated = await productService.updateProduct(req.params.id, req.user.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

export const removeProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id, req.user.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};
