import fs from 'fs';
const sidebarPath = 'C:/Users/Vedant/Desktop/ThinkFirst/scratch_sidebar.tsx';
let content = fs.readFileSync(sidebarPath, 'utf8');
content = content.replace('patientName = "Rajesh Sharma"', 'patientName = "Patient Account"');
fs.writeFileSync(sidebarPath, content, 'utf8');
fs.writeFileSync('C:/Users/Vedant/Desktop/triageai/src/components/layout/PatientSidebar.tsx', content, 'utf8');
console.log('Sidebar patientName default updated to Patient Account');
