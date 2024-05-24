import { PropsWithChildren, useState, createContext } from "react";

export const ProductContext = createContext({
    products: [],
    setProducts: (products: any) => {}
})

export const ProductProvider = ({children}: PropsWithChildren<{}>) => {
    const [products, setProducts] = useState<any>([]);

    return (
        <ProductContext.Provider value={{products, setProducts}}>
            {children}
        </ProductContext.Provider>
    )
}