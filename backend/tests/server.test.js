"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const app = server_1.default.default || server_1.default;
describe('Backend API', () => {
    it('GET /api/games should return 200 and an array of games', async () => {
        const res = await (0, supertest_1.default)(app).get('/api/games');
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
        const res = await (0, supertest_1.default)(app).post('/api/games/upload').send(newGame);
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error');
    });
});
