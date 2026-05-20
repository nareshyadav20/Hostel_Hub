const fs = require('fs');
const path = 'c:\\Users\\91733\\OneDrive\\Desktop\\hostelmanagement\\Hostel_Hub\\frontend\\owner\\src\\pages\\InventoryMaster.css';

let css = fs.readFileSync(path, 'utf8');

const startIndex = css.indexOf('/* Elite Inventory Creator (Screenshot Match) */');
const endIndex = css.length; // Replace everything from there to the end

const newCSS = `/* Elite Inventory Creator (Screenshot Match) */
.creator-modal {
  width: 100%;
  max-width: 1050px;
  background: #ffffff;
  margin: 2rem auto;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: 'Plus Jakarta Sans', sans-serif;
}

@keyframes modalSlideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.creator-header {
  padding: 1.25rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.btn-back-link {
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: #374151;
  font-weight: 600;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.btn-back-link:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.draft-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #059669;
  background: #ecfdf5;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  letter-spacing: 0.05em;
  border: 1px solid #a7f3d0;
}

.plus-icon {
  border-radius: 50%;
  padding: 1px;
}

.creator-tabs-container {
  padding: 0 2rem;
  border-bottom: 1px solid #e5e7eb;
  background: #fafafa;
}

.creator-tabs {
  display: flex;
  gap: 2.5rem;
}

.tab-item {
  padding: 1rem 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  transition: 0.2s;
  letter-spacing: 0.02em;
  margin-bottom: -1px;
}

.tab-item:hover {
  color: #374151;
}

.tab-item.active {
  color: #10b981;
  border-bottom: 2px solid #10b981;
}

.creator-content {
  padding: 2.5rem 2rem;
}

.tab-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 3.5rem;
}

.tab-layout.vertical {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.upload-box-square {
  width: 100%;
  aspect-ratio: 1/1;
  background: #ffffff;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #9ca3af;
  cursor: pointer;
  transition: 0.2s;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.upload-box-square:hover {
  background: #f9fafb;
  border-color: #10b981;
  color: #10b981;
}

.creator-input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 1.5rem;
}

.desc-group {
  margin-bottom: 1rem;
}

.creator-input-group label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.creator-input {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.75rem 1rem;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  transition: 0.2s;
  color: #9ca3af;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}

.creator-input.no-icon {
  padding: 0.75rem 1.25rem;
}

.creator-input:focus-within {
  border-color: #10b981;
  color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}

.creator-input input {
  border: none;
  background: transparent;
  width: 100%;
  font-weight: 500;
  outline: none;
  font-size: 0.9rem;
  color: #1f2937;
}

.creator-input input::placeholder {
  color: #9ca3af;
  font-weight: 400;
}

.creator-select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.creator-select-wrapper .select-icon {
  position: absolute;
  right: 1rem;
  color: #9ca3af;
  pointer-events: none;
}

.creator-select {
  width: 100%;
  padding: 0.75rem 1.25rem;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  outline: none;
  color: #1f2937;
  appearance: none;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}

.creator-select:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}

.creator-textarea {
  width: 100%;
  padding: 1rem;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  outline: none;
  color: #1f2937;
  resize: none;
  transition: 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}
.creator-textarea:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}

.creator-textarea::placeholder {
  color: #9ca3af;
  font-weight: 400;
}

.creator-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.creator-grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.creator-footer {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
}

.btn-creator-next {
  padding: 0.75rem 1.5rem;
  background: #10b981;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.2s;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
}

.btn-creator-next:hover {
  background: #059669;
}

.btn-creator-publish {
  padding: 0.75rem 1.75rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.2s;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
}

.btn-creator-publish:hover {
  background: #059669;
}

.btn-creator-secondary {
  padding: 0.75rem 1.75rem;
  background: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.btn-creator-secondary:hover {
  background: #f9fafb;
}

.creator-checkbox-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.75rem 1.25rem;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  height: 44px; /* align with inputs */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}

.creator-checkbox-card input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #10b981;
}

.creator-checkbox-card label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #1f2937;
  margin: 0;
  text-transform: none;
  letter-spacing: normal;
  cursor: pointer;
}

.creator-footer-final {
  margin-top: 1rem;
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e5e7eb;
}

.meta-col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.calc-label, .gross-margin {
  font-size: 0.75rem;
  font-weight: 700;
  color: #6b7280;
  letter-spacing: 0.02em;
}

.black-text {
  color: #111827;
  font-size: 0.9rem;
}

.green-text {
  color: #059669;
  font-size: 0.9rem;
}

.final-btns {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.creator-input.highlight-green {
  background: #f0fdf4;
  border: 1px solid #a7f3d0;
  color: #059669;
}

.creator-input.highlight-green input {
  color: #059669;
  font-weight: 600;
}

.creator-input.highlight-green-light {
  background: #f0fdf4;
  border: 1px solid #a7f3d0;
  position: relative;
  color: #059669;
}

.bold-input {
  font-weight: 700 !important;
  color: #059669 !important;
}

.incl-gst {
  font-size: 0.7rem;
  font-weight: 700;
  color: #059669;
  position: absolute;
  right: 1.25rem;
}

.scan-icon {
  color: #9ca3af;
  cursor: pointer;
}

.curr {
  font-weight: 500;
  color: #9ca3af;
}

.close-modal-btn {
  background: #f3f4f6;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  cursor: pointer;
  transition: 0.2s;
}

.close-modal-btn:hover {
  background: #e5e7eb;
  color: #374151;
}
`;

if (startIndex !== -1) {
  const updatedCSS = css.substring(0, startIndex) + newCSS;
  fs.writeFileSync(path, updatedCSS);
  console.log("CSS updated successfully.");
} else {
  console.log("Could not find start index.");
}
