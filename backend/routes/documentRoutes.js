import express from 'express';
import {
    uploadDocument,
    getDocuments,
    getDocument,
    deleteDocument,
    updateDocument,
} from '../controllers/documentController.js';
import protect from '../middleware/auth.js';
import upload from '../config/multer.js';

const router = express.Router();

//all routes are protected
// so add protect middleware to all routes under this router
router.use(protect);

// multer middleware (upload.single...) takes file and puts it in req.file
// now, we can work with the uploaded file in uploadDocument controller
router.post('/upload', upload.single('file'), uploadDocument);

router.get('/', getDocuments);
router.get('/:id', getDocument);
router.delete('/:id', deleteDocument);
router.put('/:id', updateDocument);

export default router;