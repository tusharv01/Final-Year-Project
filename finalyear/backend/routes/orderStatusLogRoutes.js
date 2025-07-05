import express from 'express';
import { changeStatus, fetchLogs } from '../controllers/orderStatusLogController.js';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

// Admin updates status (creates log automatically)
router.post('/update', authorizeAdmin, changeStatus);

// View full log history (admin OR order owner) – attach after /orders in app.js
router.get('/:orderId', fetchLogs);

export default router;
