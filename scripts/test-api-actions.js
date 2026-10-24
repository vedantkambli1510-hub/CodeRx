const http = require('http');

function postJson(path, data, cookie) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request(
      `http://localhost:3000${path}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
          ...(cookie ? { Cookie: cookie } : {}),
        },
      },
      (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch {
            resolve({ status: res.statusCode, body });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function testActions() {
  console.log('Testing interactive API actions...');

  // 1. Doctor login
  const docLogin = await postJson('/api/auth/google', {
    email: 'doctor@coderx.local',
    name: 'Dr. Aarav Mehta',
    role: 'DOCTOR',
  });
  const cookie = docLogin.data?.role ? 'triageai_session=' : '';

  // Get cookie header properly
  const docRes = await new Promise((resolve) => {
    const req = http.request('http://localhost:3000/api/auth/google', { method: 'POST', headers: { 'Content-Type': 'application/json' } }, res => {
      resolve(res.headers['set-cookie']?.map(c => c.split(';')[0]).join('; '));
    });
    req.write(JSON.stringify({ email: 'doctor@coderx.local', name: 'Dr. Aarav Mehta', role: 'DOCTOR' }));
    req.end();
  });

  // 2. Create Prescription
  const rxRes = await postJson('/api/doctor/prescriptions', {
    patientId: 'cmupvr0q70003yfjcajz9rela',
    diagnosis: 'Type 2 Diabetes Mellitus with Renal Trajectory Shift',
    medicines: [
      { name: 'Metformin', dosage: '500 mg', frequency: 'Once daily with dinner', duration: '30 days', instructions: 'Renal-sparing dose' },
      { name: 'Telmisartan', dosage: '40 mg', frequency: 'Once daily morning', duration: '30 days', instructions: 'After food' },
    ],
    advice: 'Drink plenty of water. Avoid NSAID analgesics. Repeat creatinine in 3 weeks.',
    followUpDate: 'In 3 weeks with repeat renal panel',
    sendEmail: true,
  }, docRes);

  console.log('Create Prescription:', rxRes.status, rxRes.data?.success ? 'SUCCESS' : 'FAILED');

  if (rxRes.data?.prescription?.id) {
    const emailRes = await postJson(`/api/doctor/prescriptions/${rxRes.data.prescription.id}/email`, {}, docRes);
    console.log('Dispatch Email:', emailRes.status, emailRes.data?.success ? 'SUCCESS' : 'FAILED');
  }

  // 3. Create Slot
  const slotRes = await postJson('/api/doctor/slots', {
    date: '2026-10-15',
    startTime: '11:00',
    duration: 30,
  }, docRes);

  console.log('Create Availability Slot:', slotRes.status, slotRes.data?.success ? 'SUCCESS' : 'FAILED');
}

testActions().catch(console.error);
