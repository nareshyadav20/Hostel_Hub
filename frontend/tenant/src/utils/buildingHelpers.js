/**
 * Generate amenity tag list from building facility booleans.
 * Used across Home, Landing, Search, and Listing pages.
 * 
 * @param {Object} building - Building data from API
 * @returns {string[]} Array of amenity label strings
 */
export const getAmenitiesFromBuilding = (building) => {
  if (!building) return [];

  const amenities = [];

  // From explicit amenities array (owner-entered)
  if (building.amenities && Array.isArray(building.amenities) && building.amenities.length > 0) {
    amenities.push(...building.amenities);
  }

  // From facility booleans — only add if not already present
  const facilityMap = [
    { key: 'wifi', label: 'WiFi' },
    { key: 'security', label: 'Security' },
    { key: 'cctv', label: 'CCTV' },
    { key: 'parking', label: 'Parking' },
    { key: 'powerBackup', label: 'Power Backup' },
    { key: 'mess', label: 'Mess/Food' },
    { key: 'gym', label: 'Gym' },
    { key: 'library', label: 'Library' },
    { key: 'laundry', label: 'Laundry' },
    { key: 'housekeeping', label: 'Housekeeping' },
    { key: 'medicalSupport', label: 'Medical Support' },
    { key: 'isAC', label: 'AC' },
    { key: 'lift', label: 'Lift' },
    { key: 'diningHall', label: 'Dining Hall' },
    { key: 'commonKitchen', label: 'Kitchen' },
    { key: 'studyHall', label: 'Study Hall' },
    { key: 'laundryRoom', label: 'Laundry Room' },
    { key: 'fireSafety', label: 'Fire Safety' },
    { key: 'emergencyExit', label: 'Emergency Exit' },
  ];

  facilityMap.forEach(({ key, label }) => {
    if (building[key] === true) {
      // Avoid duplicates (case-insensitive)
      const alreadyExists = amenities.some(a => 
        a.toLowerCase().includes(label.toLowerCase()) || 
        label.toLowerCase().includes(a.toLowerCase())
      );
      if (!alreadyExists) {
        amenities.push(label);
      }
    }
  });

  // If food charges exist, ensure Food/Mess is listed
  if (building.foodCharges > 0 && !amenities.some(a => a.toLowerCase().includes('food') || a.toLowerCase().includes('mess'))) {
    amenities.push('Food Included');
  }

  return amenities;
};

/**
 * Get the sharing label and lowest rent from building rent fields.
 * 
 * @param {Object} building - Building data from API
 * @returns {{ sharingLabel: string, lowestRent: number }}
 */
export const getSharingInfo = (building) => {
  const rents = [
    { val: building.rentSingle, label: 'Single Room' },
    { val: building.rentDouble, label: '2 Sharing' },
    { val: building.rentTriple, label: '3 Sharing' },
    { val: building.rent4Sharing, label: '4 Sharing' },
    { val: building.rent5Sharing, label: '5 Sharing' },
    { val: building.rent6Sharing, label: '6 Sharing' },
  ].filter(r => r.val > 0);

  if (rents.length > 0) {
    const minRent = rents.reduce((prev, curr) => prev.val < curr.val ? prev : curr);
    return { sharingLabel: minRent.label, lowestRent: minRent.val };
  }

  // Fallback based on startingPrice
  const price = building.startingPrice || 5000;
  if (price >= 12000) return { sharingLabel: 'Single Room', lowestRent: price };
  if (price >= 10000) return { sharingLabel: '2 Sharing', lowestRent: price };
  if (price >= 8000) return { sharingLabel: '3 Sharing', lowestRent: price };
  if (price >= 7000) return { sharingLabel: '4 Sharing', lowestRent: price };
  return { sharingLabel: '5 Sharing', lowestRent: price };
};

/**
 * Get hostel type display label from genderType and category.
 * 
 * @param {Object} building - Building data from API
 * @returns {string} Type label for display
 */
export const getHostelTypeLabel = (building) => {
  const gender = (building.genderType || '').toLowerCase();
  const category = (building.category || '').toLowerCase();

  if (gender === 'boys') return 'Boys Hostel';
  if (gender === 'girls') return 'Girls Hostel';
  if (category === 'luxury') return 'Premium Stay';
  if (category === 'student') return 'Student PG';
  if (category === 'professional') return 'Professional';
  if (gender === 'mixed') return 'Coliving';
  return 'Hostel';
};

/**
 * Get sharing availability booleans from building rent fields.
 * 
 * @param {Object} building - Building data from API
 * @returns {Object} Sharing availability flags
 */
export const getSharingAvailability = (building) => {
  const price = building.startingPrice || 0;
  return {
    hasSingle: (building.rentSingle || 0) > 0 || price >= 12000,
    hasDouble: (building.rentDouble || 0) > 0 || (price >= 10000 && price < 12000),
    hasTriple: (building.rentTriple || 0) > 0 || (price >= 8000 && price < 10000),
    has4: (building.rent4Sharing || 0) > 0 || (price >= 7000 && price < 8000),
    has5: (building.rent5Sharing || 0) > 0 || (price < 7000),
    has6: (building.rent6Sharing || 0) > 0,
  };
};
