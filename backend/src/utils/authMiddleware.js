const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Unified Owner Mapping: map all Naresh variations and default owner accounts to the main owner ID
    const targetOwnerId = '69f5d174bb94a186e2747924'; // panganareshyadav24@gmail.com
    const email = req.user.email?.toLowerCase();
    if (email && (email.includes('naresh') || email === 'owner@hostelhub.com')) {
      if (req.user.role === 'OWNER') {
        req.user.id = targetOwnerId;
      }
    }

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
