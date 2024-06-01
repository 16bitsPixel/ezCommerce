import { WishList } from "./schema"


export class WishListService {
  async getallWishList(accessToken:string): Promise<WishList[]> {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:3011/api/v0/Wishlist', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw res
          }
          return res.json()
        })
        .then((data) => {
          console.log(data);
          resolve(data)
        })
        .catch(() => {
          // console.log(err)
          reject(new Error("Get Wishlist Error"))
        });
    });
  }
}