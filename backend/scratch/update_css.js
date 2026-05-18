const fs = require('fs');
const path = 'c:\\Users\\91733\\OneDrive\\Desktop\\hostelmanagement\\Hostel_Hub\\frontend\\owner\\src\\pages\\InventoryMaster.css';

let css = fs.readFileSync(path, 'utf8');

const startIndex = css.indexOf('/* Elite Inventory Creator (Screenshot Match) */');
const endIndex = css.indexOf('/* Loader */');

const newCSS = `/* Elite Inventory Creator (Screenshot Match) */
.creator-modal {
  width: 100%;
  max-width: 1050px;
  background: white;
  margin: 2rem auto;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.06);
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
  padding: 1.5rem 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fcfcfc;
}

.btn-back-link {
  background: transparent;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: #4b5563;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: 0.2s;
}
.btn-back-link:hover {
  background: #f9fafb;
}

.draft-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  font-weight: 800;
  color: #10b981;
  background: #ecfdf5;
  padding: 0.6rem 1.25rem;
  border-radius: 100px;
  letter-spacing: 0.05em;
}

.plus-icon {
  border-radius: 50%;
  padding: 1px;
}

.creator-tabs-container {
  padding: 0 2.5rem;
  border-bottom: 2px solid #f3f4f6;
}

.creator-tabs {
  display: flex;
  gap: 2rem;
}

.tab-item {
  padding: 1rem 0;
  font-size: 0.85rem;
  font-weight: 800;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  transition: 0.2s;
  letter-spacing: 0.02em;
  margin-bottom: -2px;
}

.tab-item.active {
  color: #10b981;
  border-bottom: 2px solid #10b981;
}

.creator-content {
  padding: 2.5rem;
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
  background: #f9fafb;
  border: 2px dashed #e5e7eb;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #d1d5db;
  cursor: pointer;
  transition: 0.2s;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.05em;
}

.upload-box-square:hover {
  background: #f3f4f6;
  border-color: #10b981;
  color: #9ca3af;
}

.creator-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 1.5rem;
}

.desc-group {
  margin-bottom: 1rem;
}

.creator-input-group label {
  font-size: 0.65rem;
  font-weight: 800;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.creator-input {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.85rem 1rem;
  background: #f9fafb;
  border: 1px solid transparent;
  border-radius: 12px;
  transition: 0.2s;
  color: #d1d5db;
}

.creator-input.no-icon {
  padding: 0.85rem 1.25rem;
}

.creator-input:focus-within {
  background: white;
  border-color: #10b981;
  color: #10b981;
}

.creator-input input {
  border: none;
  background: transparent;
  width: 100%;
  font-weight: 700;
  outline: none;
  font-size: 0.9rem;
  color: #4b5563;
}

.creator-input input::placeholder {
  color: #9ca3af;
  font-weight: 600;
}

.creator-select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.creator-select-wrapper .select-icon {
  position: absolute;
  right: 1rem;
  color: #d1d5db;
  pointer-events: none;
}

.creator-select {
  width: 100%;
  padding: 0.85rem 1.25rem;
  background: #f9fafb;
  border: 1px solid transparent;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9rem;
  outline: none;
  color: #111827;
  appearance: none;
  cursor: pointer;
  transition: 0.2s;
}

.creator-select:focus {
  background: white;
  border-color: #10b981;
}

.creator-textarea {
  width: 100%;
  padding: 1.25rem;
  background: #f9fafb;
  border: 1px solid transparent;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  outline: none;
  color: #4b5563;
  resize: none;
  transition: 0.2s;
}
.creator-textarea:focus {
  background: white;
  border-color: #10b981;
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
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
}

.btn-creator-next {
  padding: 0.85rem 1.5rem;
  background: #ecfdf5;
  color: #10b981;
  border: none;
  border-radius: 10px;
  font-weight: 800;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.2s;
  letter-spacing: 0.05em;
}

.btn-creator-next:hover {
  background: #d1fae5;
}

.btn-creator-publish {
  padding: 0.85rem 1.75rem;
  background: #86efac;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 800;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.2s;
  letter-spacing: 0.05em;
}

.btn-creator-publish:hover {
  background: #4ade80;
}

.btn-creator-secondary {
  padding: 0.85rem 1.75rem;
  background: transparent;
  color: #9ca3af;
  border: none;
  font-weight: 800;
  font-size: 0.75rem;
  cursor: pointer;
  letter-spacing: 0.05em;
}

.creator-checkbox-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.85rem 1.25rem;
  background: #f9fafb;
  border: 1px solid transparent;
  border-radius: 12px;
  height: 48px; /* align with inputs */
}

.creator-checkbox-card input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #10b981;
}

.creator-checkbox-card label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #4b5563;
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
}

.meta-col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.calc-label, .gross-margin {
  font-size: 0.7rem;
  font-weight: 800;
  color: #9ca3af;
  letter-spacing: 0.05em;
}

.black-text {
  color: #111827;
  font-size: 0.85rem;
}

.green-text {
  color: #10b981;
  font-size: 0.85rem;
}

.final-btns {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.creator-input.highlight-green {
  background: #f0fdf4;
  border: 1px solid #d1fae5;
  color: #10b981;
}

.creator-input.highlight-green input {
  color: #10b981;
}

.creator-input.highlight-green-light {
  background: #f0fdf4;
  border: 1px solid #d1fae5;
  position: relative;
  color: #10b981;
}

.bold-input {
  font-weight: 800 !important;
  color: #10b981 !important;
}

.incl-gst {
  font-size: 0.65rem;
  font-weight: 800;
  color: #10b981;
  position: absolute;
  right: 1.25rem;
}

.scan-icon {
  color: #10b981;
  cursor: pointer;
}

.curr {
  font-weight: 700;
  color: #9ca3af;
}

`;

if (startIndex !== -1 && endIndex !== -1) {
  const updatedCSS = css.substring(0, startIndex) + newCSS + css.substring(endIndex);
  fs.writeFileSync(path, updatedCSS);
  console.log("CSS updated successfully.");
} else {
  console.log("Could not find start or end index.");
}
