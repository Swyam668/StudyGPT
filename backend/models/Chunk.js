import mongoose from 'mongoose';

const chunkSchema = new mongoose.Schema({
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    content: {
        type: String,
        required: true
    },

    chunkIndex: {
        type: Number,
        required: true
    },

    pageNumber: {
        type: Number,
        default: 0
    },

    embedding: {
        type: [Number],
        required: true
    }
});

export default mongoose.model('Chunk', chunkSchema);