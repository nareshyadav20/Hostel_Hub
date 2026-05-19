const generateReferralMessage = (user) => {
  const referralCode = user.referralCode || '';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const referralLink = `${frontendUrl}/signup?ref=${referralCode}`;
  return `Hey! I'm staying at Livora, and it's amazing. Join me using my referral link and we both get bonus points: ${referralLink}`;
};

module.exports = generateReferralMessage;
