const crypto = require('crypto');
const generateReferralMessage = require('./generateReferralMessage');

const generateReferralCode = () => {
  return crypto.randomBytes(12).toString('hex');
};

const generateReferralLink = (user) => {
  const referralCode = user.referralCode || '';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  return `${frontendUrl}/signup?ref=${referralCode}`;
};

module.exports = {
  generateReferralCode,
  generateReferralLink,
  generateReferralMessage
};
