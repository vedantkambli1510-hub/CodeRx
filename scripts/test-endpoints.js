const http = require('http');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testRoute(path, cookie = '') {
  return new Promise((resolve) => {
    const req = http.request(
      `http://localhost:3000${path}`,
      {
        headers: cookie ? { Cookie: cookie } : {},
      },
      (res) => {
        resolve({ path, statusCode: res.statusCode });
      }
    );
    req.on('error', (err) => resolve({ path, error: err.message }));
    req.end();
  });
}

async function main() {
  const doctor = await prisma.user.findFirst({ where: { role: 'DOCTOR' } });
  const patient = await prisma.user.findFirst({ where: { role: 'PATIENT' } });
  const patientProfile = await prisma.patientProfile.findFirst({
    include: { user: true },
  });

  console.log('Seeded Doctor:', doctor?.email);
  console.log('Seeded Patient:', patient?.email);
  console.log('Patient Profile ID:', patientProfile?.id);

  // We can create mock session tokens for testing protected routes
  // Let's test public and core pages first
  const publicRoutes = [
    '/',
    '/login',
  ];

  for (const r of publicRoutes) {
    const res = await testRoute(r);
    console.log(`[Public] ${r} -> ${res.statusCode}`);
  }

  if (patientProfile) {
    console.log(`Testing patient workspace URL: /doctor/patients/${patientProfile.id}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
