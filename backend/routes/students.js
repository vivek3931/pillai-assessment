const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const generateAdmissionNumber = require('../utils/generateAdmissionNumber');

// Configure multer for photo uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Create activity log helper
const logActivity = async (action, student_id) => {
  try {
    await db.query(
      'INSERT INTO activity_logs (action, student_id) VALUES ($1, $2)',
      [action, student_id]
    );
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// GET /students - Fetch all students with pagination & search
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', filterCourse = '', filterYear = '' } = req.query;
    const offset = (page - 1) * limit;

    let queryText = 'SELECT * FROM students';
    let countQueryText = 'SELECT COUNT(*) FROM students';
    let params = [];
    let whereClauses = [];

    if (search) {
      params.push(`%${search}%`);
      whereClauses.push(`(name ILIKE $${params.length} OR course ILIKE $${params.length} OR admission_number ILIKE $${params.length})`);
    }

    if (filterCourse) {
      params.push(filterCourse);
      whereClauses.push(`course = $${params.length}`);
    }

    if (filterYear) {
      params.push(parseInt(filterYear, 10));
      whereClauses.push(`year = $${params.length}`);
    }

    if (whereClauses.length > 0) {
      queryText += ' WHERE ' + whereClauses.join(' AND ');
      countQueryText += ' WHERE ' + whereClauses.join(' AND ');
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    
    const countParams = [...params];
    params.push(limit, offset);

    const result = await db.query(queryText, params);
    const countResult = await db.query(countQueryText, countParams);

    res.json({
      students: result.rows,
      totalCount: parseInt(countResult.rows[0].count, 10),
      page: parseInt(page, 10),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count, 10) / limit)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /students/:id - Fetch single student
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const student = await db.query('SELECT * FROM students WHERE id = $1', [id]);
    
    if (student.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json(student.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /students - Add new student
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { name, course, year, dob, email, mobile_number, gender, address } = req.body;
    const photo_url = req.file ? `/uploads/${req.file.filename}` : null;
    
    // Generate unique admission number
    const admission_number = await generateAdmissionNumber();

    const newStudent = await db.query(
      `INSERT INTO students (admission_number, name, course, year, dob, email, mobile_number, gender, address, photo_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [admission_number, name, course, parseInt(year, 10), dob, email, mobile_number, gender, address, photo_url]
    );

    const student_id = newStudent.rows[0].id;
    await logActivity('ADD_STUDENT', student_id);

    res.status(201).json(newStudent.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error or duplicate email' });
  }
});

// PUT /students/:id - Update student
router.put('/:id', upload.single('photo'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, course, year, dob, email, mobile_number, gender, address } = req.body;
    
    // Check if student exists
    const existingStudent = await db.query('SELECT * FROM students WHERE id = $1', [id]);
    if (existingStudent.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const photo_url = req.file ? `/uploads/${req.file.filename}` : existingStudent.rows[0].photo_url;

    const updatedStudent = await db.query(
      `UPDATE students 
       SET name = $1, course = $2, year = $3, dob = $4, email = $5, mobile_number = $6, gender = $7, address = $8, photo_url = $9 
       WHERE id = $10 RETURNING *`,
      [name, course, parseInt(year, 10), dob, email, mobile_number, gender, address, photo_url, id]
    );

    await logActivity('UPDATE_STUDENT', id);

    res.json(updatedStudent.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /students/:id - Delete student
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if student exists
    const existingStudent = await db.query('SELECT * FROM students WHERE id = $1', [id]);
    if (existingStudent.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    await logActivity('DELETE_STUDENT', id);
    await db.query('DELETE FROM students WHERE id = $1', [id]);

    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
