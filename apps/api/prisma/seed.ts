import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.landmark.deleteMany({});
  await prisma.destination.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Cleared database.');

  // Create Destinations & Landmarks
  const hanoi = await prisma.destination.create({
    data: {
      title: 'Hanoi',
      description: 'The capital of Vietnam, known for its centuries-old architecture and a rich culture with Southeast Asian, Chinese and French influences.',
      latitude: 21.0285,
      longitude: 105.8542,
      coverImage: '/images/destinations/hanoi.jpg',
      modelUrl: '/models/scenes/hanoi_scene.glb',
      landmarks: {
        create: [
          {
            title: 'Hoan Kiem Lake',
            description: 'A lake in the historical center of Hanoi, the capital of Vietnam. The lake is one of the major scenic spots in the city and serves as a focal point for its public life.',
            latitude: 21.0285,
            longitude: 105.8520,
            modelUrl: '/models/landmarks/hoan_kiem_lake.glb',
          },
          {
            title: 'One Pillar Pagoda',
            description: 'A historic Buddhist temple in Hanoi, the capital of Vietnam. It is regarded alongside the Perfume Temple, as one of Vietnam\'s two most iconic temples.',
            latitude: 21.0358,
            longitude: 105.8331,
            modelUrl: '/models/landmarks/one_pillar_pagoda.glb',
          }
        ]
      }
    }
  });

  const hue = await prisma.destination.create({
    data: {
      title: 'Hue',
      description: 'A city in central Vietnam that was the seat of Nguyen Dynasty emperors and the capital of Vietnam from 1802 to 1945.',
      latitude: 16.4637,
      longitude: 107.5909,
      coverImage: '/images/destinations/hue.jpg',
      modelUrl: '/models/scenes/hue_scene.glb',
      landmarks: {
        create: [
          {
            title: 'Imperial City',
            description: 'A walled enclosure within the citadel of the city of Hue, the former imperial capital of Vietnam.',
            latitude: 16.4637,
            longitude: 107.5780,
            modelUrl: '/models/landmarks/imperial_city.glb',
          }
        ]
      }
    }
  });

  const hoian = await prisma.destination.create({
    data: {
      title: 'Hoi An',
      description: 'A city on Vietnam\'s central coast known for its well-preserved Ancient Town, cut through with canals.',
      latitude: 15.8801,
      longitude: 108.3380,
      coverImage: '/images/destinations/hoian.jpg',
      modelUrl: '/models/scenes/hoian_scene.glb',
      landmarks: {
        create: [
          {
            title: 'Ancient Town',
            description: 'An exceptionally well-preserved example of a Southeast Asian trading port from the 15th to the 19th century.',
            latitude: 15.8801,
            longitude: 108.3268,
            modelUrl: '/models/landmarks/ancient_town.glb',
          }
        ]
      }
    }
  });

  // Seed a default admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@tourism.com',
      password: '$argon2id$v=19$m=65536,t=3,p=4$Y216d2RreHByZGVmZ2hpag$R3hWUTlVTEg2Tnl1Zlp2aGZ3WTRKQXpHWnZZS2F5UEQ',
      name: 'Admin User',
      role: 'ADMIN',
    }
  });

  console.log({ hanoi, hue, hoian, admin });
  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
