import { Orders } from ".";

export class OrderService {
  public async getOrders(): Promise<Orders[] | undefined> {
    const res = await fetch ('http://localhost:3015/api/v0/order', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    const data = await res.json();
    //console.log("This is the dattttttttttt",data);
    return data;
  }

  public async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    const res = await fetch (`http://localhost:3015/api/v0/order/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({status})
    })
        
    if (res.ok) {
      return true
    } else {
      return false
    }
  }
}