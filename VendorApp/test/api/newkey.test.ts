import supertest from 'supertest';
import http from 'http';
import requestHandler from './requestHandler';

global.fetch = jest.fn();


let server: http.Server;

const startServer = () => {
  server = http.createServer(requestHandler);
  server.listen(3002);
};

const closeServer = () => {
  server.close();
};

beforeAll(async () => {
  startServer();
});

afterAll(() => {
  closeServer();
});







describe('New keys', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    jest.clearAllMocks();
  });
  afterEach(() => {
    closeServer();
    startServer();
  });
  it('create a new key', async () => {
      
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ id: 'testUser', role: 'vendor' }),
    } as any);
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ id: '1234', key: 'key100' } ),
    } as any);
    
    const response = await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer testToken')
      .send({
        query: `
          mutation newkey{createKey{id,key}}
            `,
      })
      .expect(200);
    expect(response.body.data.createKey).toEqual({ id: '1234', key: 'key100' });
    expect(fetch).toHaveBeenCalledWith('http://localhost:3011/api/v0/authenticate?accessToken=testToken', expect.any(Object));
    expect(fetch).toHaveBeenCalledWith('http://localhost:3013/api/v0/vendor/api/genrate-key', expect.any(Object));
  });

  it('create a new key - Failure', async () => {
      
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ id: 'testUser', role: 'vendor' }),
    } as any);
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    } as any);
    
    const response = await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer testToken')
      .send({
        query: `
          mutation newkey{createKey{id,key}}
            `,
      })
      .expect(200);
    expect(response.body.errors).toBeTruthy()
    expect(fetch).toHaveBeenCalledWith('http://localhost:3011/api/v0/authenticate?accessToken=testToken', expect.any(Object));
    expect(fetch).toHaveBeenCalledWith('http://localhost:3013/api/v0/vendor/api/genrate-key', expect.any(Object));
  });
  it('get a new key - Failure', async () => {
      
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ id: 'testUser', role: 'vendor' }),
    } as any);
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    } as any);
    
    const response = await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer testToken')
      .send({
        query: `
        query keys {
            allkeys { id, key }
          }
            `,
      })
      .expect(200);
    expect(response.body.errors).toBeTruthy()
    expect(fetch).toHaveBeenCalledWith('http://localhost:3011/api/v0/authenticate?accessToken=testToken', expect.any(Object));
    expect(fetch).toHaveBeenCalledWith('http://localhost:3013/api/v0/vendor/api/all-keys', expect.any(Object));
  });

  
  
});  