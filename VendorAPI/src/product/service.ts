import { ProductAdd, Product } from ".";
export class ProductService {
  public async addProduct(productInfo: ProductAdd ): Promise<Product> {
    const res = await fetch('http://localhost:3012/api/v0/product/addProduct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productInfo)
    });

    const data = await res.json();
        
    return data;

  }
}
