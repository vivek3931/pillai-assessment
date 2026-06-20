const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    // Total Students
    const totalResult = await db.query('SELECT COUNT(*) FROM students');
    const totalStudents = parseInt(totalResult.rows[0].count, 10);

    // Students by Course
    const courseResult = await db.query('SELECT course, COUNT(*) as count FROM students GROUP BY course ORDER BY count DESC');
    const studentsByCourse = courseResult.rows.map(row => ({
      course: row.course,
      count: parseInt(row.count, 10)
    }));

    // Students by Course and Year for Stacked Bar Chart
    const courseYearResult = await db.query('SELECT course, year, COUNT(*) as count FROM students GROUP BY course, year');
    const courseYearData = {};
    courseYearResult.rows.forEach(row => {
      if (!courseYearData[row.course]) {
        courseYearData[row.course] = { course: row.course, total: 0 };
      }
      courseYearData[row.course][`Year ${row.year}`] = parseInt(row.count, 10);
      courseYearData[row.course].total += parseInt(row.count, 10);
    });
    const studentsByCourseStacked = Object.values(courseYearData).sort((a, b) => b.total - a.total);

    // Recent Activity Logs (Join with students to get names)
    const logsResult = await db.query(`
      SELECT a.id, a.action, a.timestamp, s.name as student_name, s.admission_number 
      FROM activity_logs a 
      LEFT JOIN students s ON a.student_id = s.id 
      ORDER BY a.timestamp DESC 
      LIMIT 20
    `);

    res.json({
      totalStudents,
      studentsByCourse,
      studentsByCourseStacked,
      recentActivity: logsResult.rows
    });
  } catch (err) {
    console.error('Analytics Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
