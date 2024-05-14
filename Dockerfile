FROM node:20-alpine
EXPOSE 3000 3001 3002 3003

WORKDIR /home/app

COPY package.json /home/app
COPY package-lock.json /home/app/
COPY .env /home/app/

COPY AccountService/build/ /home/app/AccountService/build/
COPY AccountService/package.json /home/app/AccountService/
COPY AccountService/package-lock.json /home/app/AccountService/

COPY ProductService/build/ /home/app/ProductService/build/
COPY ProductService/package.json /home/app/ProductService/
COPY ProductService/package-lock.json /home/app/ProductService/

COPY ShopperApp/.next/ /home/app/ShopperApp/.next/
COPY ShopperApp/package.json /home/app/ShopperApp/
COPY ShopperApp/package-lock.json /home/app/ShopperApp/
COPY ShopperApp/next.config.js /home/app/ShopperApp/
COPY ShopperApp/next-i18next.config.js /home/app/ShopperApp/
COPY ShopperApp/public/ /home/app/ShopperApp/public/

COPY AdminApp/.next/ /home/app/AdminApp/.next/
COPY AdminApp/package.json /home/app/AdminApp/
COPY AdminApp/package-lock.json /home/app/AdminApp/
COPY AdminApp/next.config.js/ /home/app/AdminApp/
COPY AdminApp/public/ /home/app/AdminApp/public/

COPY VendorApp/.next/ /home/app/VendorApp/.next/
COPY VendorApp/package.json /home/app/VendorApp/
COPY VendorApp/package-lock.json /home/app/VendorApp/
COPY VendorApp/next.config.js/ /home/app/VendorApp/
COPY VendorApp/public/ /home/app/VendorApp/public/

COPY VendorAPI/.next/ /home/app/VendorAPI/.next/
COPY VendorAPI/package.json /home/app/VendorAPI/
COPY VendorAPI/package-lock.json /home/app/VendorAPI/
COPY VendorAPI/next.config.js/ /home/app/VendorAPI/
COPY VendorAPI/public/ /home/app/VendorAPI/public/

RUN npm run cis

CMD npm run start
