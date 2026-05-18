const fs = require('fs');
const path = 'c:\\Users\\91733\\OneDrive\\Desktop\\hostelmanagement\\Hostel_Hub\\frontend\\owner\\src\\pages\\InventoryMaster.css';

let css = fs.readFileSync(path, 'utf8');

const startIndex = css.indexOf('/* Elite Inventory Creator (Screenshot Match) */');
const endIndex = css.length;

const newCSS = `/* Elite Inventory Creator (Screenshot Match) */
.creator-modal {
  width: 100%;
  max-width: 1100px;
  background: #ffffff;
  margin: 2rem auto;
  border-radius: 8px; /* More classic, less rounded */
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modalFadeIn 0.2s ease-out;
  font-family: 'Inter', sans-serif; /* Classic clean font */
}

@keyframes modalFadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}

.creator-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2.5rem;
  background: #f8fafb;
  border-bottom: 1px solid #e5e7eb;
}

.btn-back-classic {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  color: #4b5563;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: 0.2s;
  padding: 0.5rem;
  border-radius: 6px;
}
.btn-back-classic:hover {
  background: #e5e7eb;
  color: #1f2937;
}

.btn-close-classic {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 6px;
  transition: 0.2s;
}
.btn-close-classic:hover {
  background: #fee2e2;
  color: #ef4444;
}

.creator-tabs-container {
  padding: 0 2.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
}

.creator-tabs {
  display: flex;
  gap: 2rem;
}

.tab-item {
  padding: 1.25rem 0;
  font-size: 0.85rem;
  font-weight: 700;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  transition: 0.2s;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  margin-bottom: -1px;
}

.tab-item:hover {
  color: #4b5563;
}

.tab-item.active {
  color: #059669; /* Darker green */
  border-bottom: 3px solid #059669;
}

.creator-content {
  padding: 2.5rem;
}

.tab-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 4rem;
}

.tab-layout.vertical {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.upload-box-square {
  width: 100%;
  aspect-ratio: 1/1;
  background: #ffffff;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #9ca3af;
  cursor: pointer;
  transition: 0.2s;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.upload-box-square:hover {
  border-color: #059669;
  color: #059669;
  background: #f0fdf4;
}

.creator-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 1.75rem;
}

.desc-group {
  margin-bottom: 1rem;
}

.creator-input-group label {
  font-size: 0.7rem;
  font-weight: 800;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.creator-input {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.8rem 1rem;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  transition: 0.2s;
  color: #9ca3af;
}

.creator-input.no-icon {
  padding: 0.8rem 1rem;
}

.creator-input:focus-within {
  border-color: #059669;
  box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.1);
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
  padding: 0.8rem 1rem;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9rem;
  outline: none;
  color: #1f2937;
  appearance: none;
  cursor: pointer;
  transition: 0.2s;
}

.creator-select:focus {
  border-color: #059669;
  box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.1);
}

.creator-textarea {
  width: 100%;
  padding: 1rem;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9rem;
  outline: none;
  color: #1f2937;
  resize: none;
  transition: 0.2s;
}
.creator-textarea:focus {
  border-color: #059669;
  box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.1);
}

.creator-textarea::placeholder {
  color: #9ca3af;
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
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
}

.btn-creator-next {
  padding: 0.8rem 1.75rem;
  background: #059669;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.2s;
}

.btn-creator-next:hover {
  background: #047857;
}

.btn-creator-publish {
  padding: 0.8rem 2rem;
  background: #059669;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.2s;
}

.btn-creator-publish:hover {
  background: #047857;
}

.btn-creator-secondary {
  padding: 0.8rem 2rem;
  background: #ffffff;
  color: #4b5563;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: 0.2s;
}

.btn-creator-secondary:hover {
  background: #f9fafb;
}

.creator-checkbox-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.8rem 1rem;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  height: 46px;
}

.creator-checkbox-card input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #059669;
}

.creator-checkbox-card label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #1f2937;
  margin: 0;
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
  background: #e6f4ea;
  border: 1px solid #a7f3d0;
  color: #059669;
}

.creator-input.highlight-green input {
  color: #059669;
  font-weight: 700;
}

.creator-input.highlight-green input::placeholder {
  color: #059669;
  opacity: 0.7;
}

.creator-input.highlight-green-light {
  background: #e6f4ea;
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
`;

if (startIndex !== -1) {
  const updatedCSS = css.substring(0, startIndex) + newCSS;
  fs.writeFileSync(path, updatedCSS);
  console.log("CSS updated successfully.");
} else {
  console.log("Could not find start index.");
}
