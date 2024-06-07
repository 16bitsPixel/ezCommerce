import supertest from 'supertest';
import http from 'http';
import requestHandler from './requestHandler';

global.fetch = jest.fn();

const mockedFetch = fetch as unknown as jest.Mock;

let server: http.Server;

beforeAll(async () => {
  server = http.createServer(requestHandler);
  server.listen(3002);
});

afterAll(() => {
  server.close();
});


describe('Allkeys', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });
      
  it('Grab all keys', async () => {
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ id: 'testUser', role: 'vendor' }),
    } as any);
  
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue([{ id: '1', key: 'key1' }, { id: '2', key: 'key2' }]),
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
  
    expect(response.body.data.allkeys).toEqual([
      { id: '1', key: 'key1' },
      { id: '2', key: 'key2' },
    ]);
    expect(mockedFetch).toHaveBeenCalledWith('http://localhost:3011/api/v0/authenticate?accessToken=testToken', expect.any(Object));
    expect(mockedFetch).toHaveBeenCalledWith('http://localhost:3013/api/v0/vendor/api/all-keys', expect.any(Object));
  });

  it('Grab all keys but not a vendor', async () => {
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ id: 'testUser', role: 'member' }),
    } as any);
  
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue([{ id: '1', key: 'key1' }, { id: '2', key: 'key2' }]),
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
  
    console.log(response.body);
    
    expect(mockedFetch).toHaveBeenCalledWith('http://localhost:3011/api/v0/authenticate?accessToken=testToken', expect.any(Object));
    expect(response.body.errors[0].message).toBe("Access denied! You don't have permission for this action!");
  });
  it('Grab all keys but no auth header', async () => {
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ id: 'testUser', role: 'member' }),
    } as any);
  
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue([{ id: '1', key: 'key1' }, { id: '2', key: 'key2' }]),
    } as any);
  
    const response = await supertest(server)
      .post('/api/graphql')
      .send({
        query: `
          query keys {
            allkeys { id, key }
          }
          `,
      })
      .expect(200);
  
    expect(response.body.errors[0].message).toBe("Access denied! You don't have permission for this action!");
  });
  it('Grab all keys but not a bearrer is set', async () => {
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ id: 'testUser', role: 'member' }),
    } as any);
  
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue([{ id: '1', key: 'key1' }, { id: '2', key: 'key2' }]),
    } as any);
  
    const response = await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Nothing testToken')
      .send({
        query: `
          query keys {
            allkeys { id, key }
          }
          `,
      })
      .expect(200);
  
    
    expect(response.body.errors[0].message).toBe("Access denied! You don't have permission for this action!");
  });
});