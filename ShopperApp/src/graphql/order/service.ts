import type { Order, InputOrder , output} from './schema'

export class OrderService{
  async getAll(accountId: string): Promise<Order[]> {
    const res = await fetch(`http://localhost:3015/api/v0/order?accountId=${accountId}`)
    const orders = await res.json();
    return orders.map((order: any) => ({
      orderId: order.order_id,
      accountId: order.account_id,
      productId: order.product_id,
      date: order.date,
      status: order.status,
      quantities: order.quantities,
    }));
  }

  async get(orderId: string): Promise<Order> {
    const res = await fetch(`http://localhost:3015/api/v0/order/${orderId}`)
    return res.json();
  }

  async create(order: InputOrder): Promise<output> {
    // Transform the InputOrder into the expected format for the API
    const transformedOrder = {
      items: order.product_id.map((productId, index) => ({
        account_id: order.account_id,
        product_id: productId,
        quantities: order.quantities[index]
      }))
    };

    const res = await fetch('http://localhost:3015/api/v0/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json' 
      },
      body: JSON.stringify(transformedOrder),
    });

    const jsonResponse = await res.json();
    console.log(transformedOrder);
    console.log(`This is the dattttttttttt ${JSON.stringify(jsonResponse)}`);
    return jsonResponse;
  }


  async getStatus(orderId: string): Promise<Order> {
    const res = await fetch(`http://localhost:3015/api/v0/order/${orderId}/status`)
    return res.json();
  }

  async updateStatus(orderId: string): Promise<Order> {
    const res = await fetch(`http://localhost:3015/api/v0/order/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.json();
  }
}