import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import { extractTextFromPDF } from '../utils/pdfParser.js';
import { chunkText } from '../utils/textChunker.js';
// promise-based file system API, so async await can be easily used while using its methods to work with files
import fs from 'fs/promises';
import mongoose from 'mongoose';

// upload PDF document here
// POST /api/documents/upload
// private route
export const uploadDocument = async (req, res, next) => {
    try {
        if(!req.file) {
            return res.status(400).json({
                success: false,
                error: 'Please upload a PDF file',
                statusCode: 400
            });
        }

        const { title } = req.body;

        if(!title){
            await fs.unlink(req.file.path);
            return res.status(400).json({
                success: false,
                error: 'Please provide a document title',
                statusCode: 400
            });
        }

        // constructing URL for uploaded document, now any function in our code (and frontend also (directly)) can access the uploaded document using this URL 
        const baseUrl = `https://localhost:${process.env.PORT || 8000}`;
        // we used middleware for storing uploads in uploads folder by using /uploads
        // .filename etc methods come from multer
        // 
        const fileUrl = `${baseUrl}/uploads/documents/${req.file.filename}`;

        // store it in database
        const document = await Document.create({
            // remember , req.user comes from authentication middleware used in document Routes (we find the user in DB, which stores his/her id)
            userId: req.user._id,
            title,
            fileName: req.file.originalname, // the one entered by user, other gives filename saved by multer
            filePath: fileUrl, // URL is better than local path
            fileSize: req.file.size,
            status: 'processing'
        });

        // Process PDF in background (in production, use a queue like Bull, for learning purpose, its OK)
        processPDF(document._id, req.file.path).catch(err => {
            console.error('PDF processing error:', err)
        });

        res.status(201).json({
            success: true,
            data: document,
            message: 'Document uploaded successfully. Processing in progress...'
        });
    } catch (error){
        // clean up file on error
        if(req.file){
            await fs.unlink(req.file.path).catch(() => {});
        }
        next(error);
    }
};


const processPDF = async(documentId, filePath) => {
    try{
        const { text } = await extractTextFromPDF(filePath); // directly using text property of object returned by the function extractTextFromPDF
        
        const chunks = chunkText(text);

        await Document.findByIdAndUpdate(documentId, {
            extractedText: text,
            chunks: chunks,
            status: 'ready'
        });

        console.log(`Document ${documentId} processed succesfully`);
    }
    catch (error) {
        console.error(`Error processing document ${documentId}:`, error);

        await Document.findByIdAndUpdate(documentId, {
            status: 'failed'
        });
    }
};


// get all documents of user
// GET /api/documents
// private route
export const getDocuments = async (req, res, next) => {
    try {
        // very powerful method - process, transform, and analyze documents in a collection using a pipeline of stages (filter(match), join(lookup), flatten arrays obtained, aggregate and finally sort).
        // NOTE -- documents (below) is an array of documents (object) along with their flashcards and quizzes (stored as an array as field of object) and some metadata from addfields
        const documents = await Document.aggregate([
            {
                // like WHERE clause, those documents where userId mathes (get document of the user who requested) 
                // why converting to ObjectId type if it is already that -- because after JWT decoding and serialisation, _id might get converted into string
                $match: { userId: new mongoose.Types.ObjectId(req.user._id) }
            },
            {
                // JOIN operation of SQL -- For each document, find all flashcards whose documentId equals this document’s _id, and attach them as an array called flashcardSets
                $lookup: {
                    from: 'flashcards',
                    localField: '_id',
                    foreignField: 'documentId',
                    as: 'flashcardSets'
                }
            },
            {
                $lookup: {
                    from: 'quizzes',
                    localField: '_id',
                    foreignField: 'documentId',
                    as: 'quizzes'
                }
            },
            {
                // add these field for each document (metadata)
                $addFields: {
                    // i missed $ -- it is used to specify that this is field
                    flashcardCount: { $size: '$flashcardSets' },
                    quizCount: { $size: '$quizzes' }
                }
            },
            {
                // to include or exclude fields
                $project: {
                    extractedText: 0,
                    chunks: 0,
                    flashcardSets: 0,
                    quizzes: 0
                }
            },
            {
                // -1 -- descending order
                $sort: { uploadDate: -1 }
            }

        ]);

        res.status(200).json({
            success: true,
            count: documents.length,
            data: documents
        });
    } catch (error){
        next(error);
    }
};

// get single document with chunks
// GET /api/documents/:id
// private route
export const getDocument = async (req, res, next) => {
    try {
        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if(!document){
            // 404 -- resource not found
            return res.status(404).json({
                success: false,
                error: 'Document not found',
                statusCOde: 404
            });
        }

        // count of associated flashcards and quizzes
        const flashcardCount = await Flashcard.countDocuments({ documentId: document._id, userId: req.user._id });
        const quizCount = await Quiz.countDocuments({ documentId: document._id, userId: req.user._id });

        document.lastAccessed = Date.now();
        await document.save();

        // to access properties, gotta convert to js object
        const documentData = document.toObject();
        documentData.flashcardCount = flashcardCount;
        documentData.quizCount = quizCount;

        res.status(200).json({
            success: true,
            data: documentData
        });
    } catch (error){
        next(error);
    }
};

// delete document
// DELETE /api/documents/:id
// private route
export const deleteDocument = async (req, res, next) => {
    try {
        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user._id
        });


        if(!document){
            return res.status(404).json({
                success: false,
                error: 'Document not found',
                statusCode: 404
            });
        }

        // have to give 'unlink' local path on our server
        await fs.unlink(document.filePath).catch(() => {});

        await document.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Document deleted successfully'
        });
    } catch (error){
        next(error);
    }
};

// update document
// PUT /api/documents/:id
// private route
export const updateDocument = async (req, res, next) => {
    try {
        
    } catch (error){
        next(error);
    }
};