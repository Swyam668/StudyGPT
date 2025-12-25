import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// generating jwt token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || "7d",
    });
};

// Register a new user
// POST /api/auth/register
// public route
export const register = async (req, res, next) => {
    try{

    }
    catch(error){
        next(error);
    }
};

// login
// POST /api/auth/login
// public route
export const login = async (req, res, next) => {
    try{

    }
    catch(error){
        next(error);
    }
};

// get user profile
// GET /api/auth/profile
// private route
export const getProfile = async (req, res, next) => {

};

// update user profile
// PUT /api/auth/profile
// private route
export const updateProfile = async (req, res, next) => {

};

// change password
// POST /api/auth/change-password
// private route
export const changePassword = async (req, res, next) => {

};