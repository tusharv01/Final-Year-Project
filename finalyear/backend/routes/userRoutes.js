import express from 'express';
import {
    approveAllUsersController,
    approveUserController,
    getUserById,
    loginController,
    registerUser
} from '../controllers/userController.js';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/approve/:userId', authenticate, authorizeAdmin, approveUserController);
router.post('/approve-all', authenticate, authorizeAdmin, approveAllUsersController);
router.post('/login', loginController);

router.get('/:id', getUserById);

export default router;
