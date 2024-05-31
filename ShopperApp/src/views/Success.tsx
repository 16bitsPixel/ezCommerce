import { TopBar } from "./components/TopBar"
import { BottomBar } from "./components/BottomBar"
import { useTranslation } from 'next-i18next';
import { ScreenSizeProvider } from "@/context/ScreenSize";


export function SuccessText() {

  const { t } = useTranslation('common');


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