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
    it('should return all vendors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: 'testUser', role: 'admin' }),
      } as any);
      const vendors: Vendor[] = [
        { vendorId: 'a850e33f-d50f-4b85-becb-6d7f2e5879ae', accepted: 'true', name: 'Vendor 1' },
        { vendorId: 'cd5cca67-b5ab-4fc9-a264-714215bd95b3', accepted: 'true', name: 'Vendor 2' },
      ];
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(vendors),
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
      
      expect(response.body.data.getVendors).toEqual(vendors);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3011/api/v0/Vendor', expect.any(Object));
    });
  });
  
  describe('getpendingVendors', () => {
    it('should return pending vendors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: 'testUser', role: 'admin' }),
      } as any);
      const pendingVendors: Vendor[] = [
        { vendorId: 'cd5cca67-b5ab-4fc9-a264-714215bd95b3', accepted: 'false', name: 'Vendor 2' },
      ];
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(pendingVendors),
      } as any);  
  
      const response = await supertest(server)
        .post('/api/graphql')
        .set('Authorization', 'Bearer testToken')
        .send({
          query: `
              query {
                getpendingVendors {
                  vendorId
                  accepted
                  name
                }
              }
            `,
        })
        .expect(200);
      expect(response.body.data.getpendingVendors).toEqual(pendingVendors);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3011/api/v0/Vendor/Pending', expect.any(Object));
    });
  });
  
  describe('acceptVendors', () => {
    it('should accept a vendor and return the accepted vendor', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: 'testUser', role: 'admin' }),
      } as any);
      const vendor: Vendor = 
        { vendorId: 'cd5cca67-b5ab-4fc9-a264-714215bd95b3', accepted: 'true', name: 'Vendor 1' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(vendor),
      } as any);  
  
      const response = await supertest(server)
        .post('/api/graphql')
        .set('Authorization', 'Bearer testToken')
        .send({
          query: `
              mutation {
                acceptVendors(input: { id: "cd5cca67-b5ab-4fc9-a264-714215bd95b3" }) {
                  vendorId
                  accepted
                  name
                }
              }
            `,
        })
        .expect(200);
      console.log(response.body);
      expect(response.body.data.acceptVendors).toEqual(vendor);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3011/api/v0/Verify/Vendor?vendorId=cd5cca67-b5ab-4fc9-a264-714215bd95b3', expect.any(Object));
    });
  });
  describe('not correct role', () => {
    it('role is vednor should be admin ', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: 'testUser', role: 'vendor'}),
      } as any);
      const vendor: Vendor = 
        { vendorId: 'cd5cca67-b5ab-4fc9-a264-714215bd95b3', accepted: 'true', name: 'Vendor 1' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(vendor),
      } as any);  
  
      const response = await supertest(server)
        .post('/api/graphql')
        .set('Authorization', 'Bearer testToken')
        .send({
          query: `
              mutation {
                acceptVendors(input: { id: "cd5cca67-b5ab-4fc9-a264-714215bd95b3" }) {
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
});