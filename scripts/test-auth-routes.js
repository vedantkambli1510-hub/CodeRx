const http = require('http');

function loginAs(email, name, role) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ email, name, role });
    const req = http.request(
      'http://localhost:3000/api/auth/google',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          const rawCookies = res.headers['set-cookie'];
          const sessionCookie = rawCookies ? rawCookies.map(c => c.split(';')[0]).join('; ') : '';
          resolve({ statusCode: res.statusCode, cookie: sessionCookie, body });
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function getRoute(route, cookie) {
  return new Promise((resolve) => {
    const req = http.request(
      `http://localhost:3000${route}`,
      {
        headers: cookie ? { Cookie: cookie } : {},
      },
      (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          resolve({ statusCode: res.statusCode, length: body.length });
        });
      }
    );
    req.on('error', (e) => resolve({ statusCode: 'ERR: ' + e.message }));
    req.end();
  });
}

async function runTests() {
  console.log('--- Testing Doctor Flow ---');
  const docLogin = await loginAs('doctor@coderx.local', 'Dr. Aarav Mehta', 'DOCTOR');
  console.log('Doctor Login:', docLogin.statusCode, docLogin.cookie ? 'Cookie received' : 'No cookie');

  const doctorRoutes = [
    '/doctor',
    '/doctor/patients',
    '/doctor/patients/cmupvr0q70003yfjcajz9rela',
    '/doctor/reviews',
    '/doctor/records',
    '/doctor/medicines',
    '/doctor/prescriptions',
    '/doctor/availability',
    '/doctor/payments',
    '/doctor/notifications',
  ];

  for (const r of doctorRoutes) {
    const res = await getRoute(r, docLogin.cookie);
    console.log(`[Doctor] GET ${r} -> ${res.statusCode} (length: ${res.length})`);
  }

  console.log('\n--- Testing Patient Flow ---');
  const patLogin = await loginAs('patient@coderx.local', 'Rajesh Sharma', 'PATIENT');
  console.log('Patient Login:', patLogin.statusCode, patLogin.cookie ? 'Cookie received' : 'No cookie');

  const patientRoutes = [
    '/patient',
    '/patient/timeline',
    '/patient/records',
    '/patient/compare',
    '/patient/medicines',
    '/patient/prescriptions',
    '/patient/notifications',
    '/patient/appointments',
    '/patient/appointments/book',
  ];

  for (const r of patientRoutes) {
    const res = await getRoute(r, patLogin.cookie);
    console.log(`[Patient] GET ${r} -> ${res.statusCode} (length: ${res.length})`);
  }
}

runTests().catch(console.error);
