const {insertOne, insertMany, find, findOne, updateOne, deleteOne, deleteMany} =require('./db')

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// API to Register Student
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await findOne({ email });
    const user =await findOne({username});
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    if (user) {
      return res.status(400).json({ message: 'Username already registered' });
    }

    insertOne({ username, email, password });

    res.status(201).json({
      message: 'Student registered successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering student', error: error.message });
  }
});

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
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// API to Get Subjects by Branch and Year (with session)
app.get('/api/subjects', async (req, res) => {
  try {
    const { branch, year } = req.query;

    // Store the branch and year in the session
    req.session.branch = branch;
    req.session.year = year;

    if (!branch || !year) {
      return res.status(400).json({ message: 'Branch and year are required' });
    }

    const branchData = await Branch.findOne({ 'branch': branch });

    if (!branchData) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    const yearData = branchData.years.find(y => y.year === year);

    if (!yearData) {
      return res.status(404).json({ message: 'Year not found for the given branch' });
    }

    res.status(200).json(yearData.regulations); // Return the regulations (which include subjects)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subjects', error: error.message });
  }
});

// API to Get Syllabus, Books, and Question Papers by Subject (using session data)
app.get('/api/subject-details', async (req, res) => {
  try {
    const { subjectName } = req.query;
    const branch = req.session.branch;
    const year = req.session.year;

    if (!branch || !year || !subjectName) {
      return res.status(400).json({ message: 'Branch, year, and subjectName are required' });
    }

    const branchData = await Branch.findOne({ 'branch': branch });

    if (!branchData) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    const yearData = branchData.years.find(y => y.year === year);

    if (!yearData) {
      return res.status(404).json({ message: 'Year not found for the given branch' });
    }

    const regulation = yearData.regulations.find(r => r.subjects.some(s => s.name === subjectName));

    if (!regulation) {
      return res.status(404).json({ message: 'Subject not found in the given branch and year' });
    }

    const subject = regulation.subjects.find(s => s.name === subjectName);

    res.status(200).json({
      syllabus: subject.syllabus,
      books: subject.books,
      questionPapers: subject.questionPapers,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subject details', error: error.message });
  }
});

app.get('/api/subjects', async (req, res) => {
  try {
    const { branch, year } = req.query; // Extract branch and year from query parameters

    if (!branch || !year) {
      return res.status(400).json({ message: 'Branch and year are required' });
    }

    const branchData = await Branch.findOne({ 'branch': branch });

    if (!branchData) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    const yearData = branchData.years.find(y => y.year === year);

    if (!yearData) {
      return res.status(404).json({ message: 'Year not found for the given branch' });
    }

    res.status(200).json(yearData.regulations); // Return the regulations (which include subjects)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subjects', error: error.message });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
