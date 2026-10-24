const http = require('http');

async function testBookingFlow() {
  // 1. Patient login
  const patientAuthData = JSON.stringify({
    email: 'patient@coderx.local',
    name: 'Rajesh Sharma',
    role: 'PATIENT',
  });

  const cookie = await new Promise((resolve) => {
    const req = http.request(
      'http://localhost:3000/api/auth/google',
      { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      (res) => resolve(res.headers['set-cookie']?.map(c => c.split(';')[0]).join('; '))
    );
    req.write(patientAuthData);
    req.end();
  });

  // 2. Fetch slots
  const slotsData = await new Promise((resolve) => {
    http.get('http://localhost:3000/api/appointments/slots', (res) => {
      let b = '';
      res.on('data', d => b += d);
      res.on('end', () => resolve(JSON.parse(b)));
    });
  });

  console.log('Available slots count:', slotsData.doctor?.slots?.length);
  const targetSlot = slotsData.doctor?.slots?.[0];

  if (!targetSlot) {
    console.log('No available slot found to book.');
    return;
  }

  console.log('Attempting to book slot:', targetSlot.id, targetSlot.startTime);

  // 3. Book slot
  const bookPayload = JSON.stringify({
    slotId: targetSlot.id,
    doctorId: slotsData.doctor.id,
  });

  const bookRes = await new Promise((resolve) => {
    const req = http.request(
      'http://localhost:3000/api/appointments/book',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(bookPayload),
          Cookie: cookie,
        },
      },
      (res) => {
        let b = '';
        res.on('data', d => b += d);
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(b) }));
      }
    );
    req.write(bookPayload);
    req.end();
  });

  console.log('Booking Result:', bookRes.status, bookRes.body.success ? 'SUCCESS' : bookRes.body.error);
}

testBookingFlow().catch(console.error);
