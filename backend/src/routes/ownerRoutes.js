const express = require('express');
const router = express.Router();

// Placeholder owner routes — will be expanded when owner portal is re-integrated
router.get('/profile', (req, res) => {
  res.json({ message: 'Owner profile endpoint' });
});

module.exports = router;
