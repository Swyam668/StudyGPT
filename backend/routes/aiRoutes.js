import express from 'express';
import {
    generateFlashcards,
    generateQuiz,
    generateSummary,
    chat,
    explainConcept,
    getChatHistory
} from '../controllers/aiController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// we will save the generated content (change in database), so it is POST
router.post('/generate-flashcards', generateFlashcards);
router.post('/generate-post', generateQuiz);
router.post('/generate-summary', generateSummary);
// will take a message (so POST)
router.post('/chat', chat);
router.post('/explain-concept', explainConcept);
router.post('/chat-history/:documentId', getChatHistory);

export default router;