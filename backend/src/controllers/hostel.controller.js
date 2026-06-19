const HostelListing = require('../models/hostel.model');

/**
 * Get all hostels with dynamic filtering, sorting, and pagination
 * @route GET /api/v1/hostels
 */
const getHostels = async (req, res) => {
  try {
    let {
      location,
      gender,
      rating,
      minPrice,
      maxPrice,
      sortBy,
      order,
      page = 1,
      limit = 10
    } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    
    let query = {};

    // 1. Dynamic Filters
    // Location filter: case-insensitive and partial match via regex
    if (location) {
      query.location = { $regex: new RegExp(location, 'i') };
    }

    // Gender filter: exact match, upper case for consistency
    if (gender) {
      query.gender = gender.toUpperCase();
    }

    // Rating filter: greater than or equal
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // 2. Sorting
    let sortOptions = {};
    if (sortBy) {
      // Allow sorting by price, rating, or createdAt
      const sortOrder = order === 'desc' ? -1 : 1;
      sortOptions[sortBy] = sortOrder;
    } else {
      // Default sorting by newly created first
      sortOptions['createdAt'] = -1;
    }

    // 3. Pagination calculation
    const skip = (page - 1) * limit;

    // Execute queries
    const hostels = await HostelListing.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination metadata
    const totalHostels = await HostelListing.countDocuments(query);
    const totalPages = Math.ceil(totalHostels / limit);

    // Return the required response format
    res.status(200).json({
      success: true,
      page,
      limit,
      totalPages,
      totalHostels,
      data: hostels
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const getHostelById = async (req, res) => {
  try {
    const hostel = await HostelListing.findById(req.params.id);
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }
    res.status(200).json({ success: true, data: hostel });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getHostels,
  getHostelById
};
