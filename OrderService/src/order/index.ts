/**
 * Universal Unique IDentifier
 * @pattern ^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$
 * @example 123e4567-e89b-12d3-a456-426655440000
 */
export type UUID = string;

export interface Order {
  order_id: UUID,
  account_id: UUID,
  product_id: UUID[],
  date: Date,
  status: string,
  quantities: number[],
}
export interface InputOrder {
  account_id: UUID,
  product_id: UUID[],
  date: Date,
  status: string,
  quantities: number[],
}
