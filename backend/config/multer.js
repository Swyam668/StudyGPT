import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
// here ...../config
const __dirname = path.dirname(__filename);

// ../ to get out of config, so in uploadDir, /config gets replaced by /uploads/documents
const uploadDir = path.join(__dirname, '../uploads/documents');
// check synchronously if folder exists 
if(!fs.existsSync(uploadDir)){
    // recursive means if parent directory does not exists create that as well, like to create documents, upload is also created, then documents is created
    fs.mkdirSync(uploadDir, { recursive: true });
}

// configuring storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // pass null to indicate no error, everything fine 
        cb(null, uploadDir);
    },
    // to give name to file on server
    filename: (req, file, cb) => {
        // to avoid collisions
        // unique -- today's date + random number
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // so even if file with same name is uploaded, they won't be overwritten
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

// File filter -- only PDFs
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'application/pdf'){
        // true -- accept the file by multer
        cb(null, true);
    }
    else{
        cb(new Error('Only PDF files are allowed!', false));
    }
};

// configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB
    }
});

export default upload;