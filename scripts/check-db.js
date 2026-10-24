const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: { patientProfile: true, doctorProfile: true },
  });
  console.log(users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    patientProfileId: u.patientProfile?.id,
    doctorProfileId: u.doctorProfile?.id,
  })));
}

main().catch(console.error).finally(() => prisma.$disconnect());
