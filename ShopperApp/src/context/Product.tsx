import { PropsWithChildren, useState, createContext } from "react";

export const ProductContext = createContext({
    products: [],
    setProducts: (products: any) => {},
    cart: [],
    setCart: (cart: any) => {}
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