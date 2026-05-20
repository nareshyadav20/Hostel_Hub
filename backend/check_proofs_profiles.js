const mongoose = require('mongoose');
const dotenv = require('dotenv');
const TenantProof = require('./src/models/TenantProof');
const OwnerProfile = require('./src/models/OwnerProfile');
const User = require('./src/models/User');

dotenv.config();

const runCheck = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const proofs = await TenantProof.find({});
    console.log(`Found ${proofs.length} TenantProof documents:`);
    for (const p of proofs) {
      const user = await User.findById(p.tenantId);
      console.log(`Proof ID: ${p._id}, Tenant: ${user ? user.name : 'Unknown'}, Status: ${p.status}, idProofUrl: ${p.idProofUrl}`);
    }

    const profiles = await OwnerProfile.find({});
    console.log(`Found ${profiles.length} OwnerProfile documents:`);
    for (const p of profiles) {
      const user = await User.findById(p.userId);
      console.log(`Profile ID: ${p._id}, Owner: ${user ? user.name : 'Unknown'}, Business: ${p.businessDetails?.businessName}, Docs Count: ${p.documents?.length || 0}`);
      if (p.documents?.length > 0) {
        p.documents.forEach((doc, idx) => {
          console.log(`  -> Doc ${idx+1}: ${doc.name} (${doc.type}) Status: ${doc.status}`);
        });
      }
    }

    process.exit(0);
  } catch (err) {
    console.error('Check failed:', err);
    process.exit(1);
  }
};

runCheck();
