const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const slots = await prisma.appointmentSlot.findMany();
  console.log('Slots in DB:');
  slots.forEach(s => {
    console.log(s.id, s.startTime.toISOString(), s.status);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
