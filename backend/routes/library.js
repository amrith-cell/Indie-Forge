"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// POST /api/library/add
// Securely adds a game to the logged-in user's permanent library.
router.post('/add', auth_1.requireAuth, async (req, res) => {
    const userId = req.user?.userId;
    const { gameId } = req.body;
    if (!userId || !gameId) {
        res.status(400).json({ error: 'Missing userId or gameId' });
        return;
    }
    try {
        // Check if the game actually exists first
        const gameExists = await prisma.game.findUnique({
            where: { id: gameId }
        });
        if (!gameExists) {
            res.status(404).json({ error: 'Game not found' });
            return;
        }
        // Upsert avoids Prisma Unique Constraint throwing if they click "Add" twice natively.
        const ownership = await prisma.gameOwnership.upsert({
            where: {
                userId_gameId: {
                    userId,
                    gameId
                }
            },
            update: {}, // if it exists, do nothing
            create: {
                userId,
                gameId
            }
        });
        res.status(201).json(ownership);
    }
    catch (error) {
        console.error('Library Add Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// GET /api/library/me
// Retrieves the logged-in user's permanent game collection for the Library page
router.get('/me', auth_1.requireAuth, async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const ownerships = await prisma.gameOwnership.findMany({
            where: { userId },
            include: {
                game: {
                    include: {
                        assets: true,
                        developer: {
                            select: { username: true }
                        }
                    }
                }
            },
            orderBy: { acquiredAt: 'desc' }
        });
        // Format for the frontend Library
        const formattedLibrary = ownerships.map(own => ({
            ownershipId: own.id,
            playtimeHours: own.playtimeHours,
            acquiredAt: own.acquiredAt,
            game: {
                id: own.game.id,
                title: own.game.title,
                description: own.game.description,
                genre: own.game.category,
                version: own.game.version,
                developerName: own.game.developer.username,
                coverUrl: own.game.assets?.coverImageUrl || '',
                trailerUrl: own.game.assets?.trailerUrl || '',
                fileUrl: own.game.assets?.fileUrl || ''
            }
        }));
        res.status(200).json(formattedLibrary);
    }
    catch (error) {
        console.error('Library Fetch Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.default = router;
