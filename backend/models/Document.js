import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please enter a document title'],
        trim: true
    },
    fileName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    extractedText: {
        type: String,
        default: ''
    },
    // document is sent in chunks to avoid exceeding API limits
    // array of chunk objects
    chunkCount: {
    type: Number,
    default: 0
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    lastAccessed: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['processing', 'ready', 'failed'],
        default: 'processing'
    }
}, {
    timestamps: true
});

// in terms of upload date - like stack (gmail)
documentSchema.index( { userId: 1, uploadDate: -1});

const Document = mongoose.model('Document', documentSchema);

export default Document;