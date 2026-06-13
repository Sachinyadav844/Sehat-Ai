import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding hospital, doctor, and disease master data');

  const hospitals = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'hospitals.seed.json'), 'utf-8'));
  const doctors = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'doctors.seed.json'), 'utf-8'));
  const diseases = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'diseases.seed.json'), 'utf-8'));

  for (const hospital of hospitals) {
    await prisma.hospital.upsert({
      where: { hospitalName: hospital.hospitalName },
      update: {},
      create: hospital,
    });
  }

  for (const doctor of doctors) {
    const hospital = await prisma.hospital.findUnique({ where: { hospitalName: doctor.hospitalName } });
    if (!hospital) continue;
    await prisma.doctor.upsert({
      where: { name: doctor.name },
      update: {},
      create: {
        name: doctor.name,
        specialty: doctor.specialty,
        hospitalId: hospital.id,
        contact: doctor.contact,
      },
    });
  }

  for (const disease of diseases) {
    await prisma.disease.upsert({
      where: { name: disease.name },
      update: {},
      create: disease,
    });
  }

  console.log('Seeding complete');
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
