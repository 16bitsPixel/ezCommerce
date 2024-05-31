import { UUID, Order , InputOrder} from '.'
import { pool } from '../db'

export class OrderService {
  public async get(orderId: UUID): Promise<Order | undefined> {
    const selectOrder = 'SELECT * FROM orders WHERE id = $1';
    const orderQuery = {
      text: selectOrder,
      values: [orderId],
    };
    const {rows: orderRow} = await pool.query(orderQuery);
    if (orderRow.length === 0) {
      return undefined;
    }
    const selectProducts = 'SELECT product_id, quantity FROM orderDetails WHERE order_id = $1';
    const productsQuery = {
      text: selectProducts,
      values: [orderId],
    };
    const {rows: productRows} = await pool.query(productsQuery);
    const productIds = productRows.map(row => row.product_id);
    const quantities = productRows.map(row => row.quantity);
    const order = {
      order_id: orderRow[0].id,
      account_id: orderRow[0].account_id,
      product_id: productIds,
      date: orderRow[0].date,
      status: orderRow[0].status,
      quantities: quantities,
    };
    return order;
  }

  public async getAll(accountId: string | undefined): Promise<Order[] | undefined> {
    let select = 'SELECT * FROM orders';
    let query = {
      text: select,
      values: [] as string[],
    };
    if (accountId) {
      select += ' WHERE account_id = $1';
      query = {
        text: select,
        values: [accountId],
      };
    }

    // console.log(query);
    const {rows: orderRow} = await pool.query(query);
    if (orderRow.length === 0) {
      return undefined;
    }
    const orders: Order[] = [];
    for (let i = 0; i < orderRow.length; i++) {
      const selectProducts = 'SELECT product_id, quantity FROM orderDetails WHERE order_id = $1';
      const productsQuery = {
        text: selectProducts,
        values: [orderRow[i].id],
      };
      const {rows: productRows} = await pool.query(productsQuery);
      const productIds = productRows.map(row => row.product_id);
      const quantities = productRows.map(row => row.quantity);
      const order = {
        order_id: orderRow[i].id,
        account_id: orderRow[i].account_id,
        product_id: productIds,
        date: orderRow[i].order_date,
        status: orderRow[i].order_status,
        quantities: quantities,
      };
      orders.push(order);
    }
    console.log("order: ", orders)
    return orders;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async create(neworder: InputOrder): Promise<Order | undefined> {
    const current = new Date();
    const insert = `
    INSERT INTO orders(account_id, order_date, order_status)
    VALUES ($1::uuid, $2::timestamp, 'pending')
    RETURNING *
    `;
    const query = {
      text: insert,
      values: [`${neworder.account_id}`,
        current.toISOString()],
    };
    const {rows: orderRows} = await pool.query(query);
    const insertDetails = `
    INSERT INTO orderDetails(order_id, product_id, quantity)
    VALUES ($1::uuid, $2::uuid, $3::integer)
    `;
    for (let i = 0; i < neworder.product_id.length; i++) {
      const queryDetails = {
        text: insertDetails,
        values: [`${orderRows[0].id}`,
          `${neworder.product_id[i]}`,
          `${neworder.quantities[i]}`],
      };
      await pool.query(queryDetails);
    }
    return {order_id: orderRows[0].id,
      account_id: orderRows[0].account_id,
      product_id: neworder.product_id,
      date: orderRows[0].date,
      status: orderRows[0].status,
      quantities: neworder.quantities,
    };
  }

  public async getOrderStatus(orderId: UUID): Promise<string | undefined> {
    const selectStatus = 'SELECT order_status FROM orders WHERE id = $1';
    const statusQuery = {
      text: selectStatus,
      values: [orderId],
    };
    const {rows: statusRow} = await pool.query(statusQuery);
    if (statusRow.length === 0) {
      return undefined;
    }
    return statusRow[0].order_status;
  }

  public async updateOrderStatus(orderId: UUID, status: string): Promise<boolean> {
    const updateStatus = 'UPDATE orders SET order_status = $1 WHERE id = $2';
    const updateQuery = {
      text: updateStatus,
      values: [status, orderId],
    };
    const result = await pool.query(updateQuery);
    return result.rowCount !== null && result.rowCount > 0;
  }
}