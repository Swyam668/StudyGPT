import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        // second parameter throws valdaiton error err with err.message as provided
        required: [true, 'Please provide a username'],
        unique: true,
        trim: true,
        minLength: [3, 'Username must be atleast 3 characters long']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        // regex pattern for (---@----) - is non-whitespace character
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minLength: [6, 'Password must be at least 6 characters long'],
        // tells mongoDB to exclude this field while querying
        select: false
    },
    profileImage: {
        type: String,
        default: null
    }
}, {
    // automatically adds 'createdAt' and 'updatedAt' fields to (the document -- single record or object in MongoDB collection)
        timestamps: true
});


// run this middleware before mongoDB save function
// to hash password before saving it
userSchema.pre('save', async function(next) {
    // if password is not changed (something else is saved, then we may call mongoDB save function), then it will rehash if we didnt check this, hence hashed password is hashed again, creating problems in login
    if(!this.isModified('password')){
        next();
    }
    
    // both are async
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
