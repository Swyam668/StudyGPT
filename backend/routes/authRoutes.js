import express from 'express';
// to work with body of incoming requests
import { body } from 'express-validator';
import {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword
} from '../controllers/authController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3})
        .withMessage('Username must be at least 3 characters long'),
    body('email')
        .isEmail()
        // treats different variants of same email as one  
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be atleast 6 characters long')
];

const loginValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// PUBLIC ROUTES
// Middleware as array
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// PROTECTED ROUTES
router.get('/profile', protect, getProfile);
// put, as existing profile is updated
router.put('/profile', protect, updateProfile);
// post, as whole password (an entity) is changed
router.post('/change-password', protect, changePassword);

export default router;