const app = require('../src/app');

describe('App', () => {
  it('GET /address responds with 200', () => {
    return supertest(app)
      .get('/address')
      .expect(200);
  });
});