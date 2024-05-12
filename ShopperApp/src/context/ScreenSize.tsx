import { PropsWithChildren, useState, createContext } from "react";

export const ScreenSizeContext = createContext({
  isSmallScreen: false,
  setSmallScreen: (isSmallScreen: boolean) => {} // eslint-disable-line
})

export const ScreenSizeProvider = ({children}: PropsWithChildren<{}>) => {
  const [isSmallScreen, setSmallScreen] = useState(false);

  return (
    <ScreenSizeContext.Provider value={{isSmallScreen, setSmallScreen}}>
      {children}
    </ScreenSizeContext.Provider>
  )
}