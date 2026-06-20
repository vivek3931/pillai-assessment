const db = require('../db');

const generateAdmissionNumber = async () => {
  const currentYear = new Date().getFullYear();
  
  // Find the highest admission number for the current year
  const result = await db.query(
    "SELECT admission_number FROM students WHERE admission_number LIKE $1 ORDER BY admission_number DESC LIMIT 1",
    [`ADM-${currentYear}-%`]
  );

  let nextSequence = 1;

  if (result.rows.length > 0) {
    const lastNum = result.rows[0].admission_number;
    const parts = lastNum.split('-');
    const sequenceStr = parts[parts.length - 1];
    nextSequence = parseInt(sequenceStr, 10) + 1;
  }

  // Format the sequence with leading zeros (e.g., 0001, 0002)
  const paddedSequence = nextSequence.toString().padStart(4, '0');
  
  return `ADM-${currentYear}-${paddedSequence}`;
};

module.exports = generateAdmissionNumber;
