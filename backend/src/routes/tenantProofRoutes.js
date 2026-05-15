const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const TenantProof = require('../models/TenantProof');
const authMiddleware = require('../utils/authMiddleware');

// Multer — store proofs in uploads/proofs/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fs = require('fs');
    const dir = path.join(__dirname, '../../uploads/proofs');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `proof_${Date.now()}_${safeName}`);
  }
});
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

    const idProofUrl = `/uploads/proofs/${idProofFile.filename}`;
    const photoUrl   = photoFile ? `/uploads/proofs/${photoFile.filename}` : null;

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
