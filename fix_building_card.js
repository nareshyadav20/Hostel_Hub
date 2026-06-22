const fs = require('fs');
const file = 'frontend/owner/src/components/BuildingCard.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove Active block
content = content.replace(
`              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                 <span style={{ fontSize: '0.85rem', fontWeight: '700', color: (building.buildingStatus || building.status) === 'Active' ? '#10B981' : '#F59E0B' }}>
                   {(building.buildingStatus || building.status) === 'Active' ? '🟢' : '🟡'} {building.buildingStatus || building.status}
                 </span>
                 <span style={{ color: '#CBD5E1' }}>•</span>
                 <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748B' }}>{building.buildingType || building.genderType || 'Boys'} Hostel</span>
              </div>`,
`              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                 <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748B' }}>{building.buildingType || building.genderType || 'Boys'} Hostel</span>
              </div>`
);

// 2. Remove emojis from Floors/Rooms/Beds
content = content.replace(
`                 <span>🏢 {building.totalFloors || 0} Floors</span>
                 <span style={{ color: '#CBD5E1' }}>•</span>
                 <span>🚪 {building.totalRooms || 0} Rooms</span>
                 <span style={{ color: '#CBD5E1' }}>•</span>
                 <span>🛏️ {building.totalBeds || 0} Beds</span>`,
`                 <span>{building.totalFloors || 0} Floors</span>
                 <span style={{ color: '#CBD5E1' }}>•</span>
                 <span>{building.totalRooms || 0} Rooms</span>
                 <span style={{ color: '#CBD5E1' }}>•</span>
                 <span>{building.totalBeds || 0} Beds</span>`
);

// 3. Remove Occupancy emojis
content = content.replace('<span>📈 Occupancy</span>', '<span>Occupancy</span>');
content = content.replace(
`<span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '800' }}>📈 Occupancy</span>`,
`<span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '800' }}>Occupancy</span>`
);

// 4. Remove Occupied/Vacant emojis
content = content.replace(
`                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1E293B' }}>🛏️ {building.occupiedBeds || Math.round(((building.occupancyPercentage || 0) / 100) * (building.totalBeds || 0))} Occupied`,
`                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1E293B' }}>{building.occupiedBeds || Math.round(((building.occupancyPercentage || 0) / 100) * (building.totalBeds || 0))} Occupied`
);

content = content.replace(
`                <span style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: '800', textTransform: 'uppercase' }}>🛏️ Occupied Beds</span>`,
`                <span style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: '800', textTransform: 'uppercase' }}>Occupied Beds</span>`
);
content = content.replace(
`                <span style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: '800', textTransform: 'uppercase' }}>🚪 Vacant Beds</span>`,
`                <span style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: '800', textTransform: 'uppercase' }}>Vacant Beds</span>`
);

// 5. Fix edit button emoji and onClick
content = content.replace(
`                  onClick={(e) => { e.stopPropagation(); onEdit(building.id); }}
                  onMouseEnter={(e) => e.target.style.background = '#E2E8F0'}
                  onMouseLeave={(e) => e.target.style.background = '#F1F5F9'}
                  title="Edit Features"
                >
                  ✏️ Edit
                </button>`,
`                  onClick={(e) => { e.stopPropagation(); if(onEdit) onEdit(building.id); }}
                  onMouseEnter={(e) => e.target.style.background = '#E2E8F0'}
                  onMouseLeave={(e) => e.target.style.background = '#F1F5F9'}
                  title="Edit Features"
                >
                  Edit
                </button>`
);

// 6. Fix modal emojis
content = content.replace(
`              🏢 {building.buildingName || building.name}
            </p>

            {/* Warning */}
            <p style={{ textAlign: 'center', color: '#DC2626', fontSize: '0.8rem', fontWeight: '700', margin: '0 0 2rem', padding: '0.75rem 1rem', background: '#FFF1F2', borderRadius: '10px', border: '1px solid #FECACA', lineHeight: 1.6 }}>
              ⚠️ This action is <strong>irreversible</strong>. All associated rooms, beds, and tenant records will be permanently removed.
            </p>

            {deleteError && (
              <div style={{ marginBottom: '1.5rem', padding: '0.8rem', borderRadius: '12px', background: '#FEF2F2', border: '1px solid #FEE2E2', color: '#B91C1C', fontSize: '0.8rem', fontWeight: '700', textAlign: 'center' }}>
                ❌ {deleteError}
              </div>
            )}`,
`              {building.buildingName || building.name}
            </p>

            {/* Warning */}
            <p style={{ textAlign: 'center', color: '#DC2626', fontSize: '0.8rem', fontWeight: '700', margin: '0 0 2rem', padding: '0.75rem 1rem', background: '#FFF1F2', borderRadius: '10px', border: '1px solid #FECACA', lineHeight: 1.6 }}>
              This action is <strong>irreversible</strong>. All associated rooms, beds, and tenant records will be permanently removed.
            </p>

            {deleteError && (
              <div style={{ marginBottom: '1.5rem', padding: '0.8rem', borderRadius: '12px', background: '#FEF2F2', border: '1px solid #FEE2E2', color: '#B91C1C', fontSize: '0.8rem', fontWeight: '700', textAlign: 'center' }}>
                {deleteError}
              </div>
            )}`
);

fs.writeFileSync(file, content);
