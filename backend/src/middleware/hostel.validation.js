const validateHostelQuery = (req, res, next) => {
  const { page, limit, rating, minPrice, maxPrice } = req.query;

  // Validate numeric fields if they are provided
  if (page && isNaN(Number(page))) {
    return res.status(400).json({ success: false, message: 'Invalid page number' });
  }
  if (limit && isNaN(Number(limit))) {
    return res.status(400).json({ success: false, message: 'Invalid limit number' });
  }
  if (rating && isNaN(Number(rating))) {
    return res.status(400).json({ success: false, message: 'Invalid rating number' });
  }
  if (minPrice && isNaN(Number(minPrice))) {
    return res.status(400).json({ success: false, message: 'Invalid minPrice number' });
  }
  if (maxPrice && isNaN(Number(maxPrice))) {
    return res.status(400).json({ success: false, message: 'Invalid maxPrice number' });
  }

  next();
};

module.exports = { validateHostelQuery };
