import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Create a test developer if none exists for the mock uploads
async function ensureMockDeveloper() {
  let dev = await prisma.user.findFirst({
    where: { role: 'DEVELOPER' }
  });
  if (!dev) {
    dev = await prisma.user.create({
      data: {
        username: 'IndieDevMaster',
        email: 'dev@indieforge.com',
        role: 'DEVELOPER'
      }
    });
  }
  return dev;
}

app.get('/api/games', async (req, res) => {
  try {
    const games = await prisma.game.findMany({
      include: {
        assets: true,
        developer: true
      }
    });
    // Transform data to match frontend expectations if necessary
    const formattedGames = games.map((game: any) => ({
      id: game.id,
      title: game.title,
      description: game.description,
      genre: game.category,
      coverUrl: game.assets?.coverImageUrl || '',
      trailerUrl: game.assets?.trailerUrl || '',
      fileUrl: game.assets?.fileUrl || '',
      developerId: game.developerId,
    }));
    res.json(formattedGames);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/api/games/upload', async (req, res) => {
  const { title, missionBrief, classification, buildVersion } = req.body;
  
  try {
    const dev = await ensureMockDeveloper();

    const newGame = await prisma.game.create({
      data: {
        title,
        description: missionBrief || '',
        category: classification || 'Action',
        version: buildVersion || '1.0.0',
        developerId: dev.id,
        assets: {
          create: {
            coverImageUrl: `https://picsum.photos/seed/${Math.random().toString(36).substring(7)}/800/450`,
            trailerUrl: '',
            fileUrl: buildVersion ? `#v${buildVersion}` : '#'
          }
        }
      },
      include: {
        assets: true,
        developer: true
      }
    });

    res.status(201).json(newGame);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

const PORT = 3000;

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Database connection initialized.');
  });
}

export default app;
