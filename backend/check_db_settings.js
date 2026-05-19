const mongoose = require('mongoose');
const dotenv = require('dotenv');
const AdminSettings = require('./src/models/AdminSettings');

dotenv.config();

const runCheck = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const settingsList = await AdminSettings.find({});
    console.log(`Found ${settingsList.length} settings document(s) in admin_settings collection:`);
    
    for (const settings of settingsList) {
      console.log('----------------------------------------------------');
      console.log('Settings ID:', settings._id);
      console.log('Platform Persona:', settings.platformPersona);
      console.log('Admin Email:', settings.adminEmail);
      console.log('Fiscal Unit:', settings.fiscalUnit);
      console.log('Language:', settings.operationalLanguage);
      console.log('2FA Enabled:', settings.twoFactor);
      console.log('SMTP Enabled:', settings.smtpEmailRelay);
      console.log('Invoice Prefix:', settings.invoicingPrefix);
      console.log('Tax %:', settings.taxPercentage);
      console.log('Last Updated:', settings.updatedAt);
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Check failed:', err);
    process.exit(1);
  }
};

runCheck();
