const express = require('express');
const cors = require('cors');
const upload = require('./upload');
const path = require('path');
const { MongoClient } = require('mongodb');
const { insertSubject} = require('./subjectDB'); // Import the helper functions for DB
const {findOne,insertOne} = require('./db')

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Static file serving for uploaded files
app.use(express.static(path.join(__dirname, 'uploads')));

// MongoDB URI and Client Setup
const uri = 'mongodb+srv://krishnareddy:1234567890@diploma.1v5g6.mongodb.net'; // Your MongoDB connection string
const client = new MongoClient(uri);
const dbName = 'Eduvault';
const collectionName = 'subjects';

// API to Register Student
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await findOne({ email });
    const user = await findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    if (user) {
      return res.status(400).json({ message: 'Username already registered' });
    }

    await insertOne({ username, email, password });

    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering student', error: error.message });
  }
});

// API to Login Student
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (email === 'admin123@gmail.com' && password === '1234567890') {
      return res.status(200).json({ message: 'Admin login successful' });
    }

    const user = await findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: { username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// API to Add Subject
app.post('/addSubject', upload, async (req, res) => {
  const { branch, year, regulation, subject } = req.body;

  // Check if required fields are provided
  if (!branch || !year || !regulation || !subject) {
    return res.status(400).json({ message: 'All fields (branch, year, regulation, subject) are required' });
  }

  // Get the file paths for the uploaded files
  const syllabusPath = req.files['syllabus'] ? req.files['syllabus'][0].path : '';
  const questionPapersPath = req.files['questionPapers'] ? req.files['questionPapers'][0].path : '';
  const booksPath = req.files['books'] ? req.files['books'][0].path : '';

  // If any file is missing, return an error response
  if (!syllabusPath || !questionPapersPath || !booksPath) {
    return res.status(400).json({ message: 'All file fields (syllabus, questionPapers, books) are required' });
  }

  // Create the new subject object with file paths
  const newSubject = {
    branch,
    year,
    regulation,
    subject,
    syllabus: syllabusPath,      // Store the path to the syllabus file
    questionPapers: questionPapersPath,  // Store the path to the question papers file
    books: booksPath,            // Store the path to the books file
  };

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Insert the new subject object into the database
    const result = await insertSubject(collection, newSubject);
    
    if (result) {
      res.status(201).json({ message: 'Subject added successfully!' });
    } else {
      res.status(400).json({ message: 'Failed to add subject' });
    }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
