import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("indieforge.db");
db.pragma('foreign_keys = ON');

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    role TEXT,
    accent_color TEXT DEFAULT '#10b981'
  );

  CREATE TABLE IF NOT EXISTS games (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    developer_id TEXT,
    genre TEXT,
    cover_url TEXT,
    trailer_url TEXT,
    file_url TEXT,
    FOREIGN KEY(developer_id) REFERENCES users(id)
  );
`);

// OOP Models
class User {
  constructor(
    public id: string,
    public username: string,
    public email: string,
    public role: 'gamer' | 'developer',
    public accentColor: string = '#10b981'
  ) {}

  static findById(id: string): User | null {
    const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as any;
    if (!row) return null;
    return new User(row.id, row.username, row.email, row.role, row.accent_color);
  }
}

class Game {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public developerId: string,
    public genre: string,
    public coverUrl: string,
    public trailerUrl: string,
    public fileUrl: string
  ) {}

  static getAll(): Game[] {
    const rows = db.prepare("SELECT * FROM games").all() as any[];
    return rows.map(r => new Game(r.id, r.title, r.description, r.developer_id, r.genre, r.cover_url, r.trailer_url, r.file_url));
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/games", (req, res) => {
    const games = Game.getAll();
    res.json(games);
  });

  app.post("/api/games/upload", (req, res) => {
    const { title, missionBrief, classification, buildVersion } = req.body;
    
    // Defaulting missing fields that were in the old schema
    const id = Math.random().toString(36).substr(2, 9);
    const developerId = 'dev1';
    const coverUrl = 'https://picsum.photos/seed/' + id + '/800/450';
    const trailerUrl = '';
    const fileUrl = buildVersion ? '#v' + buildVersion : '#';

    try {
      db.prepare(`
        INSERT INTO games (id, title, description, developer_id, genre, cover_url, trailer_url, file_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, title, missionBrief || '', developerId, classification || 'Action', coverUrl, trailerUrl, fileUrl);
      res.status(201).json({ message: "Game published successfully" });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // Seed data if empty
  const userCount = (db.prepare("SELECT COUNT(*) as count FROM users").get() as any).count;
  if (userCount === 0) {
    db.prepare("INSERT INTO users (id, username, email, role) VALUES (?, ?, ?, ?)").run('dev1', 'indie_master', 'dev1@example.com', 'developer');
    db.prepare("INSERT INTO users (id, username, email, role) VALUES (?, ?, ?, ?)").run('dev2', 'pixel_pro', 'dev2@example.com', 'developer');
  }

  const gameCount = (db.prepare("SELECT COUNT(*) as count FROM games").get() as any).count;
  if (gameCount === 0) {
    const sampleGames = [
      { id: '1', title: 'Neon Drifter', description: 'High-speed synthwave racing.', developerId: 'dev1', genre: 'Action', coverUrl: 'https://picsum.photos/seed/neon/800/450', trailerUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', fileUrl: '#' },
      { id: '2', title: 'Forest Quest', description: 'Explore a vast, magical forest.', developerId: 'dev1', genre: 'Open-World', coverUrl: 'https://picsum.photos/seed/forest/800/450', trailerUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', fileUrl: '#' },
      { id: '3', title: 'Cyber Strike', description: 'Tactical shooter in a dystopian future.', developerId: 'dev2', genre: 'Action', coverUrl: 'https://picsum.photos/seed/cyber/800/450', trailerUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', fileUrl: '#' },
    ];
    sampleGames.forEach(g => {
      db.prepare(`INSERT INTO games (id, title, description, developer_id, genre, cover_url, trailer_url, file_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(g.id, g.title, g.description, g.developerId, g.genre, g.coverUrl, g.trailerUrl, g.fileUrl);
    });
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
