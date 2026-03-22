"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
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
        const formattedGames = games.map((game) => ({
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
const PORT = 3000;
if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log('Database connection initialized.');
    });
}
exports.default = app;
