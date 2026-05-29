// src/components/BuildingCard.jsx
import React from "react";
import { Edit2, Trash2, Layers } from "lucide-react";
import "../styles/buildings.css";

/**
 * BuildingCard – displays a concise overview of a building.
 * Props:
 *   building: object containing at least { name, totalBeds, occupiedBeds }
 *   onEdit: () => void
 *   onDelete: () => void
 *   onViewFloors: () => void
 */
const BuildingCard = ({ building, onEdit, onDelete, onViewFloors }) => {
  const total = building.totalBeds ?? 0;
  const occupied = building.occupiedBeds ?? 0;
  const available = Math.max(total - occupied, 0);
  const occupancy = total > 0 ? Math.round((occupied / total) * 100) : 0;

  return (
    <div className="building-card smart-card">
      <h3 className="building-name">{building.name}</h3>
      <div className="building-stats">
        <div className="stat-item">
          <span className="stat-label">Beds Available</span>
          <span className="stat-value">{available}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Beds Filled</span>
          <span className="stat-value">{occupied}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Occupancy</span>
          <span className="stat-value">{occupancy}%</span>
        </div>
      </div>
      <div className="building-actions">
        <button className="btn btn-sm" onClick={onEdit} title="Edit Building">
          <Edit2 size={16} />
        </button>
        <button className="btn btn-sm btn-danger" onClick={onDelete} title="Delete Building">
          <Trash2 size={16} />
        </button>
        <button className="btn btn-sm btn-primary" onClick={onViewFloors} title="View Floors">
          <Layers size={16} /> Floors
        </button>
      </div>
    </div>
  );
};

export default BuildingCard;
