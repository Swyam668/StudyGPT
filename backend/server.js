import dotenv from 'dotenv';
// to add env variables in process.enc (which is globally accessible across the node process)
dotenv.config();

import express from 'express';
import cors from 'cors';
// for working with paths (like join, basename etc...)
import path from 'path';
// converts url to normal system paths
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
// NOTE -- Remember to specify file extension as js
import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import flashcardRoutes from './routes/flashcardRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

// import.meta -- obeject with metadata about current module
// import.meta.url -- current module's filepath url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

connectDB();

//MIDDLEWARES

// adding cors middleware
app.use(
    cors({
        // controls which which websites(origin) can send request to out server
        origin: "*",
        // only these HTTp requests are allowed
        methods: ["GET", "POST", "PUT", "DELETE"],
        // only these headers in request are allowed
        allowedHeaders: ["Content-Type", "Authorization"],
        // allow s browser to send cookies, authorization headers to our server (backend)
        credentials: true,
    })
);

app.use(express.json());
// urlencoded -- middleware to parse incoming HTTP requests with url encoded payloads (form data)
// it makes form data available under req.body 
// extended -- allows nested objects (in requests) 
app.use(express.urlencoded({ extended: true }));
// now using 'http://localhost:3000/uploads/image.png (resource)', resource will be accessible from uploads folder (in directory __dirname)
app.use('/uploads', express.static(path.join(__dirname, "uploads")));

//ROUTES

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/ai', aiRoutes);

app.use(errorHandler);

// 404 handler
// if all routes are passed (they keep running n    ext) -- and eventually this comes (all routes exhausted), it means invalid route is entered by the user
app.use((req, res) => {
    // res.status -- sets HTTP status code of response given (res)
    // res.json -- to send json response 
    res.status(404).json({
        success: false,
        error: 'Route not found',
        statuscode: 404
    });
});

const PORT = process.env.PORT || 8000;
// starts Express server and listen for incoming HTTP requests
// () => {} -- executed once server starts successfully
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`);
})

// process -- global running NODEJS object representing the running process
// when promise rejects and has no catch to handle the error 
process.on('unhandledRejection', (err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1); // 1 - failure, 0 - success
});


