const Asset = require('../models/Asset');
const Complaint = require('../models/Complaint');
const mongoose = require('mongoose');

exports.getAssets = async (req, res) => {
  try {
    const { buildingId } = req.query;
    let query = { ownerId: req.user.id };
    if (buildingId && buildingId !== 'undefined' && buildingId !== 'null' && buildingId !== 'all') {
      query.buildingId = buildingId;
    }

    const assets = await Asset.find(query).populate('buildingId', 'name');
    res.status(200).json(assets);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch assets', error: error.message });
  }
};

exports.createAsset = async (req, res) => {
  try {
    const { buildingId, assetName, subIssues } = req.body;
    
    // Check if building belongs to owner
    const Building = require('../models/Building');
    const building = await Building.findOne({ _id: buildingId, owner: req.user.id });
    if (!building) {
      return res.status(403).json({ message: 'Not authorized for this building' });
    }

    const asset = await Asset.create({
      ownerId: req.user.id,
      buildingId,
      assetName,
      subIssues,
      createdBy: req.user.id
    });

    res.status(201).json(asset);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create asset', error: error.message });
  }
};

exports.getAssetSummary = async (req, res) => {
  try {
    const { buildingId } = req.query;
    let query = { ownerId: req.user.id };
    if (buildingId && buildingId !== 'undefined' && buildingId !== 'null' && buildingId !== 'all') {
      query.buildingId = buildingId;
    }

    // Ensure we only count complaints that have a valid asset defined (not empty or null)
    query.asset = { $exists: true, $ne: null, $nin: ['', 'undefined', 'null'] };

    // Fetch complaints directly to calculate summary with populated tenant and room details
    const complaints = await Complaint.find(query)
      .populate('buildingId', 'name')
      .populate('tenant', 'name room email')
      .populate('roomId', 'roomNumber');

    // Aggregate stats
    const totalAssets = new Set(complaints.map(c => c.asset)).size;
    const activeIssues = complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Rejected').length;
    const resolvedIssues = complaints.filter(c => c.status === 'Resolved').length;

    // Calculate frequency
    const assetFrequency = {};
    complaints.forEach(c => {
      assetFrequency[c.asset] = (assetFrequency[c.asset] || 0) + 1;
    });

    // Sort to find top problematic
    const highFrequencyAssetsList = Object.entries(assetFrequency)
      .sort((a, b) => b[1] - a[1])
      .map(entry => ({ asset: entry[0], count: entry[1] }));
    
    const highFrequencyAssets = highFrequencyAssetsList.length > 0 ? highFrequencyAssetsList[0].asset : 'None';

    // MongoDB Aggregation for Grouped Asset Analytics
    const matchStage = {
      ownerId: new mongoose.Types.ObjectId(req.user.id),
      asset: { $exists: true, $ne: null, $nin: ['', 'undefined', 'null'] }
    };
    if (buildingId && buildingId !== 'undefined' && buildingId !== 'null' && buildingId !== 'all') {
      matchStage.buildingId = new mongoose.Types.ObjectId(buildingId);
    }

    const groupedAssets = await Complaint.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            asset: '$asset',
            subIssue: '$subIssue',
            buildingId: '$buildingId'
          },
          complaintCount: { $sum: 1 },
          activeIssues: {
            $sum: {
              $cond: [
                { $in: ['$status', ['Pending', 'In Progress', 'In-Progress']] },
                1,
                0
              ]
            }
          },
          resolvedIssues: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'Resolved'] },
                1,
                0
              ]
            }
          },
          latestActivity: { $max: '$createdAt' },
          statusTrends: { $push: '$status' }
        }
      },
      {
        $lookup: {
          from: 'buildings',
          localField: '_id.buildingId',
          foreignField: '_id',
          as: 'buildingDetails'
        }
      },
      {
        $unwind: {
          path: '$buildingDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          assetName: '$_id.asset',
          subIssue: { $ifNull: ['$_id.subIssue', 'N/A'] },
          buildingId: '$_id.buildingId',
          buildingName: { $ifNull: ['$buildingDetails.name', 'Unknown Building'] },
          complaintCount: 1,
          activeIssues: 1,
          resolvedIssues: 1,
          latestActivity: 1,
          statusTrends: 1
        }
      },
      { $sort: { complaintCount: -1 } }
    ]);

    res.status(200).json({
      totalAssets,
      activeIssues,
      resolvedIssues,
      highFrequencyAssets,
      complaints,
      assets: groupedAssets
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch asset summary', error: error.message });
  }
};
