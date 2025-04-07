// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

const loadJSON = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const main = async () => {
  console.log('🌱 Seeding database...');

  // Load data from JSON files
  const users = loadJSON('./prisma/data/users.json');
  const projects = loadJSON('./prisma/data/projects.json');
  const experiences = loadJSON('./prisma/data/workExperiences.json');
  const certificates = loadJSON('./prisma/data/certificates.json');
  const educations = loadJSON('./prisma/data/educations.json');

  // Seed users first (required for foreign keys)
  for (const user of users) {
    await prisma.user.create({ data: user });
  }

  // Then seed other entities
  for (const item of projects) {
    await prisma.project.create({ data: item });
  }

  for (const item of experiences) {
    await prisma.workExperience.create({ data: item });
  }

  for (const item of certificates) {
    await prisma.certificate.create({ data: item });
  }

  for (const item of educations) {
    await prisma.education.create({ data: item });
  }

  console.log('✅ Database seeded!');
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
