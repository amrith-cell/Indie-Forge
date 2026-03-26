"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-indie-forge-key-2024';
// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        // Check if user exists
        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ email }, { username }] }
        });
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create user
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: role || 'GAMER'
            }
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user.id, username: user.username, role: user.role } });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});
// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Check pass
        const isValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ token, user: { id: user.id, username: user.username, role: user.role } });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
});
exports.default = router;
