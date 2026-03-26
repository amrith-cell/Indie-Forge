import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = ['Action', 'RPG', 'Strategy', 'Simulation', 'Adventure', 'Horror', 'Sports', 'Puzzle'];

async function main() {
  console.log('🌱 Starting Grand Seed (100+ Games)...');

  // 1. Create a Master Developer if not exists
  const developer = await prisma.user.upsert({
    where: { email: 'master_dev@indieforge.com' },
    update: {},
    create: {
      username: 'GrandForgeStudios',
      email: 'master_dev@indieforge.com',
      role: 'DEVELOPER',
    },
  });

  console.log(`✅ Developer ${developer.username} confirmed.`);

  // 2. Generate 110 Games
  const gameData = [];
  for (let i = 1; i <= 110; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const title = `${category} Quest ${i}: The ${['Lost', 'Final', 'Epic', 'Golden', 'Dark', 'Neon'][Math.floor(Math.random() * 6)]} ${['Prophecy', 'Relic', 'Blade', 'Legacy', 'Saga', 'Forge'][Math.floor(Math.random() * 6)]}`;
    
    gameData.push({
      title,
      description: `An incredibly immersive ${category.toLowerCase()} experience featuring procedurally generated ${['worlds', 'challenges', 'dungeons', 'levels'][Math.floor(Math.random() * 4)]}. Discover the ${title.split(':')[1]} today!`,
      category,
      version: `${Math.floor(Math.random() * 2)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
      developerId: developer.id,
    });
  }

  console.log('💾 Inserting Games...');
  
  // Use a loop to create games with assets (assets is a 1:1 relation)
  for (const data of gameData) {
    await prisma.game.create({
      data: {
        ...data,
        assets: {
          create: {
            coverImageUrl: `https://picsum.photos/seed/${Math.random().toString(36).substring(7)}/800/450`,
            trailerUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
            fileUrl: '#',
          }
        }
      }
    });
  }

  console.log('✨ Grand Seed Complete! 110 Games pushed to Production.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
