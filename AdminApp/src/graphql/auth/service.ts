import { Credentials, Authenticated, SignupCred } from './schema';
import { SessionUser } from '../../types/next';
import type { Vendor } from './schema'

export class VendorService{
  async all(): Promise<Vendor[]> {
    const res = await fetch('http://localhost:3011/api/v0/Vendor', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return res.json()
  }
  async pendingall(): Promise<Vendor[]> {
    const res = await fetch('http://localhost:3011/api/v0/Vendor/Pending', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return res.json()
  }
  async accept(id:string): Promise<Vendor> {
    const res = await fetch('http://localhost:3011/api/v0/Verify/Vendor?vendorId='+id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return res.json()
  }
}

export class AuthService {
  public async login(credentials: Credentials): Promise<Authenticated>  {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:3011/api/v0/authenticate', {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw res
          }
          return res.json()
        })
        .then((authenticated) => {
          resolve(authenticated)
        })
        .catch(() => {
          reject(new Error("Unauthorised"))
        });
    });
  }

  public async check(authHeader?: string, roles?: string[]): Promise<SessionUser> {
    return new Promise((resolve, reject) => {
      if (!authHeader) {
        reject(new Error("Unauthorised"))
      }
      else {
        const tokens = authHeader.split(' ');
        if (tokens.length != 2 || tokens[0] !== 'Bearer') {
          reject(new Error("Unauthorised"))
        }
        else {
          fetch('http://localhost:3011/api/v0/authenticate?accessToken=' + tokens[1], {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((res) => {
              if (!res.ok) {
                throw res;
              }
              return res.json();
            })
            .then((sessionUser) => {
              if (roles){
                if (!roles.includes(sessionUser.role)) {
                  reject(new Error("Unauthorised"))
                }
              }
              resolve({id: sessionUser.id});
            })
            .catch(() => {
              reject(new Error("Unauthorised"))
            });
        }
      }
    });
  }

  public async signup(signupCred: SignupCred): Promise<boolean|undefined> {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:3011/api/v0/Signup', {
        method: 'POST',
        body: JSON.stringify(signupCred),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw res
          }
          return res.json()
        })
        .then((created) => {
          resolve(created)
        })
        .catch(() => {
          reject(new Error("Not Created"))
        });
    });
  }

  

}
