import express from 'express';
import {
    createOrder,
    deleteOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
} from '../controllers/orderController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/authRole.js';

const router = express.Router();

router.use(authenticate); // all routes below are authenticated
router.use(authorizeRole('RETAILER'));

router.post('/', createOrder);           // Retailer creates a batch order
router.get('/', getAllOrders);           // Retailer fetches their orders
router.get('/:id', getOrderById);        // Retailer fetches one order
router.put('/:id', updateOrder);         // Retailer updates an order
router.delete('/:id', deleteOrder);      // Retailer cancels an order

export default router;
