import {UUID} from '../product/index'

export interface Orders {
    id: UUID,
    shopperId: UUID,
    orderDate: string,
    orderStatus: string
    cart: string[]
}