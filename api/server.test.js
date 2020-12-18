const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');

const userA = { username: 'LambdaStudent', password: '1234' };
const userB = { username: 'LambdaStaff', password: '5678' };
const userC = { username: 'Lambda', password: '9012' };

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db('users').truncate();
});
afterAll(async () => {
  await db.destroy();
});

it('sanity', () => {
  expect(true).not.toBe(false);
});

describe('server', () => {
  describe('auth endpoints', () => {
    describe('[POST] /api/auth/register', () => {
      it('adds a new user', async () => {
        await request(server).post('/api/auth/register').send(userA);
        const user = await db('users').first();
        expect(user.username).toBe(userA.username);
      });
      it('responds with proper status code', async () => {
        const user = await request(server).post('/api/auth/register').send(userA);
        expect(user.status).toBe(201);
      });
    });
    describe('[POST] /api/auth/login', () => {
      beforeEach(async () => {
        await request(server).post('/api/auth/register').send(userB);
      });
      it('can successfully login', async () => {
        const userLogin = await request(server).post('/api/auth/login').send(userB);
        expect(userLogin.body.message).toBe(`Welcome back ${userB.username}`);
      });
      it('responds with proper status code', async () => {
        const userLogin = await request(server).post('/api/auth/login').send(userB);
        expect(userLogin.status).toBe(200);
      });
    });
  });
  describe('jokes endpoint', () => {
    describe('[GET] /api/jokes', () => {
      beforeEach(async () => {
        await request(server).post('/api/auth/register').send(userC);
      });
      it('can successfully fetch jokes', async () => {
        const { body: { token } } = await request(server).post('/api/auth/login').send(userC);
        const res = await request(server).get('/api/jokes').set('Authorization', token);
        expect(res.body.length).toBe(3);
      });
      it('responds with proper status code', async () => {
        const { body: { token } } = await request(server).post('/api/auth/login').send(userC);
        const res = await request(server).get('/api/jokes').set('Authorization', token);
        expect(res.status).toBe(200);
      });
    });
  });
});
