import { PropsWithChildren, useState, createContext } from "react";

export const ProductContext = createContext({
  products: [],
  setProducts: (products: any) => {}, // eslint-disable-line
  cart: [],
  setCart: (cart: any) => {} // eslint-disable-line
})

export const ProductProvider = ({children}: PropsWithChildren<{}>) => {
  const [products, setProducts] = useState<any>([]);
  const [cart, setCart] = useState<any>([]);

  return (
    <ProductContext.Provider value={{products, setProducts, cart, setCart}}>
      {children}
    </ProductContext.Provider>
  )
}