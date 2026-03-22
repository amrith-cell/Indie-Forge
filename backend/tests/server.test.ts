import request from 'supertest';
import appExport from '../server';
const app = (appExport as any).default || appExport;

describe('Backend API', () => {
  it('GET /api/games should return 200 and an array of games', async () => {
    const res = await request(app).get('/api/games');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('POST /api/games/upload should return 401 without auth token', async () => {
    const newGame = {
      title: 'Jest Example Game',
      missionBrief: 'Testing CI pipeline constraints',
      classification: 'Action',
      buildVersion: '1.0.0'
    };
    
    // We expect the new requireAuth middleware to intercept this and throw a 401
    // since we do not have a valid JWT Bearer assigned to the supertest request.
    const res = await request(app).post('/api/games/upload').send(newGame);
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error');
  });
});
