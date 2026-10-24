import fs from 'fs';
const navPath = 'C:/Users/Vedant/Desktop/triageai/src/components/layout/Navbar.tsx';
let content = fs.readFileSync(navPath, 'utf8');
content = content.replace(
  'if (pathname?.startsWith("/doctor")) {',
  'if (pathname?.startsWith("/doctor") || pathname === "/login" || pathname === "/register") {'
);
fs.writeFileSync(navPath, content, 'utf8');
console.log('Navbar successfully updated to hide on /login and /register');
