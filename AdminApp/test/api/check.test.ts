import supertest from 'supertest';
import http from 'http';
import requestHandler from './requestHandler'; // Adjust the import path

global.fetch = jest.fn();

let server: http.Server;

beforeAll(async () => {
  server = http.createServer(requestHandler);
  server.listen(3001);
});

afterAll(() => {
  server.close();
});

export const anna = {
  email: 'anna@books.com',
  password: 'annaadmin',
  name: "Anna Admin",
};

export interface Vendor {
  vendorId: string;
  accepted: string;
  name: string;
}


describe('VendorResolver', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('getVendors', () => {
    it('ftch rejected', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      } as any);
      const response = await supertest(server)
        .post('/api/graphql')
        .set('Authorization', 'Bearer testToken')
        .send({
          query: `
              query {
                getVendors {
                  vendorId
                  accepted
                  name
                }
              }
            `,
        })
        .expect(200);
      
      expect(response.body.errors).toBeTruthy();
    });
  });
  it('no headers so rejected', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    } as any);
    const response = await supertest(server)
      .post('/api/graphql')
      .send({
        query: `
            query {
              getVendors {
                vendorId
                accepted
                name
              }
            }
          `,
      })
      .expect(200);
    
    expect(response.body.errors).toBeTruthy();
  });
  it('authorization but not so rejected', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    } as any);
    const response = await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Not testToken')
      .send({
        query: `
            query {
              getVendors {
                vendorId
                accepted
                name
              }
            }
          `,
      })
      .expect(200);
    
    expect(response.body.errors).toBeTruthy();
  });

});
  