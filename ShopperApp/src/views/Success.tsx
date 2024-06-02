import { TopBar } from "./components/TopBar"
import { BottomBar } from "./components/BottomBar"
import { useTranslation } from 'next-i18next';
import { ScreenSizeProvider } from "@/context/ScreenSize";
import React from "react";
import { LoginContext } from "@/context/Login";
import { ProductContext } from "@/context/Product";

export function SuccessText() {

  const { t } = useTranslation('common');
  const loginContext = React.useContext(LoginContext)
  const {setCart, setProducts} = React.useContext(ProductContext)

  React.useEffect(() => {
    const accessToken = localStorage.getItem('loginInfo');

    if (!accessToken) {
      console.error('No access token found in localStorage');
      return;
    }
    console.log("The access token using: ", accessToken)


    const query = {query: `query restore{restore(accessToken: "${accessToken}") { name, accessToken, id}}`}
    fetch('/api/graphql', {
      method: 'POST',
      body: JSON.stringify(query),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        console.log("json: ", json)
        if (json.errors) {
          alert(`${json.errors[0].message}`)
        } else {
          loginContext.setId(json.data.restore.id)
          loginContext.setAccessToken(json.data.restore.accessToken)
          loginContext.setUserName(json.data.restore.name)

          localStorage.removeItem("loginInfo");
          localStorage.removeItem('cart');

          setCart([]);
          setProducts([]);
        }
      })
      .catch((e) => {
        console.log("error: ", e)
        alert(e)
      });


  }, []); // eslint-disable-line

  return (
    <div>
      <ScreenSizeProvider>
        <TopBar />
        <h1 className='success'>{t('thank-you')}</h1>
        <BottomBar />
      </ScreenSizeProvider>
    </div>

  )
}