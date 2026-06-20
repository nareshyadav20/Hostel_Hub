const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const TenantProof = require('../models/TenantProof');
const authMiddleware = require('../utils/authMiddleware');

// Multer — store proofs in uploads/proofs/
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10 MB max

// POST /api/tenant-proofs/upload
// Accepts: idProof (file), profilePhoto (file), tenantId, buildingId, bookingId (body)
router.post('/upload', authMiddleware, upload.fields([
  { name: 'idProof', maxCount: 1 },
  { name: 'profilePhoto', maxCount: 1 }
]), async (req, res) => {
  try {
    const { buildingId, bookingId } = req.body;
    const tenantId = req.user.id;

    const idProofFile = req.files?.['idProof']?.[0];
    const photoFile   = req.files?.['profilePhoto']?.[0];

    if (!idProofFile) {
      return res.status(400).json({ error: 'ID Proof is required.' });
    }

    const idProofB64 = idProofFile.buffer.toString('base64');
    const idProofUrl = `data:${idProofFile.mimetype};base64,${idProofB64}`;
    const photoUrl   = photoFile ? `data:${photoFile.mimetype};base64,${photoFile.buffer.toString('base64')}` : null;

    const proof = await TenantProof.create({
      tenantId,
      buildingId: buildingId || null,
      bookingId:  bookingId  || null,
      idProofUrl,
      photoUrl,
      status: 'Pending'
    });

    res.status(201).json({
      message: 'Proofs uploaded successfully.',
      proofId: proof._id,
      idProofUrl,
      photoUrl
    });
  } catch (error) {
    console.error('[TenantProof] Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/tenant-proofs/me  — fetch own proofs
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const proofs = await TenantProof.find({ tenantId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(proofs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
