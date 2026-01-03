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
            // why send statusCode in response -- so that we can recieve them at frontend and work accordingly to it, like we logout if user does something that throws 404 or 401 (unauthorised) etc..
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

        // success and new resource (account in database) created -- 201 
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
        const { email, password } = req.body;

        // validating input
        if(!email || !password){
            res.status(400).json({
                success: false,
                error: 'Please provide both email and password',
                statusCode: 400,
            });
        }

        // check the matching user entry (or document), the select in password field is false (means by default it wont get selected)
        // add password for further comparision
        const user = await User.findOne({ email }).select('+password');
        
        if(!user){
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials!',
                statusCode: 401,
            });
        }

        const isMatch = await user.matchPassword(password);

        if(!isMatch){
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials!',
                statusCode: 401,
            });
        }

        //generating token for logged-in user
        const token = generateToken(user._id);

        // success and server returned requested data 
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileimage: user.profileImage,
            },
            token,
            message: 'Login successfull',
        });

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
        const user = await User.findById(req.user._id);

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
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
        const { username, email, profileImage } = req.body;

        const user = await User.findById(req.user._id);

        if(username) user.username = username;
        if(email) user.email = email;
        if(profileImage) user.profileImage = profileImage;

        await user.save();

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            },
            message: 'Profile updated successfully',
        });
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
        const { currentPassword, newPassword } = req.body;

        if(!currentPassword || !newPassword){
            return res.status(400).json({
                success: false,
                error: 'Please provide both current and new password',
                statusCode: 400,
            });
        }
        // get password also, for checking entered one
        const user = await User.findById(req.user._id).select('+password');

        const isMatch = user.matchPassword(currentPassword);

        if(!isMatch){
            return res.status(401).json({
                success: false,
                error: 'Current Password is incorrect',
                statusCode: 401
            });
        }


        user.password = newPassword;
        user.save();
        // no need to hash the password, as pre middleware will be called (written in User model) before save and will hash this modified password

        res.status(200).json({
            success: true,
            message: 'Password changed sucessfully',
        });
    }
    catch(error){
        next(error);
    }
};