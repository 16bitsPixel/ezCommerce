import { PropsWithChildren, useState, createContext } from "react";

export const OrderContext = createContext({
  orderTotal: 0,
  setOrderTotal: (price: any) => {}, // eslint-disable-line
})

export const OrderProvider = ({children}: PropsWithChildren<{}>) => {
  const [orderTotal, setOrderTotal] = useState<any>(0);

  return (
    <OrderContext.Provider value={{orderTotal, setOrderTotal}}>
      {children}
    </OrderContext.Provider>
  )
}