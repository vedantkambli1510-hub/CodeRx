import fs from 'fs';

// 1. Update doctor/layout.tsx
const layoutPath = 'C:/Users/Vedant/Desktop/triageai/src/app/doctor/layout.tsx';
let layoutContent = fs.readFileSync(layoutPath, 'utf8');
layoutContent = layoutContent.replace('user.name || "Dr. Aarav Mehta"', 'user.name || "Attending Physician"');
fs.writeFileSync(layoutPath, layoutContent, 'utf8');

// 2. Update DoctorHeader.tsx
const headerPath = 'C:/Users/Vedant/Desktop/triageai/src/components/layout/DoctorHeader.tsx';
let headerContent = fs.readFileSync(headerPath, 'utf8');
headerContent = headerContent.replace('doctorName = "Dr. Aarav Mehta"', 'doctorName = "Attending Physician"');
fs.writeFileSync(headerPath, headerContent, 'utf8');

// 3. Update DoctorSidebar.tsx
const sidebarPath = 'C:/Users/Vedant/Desktop/triageai/src/components/layout/DoctorSidebar.tsx';
let sidebarContent = fs.readFileSync(sidebarPath, 'utf8');
sidebarContent = sidebarContent.replace('doctorName = "Dr. Aarav Mehta"', 'doctorName = "Attending Physician"');
fs.writeFileSync(sidebarPath, sidebarContent, 'utf8');

console.log('Doctor components updated to generic Attending Physician fallback');
