import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// generating jwt token
// id -- user's id in database
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
        const { username, email, password } = req.body;

        const userExists = await User.findOne({ $or: [{ email }] });

        if(userExists){
            return res.status(400).json({
                success: false,
                error:
                    userExists.email === email
                    ? 'Email already registered'
                    : 'Username already taken',
                statusCode: 400
            });
        }

        // otherwise  create user
        const user = await User.create({
            username,
            email,
            password
        });
        
        // primary key id -- _id
        // generating token with (created) user's id in database
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    profileImage: user.profileImage,
                    createdAt: user.createdAt,
                },
                token,
            },
            message: 'User registered successfully',
        });


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
    try{

    }
    catch(error){
        next(error);
    }
};

// update user profile
// PUT /api/auth/profile
// private route
export const updateProfile = async (req, res, next) => {
    try{

    }
    catch(error){
        next(error);
    }
};

// change password
// POST /api/auth/change-password
// private route
export const changePassword = async (req, res, next) => {
    try{

    }
    catch(error){
        next(error);
    }
};