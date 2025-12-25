
// express treats the fucntion with 4 parameters as error handler
const errorHandler = (err, req, res, next) => {
    // 500 -- server side error (error while processing request)
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Server Error';

    // MongoDB cast error (example sending string in place of mongoose objectID, mongoose wont know how to cast it)
    if(err.name === "CastError"){
        message = 'Resource Not Found';
        statusCode = 404;
    }

    // mongoose duplicate key error (example -- inserting data with duplicate key)
    if(err.code === 11000) {
        // err.keyValue -- the field(s) that caused duplicate error
        // Object.keys() -- name of them
        // [0] -- name of first field
        // that field already exits
        const field = Object.keys(err.keyValue)[0];
        message = `${field} already exists`;
        // bad request (client tried to insert invalid data)
        statusCode = 400;
    }

    // all mongoose validaiton errors 
    if(err.name === 'ValidationError'){
        // err.errors are objects, Object.values() converts them into array of those different error objects, now array method (map) can be used
        message = Object.values(err.errors).map(val => val.message).join(', ');
        // bad(or invalid) request
        statusCode = 400;
    }

    // Multer file size error
    if(err.code === 'LIMIT_FILE_SIZE'){
        message = 'File size exceeds the maximum limit of 10MB';
        statusCode = 400;
    }

    // JWT error
    if(err.name === 'JsonWebTokenError'){
        message = "Invalid token";
        // unauthorized request
        statusCode = 401;
    }

    if(err.name === 'TokenExpiredError'){
        message = 'Token expired';
        statusCode = 401;
    }

    console.error('Error:', {
        message: err.message,
        // if in development mode, show error stack (traceback to where error occured)
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });

    res.status(statusCode).json({
        success: false,
        error: message,
        statusCode,
        // send the stack only when you are in development mode
        ...(process.env.NODE_ENV === 'development' && { stack : err.stack })
    });
};

export default errorHandler;
