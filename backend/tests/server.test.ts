import request from 'supertest';
import appExport from '../server';
const app = (appExport as any).default || appExport;

describe('Backend API', () => {
  it('GET /api/games should return 200 and an array of games', async () => {
    const res = await request(app).get('/api/games');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('POST /api/games/upload should create a game (mock)', async () => {
    const newGame = {
      title: 'Jest Example Game',
      missionBrief: 'Testing CI pipeline',
      classification: 'Action',
      buildVersion: '1.0.0'
    };
    
    // We send a POST request but don't strictly assert deep database integration
    // in order to avoid polluting the dev DB in standard runs, but we verify the endpoint behaves.
    const res = await request(app).post('/api/games/upload').send(newGame);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toEqual(newGame.title);
  });
});
