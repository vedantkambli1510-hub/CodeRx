const fs = require('fs');
let code = fs.readFileSync('c:/Users/Vedant/Desktop/triageai/src/app/doctor/patients/DoctorPatientsClient.tsx', 'utf8');

// Replace border-slate-200/90 with border-[#EFE8DE]
code = code.replace(/border-slate-200\/90/g, 'border-[#EFE8DE]');
// Replace input background
code = code.replace(/bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500\/20 focus:border-teal-500/g, 'bg-[#F3EDE4] border border-[#E7DFD1] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C89B5F]/20 focus:border-[#C89B5F]');

fs.writeFileSync('c:/Users/Vedant/Desktop/triageai/src/app/doctor/patients/DoctorPatientsClient.tsx', code);
console.log('Successfully aligned DoctorPatientsClient.tsx borders with warm cream theme!');
