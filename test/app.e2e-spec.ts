import request from 'supertest';

describe('ItemsController (e2e)', () => {
  let app: any;

  beforeAll(async () => {
    const { AppModule } = await import('../src/app.module');
    const { Test } = await import('@nestjs/testing');
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/items (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/items');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('/items (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/items')
      .send({ id: 'X3', name: 'Lycée Test', latitude: 48.87, longitude: 2.37 });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id', 'X3');
  });
});
