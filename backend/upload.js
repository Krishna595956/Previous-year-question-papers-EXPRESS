const multer = require('multer');
const path = require('path');

// Set up file storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Specify the directory where files should be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Use a timestamp to avoid name collisions
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Only allow PDF files for syllabus, question papers, and books
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 }  // Limit file size to 10MB
}).fields([
  { name: 'syllabus', maxCount: 1 },
  { name: 'questionPapers', maxCount: 1 },
  { name: 'books', maxCount: 1 }
]);

module.exports = upload;
