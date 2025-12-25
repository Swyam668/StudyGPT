import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    documentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true,
    },
    // chat message of user and AI
    messages: [{
        role: {
            type: String,
            enum: ['user', 'assistant'],
            requred: true
        },
        content: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        // tells - this message is related to which chunks 
        relevantChunks: {
            type: [Number],
            default: []
        }
    }]
}, {
    timestamps: true
});

chatHistorySchema.index({ userId: 1, documentId: 1});

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

export default ChatHistory;