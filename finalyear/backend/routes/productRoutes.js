import express from 'express';
import {
    createProduct,
    editProduct,
    fetchAllProducts,
    fetchProductById,
    fetchProductsBySupplier,
    removeProduct
} from '../controllers/productController.js';
import { authenticate } from '../middleware/authMiddleware.js';


const router = express.Router();


// Add new product (Supplier only)
router.post('/', authenticate, createProduct);

// Get all products
router.get('/', authenticate, fetchAllProducts);

// Get product by ID
router.get('/:id', authenticate, fetchProductById);

// Get products by supplier
router.get('/supplier/me', authenticate, fetchProductsBySupplier);

// Update product (Supplier only)
router.put('/:id', authenticate, editProduct);

// Delete product (Supplier only)
router.delete('/:id', authenticate, removeProduct);

export default router;
