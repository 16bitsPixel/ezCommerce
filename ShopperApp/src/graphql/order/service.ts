import type { Order, InputOrder } from './schema'

export class OrderService{
  async getAll(accountId: string): Promise<Order[]> {
    const res = await fetch(`http://localhost:3015/api/v0/order?accountId=${accountId}`)
    return res.json()
  }

  async get(orderId: string): Promise<Order> {
    const res = await fetch(`http://localhost:3015/api/v0/order/${orderId}`)
    return res.json();
  }

  async create(order: InputOrder): Promise<Order> {
    const res = await fetch('http://localhost:3015/api/v0/order/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });
    return res.json();
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