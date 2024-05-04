FROM node:20-alpine
EXPOSE 3000
EXPOSE 3001
EXPOSE 3002

WORKDIR /home/app

COPY package.json /home/app
COPY package-lock.json /home/app/
COPY .env /home/app/

COPY AccountService/build/ /home/app/AccountService/build/
COPY AccountService/package.json /home/app/AccountService/
COPY AccountService/package-lock.json /home/app/AccountService/
COPY AccountService/tsoa.json /home/app/AccountService/


COPY ProductService/build/ /home/app/ProductService/build/
COPY ProductService/package.json /home/app/ProductService/
COPY ProductService/package-lock.json /home/app/ProductService/
COPY ProductService/tsoa.json /home/app/AccountService/

COPY ShopperApp/.next/ /home/app/ShopperApp/.next/
COPY ShopperApp/package.json /home/app/ShopperApp/
COPY ShopperApp/package-lock.json /home/app/ShopperApp/
COPY ShopperApp/next.config.mjs/ /home/app/ShopperApp/
COPY ShopperApp/public/ /home/app/ShopperApp/public/

COPY AdminApp/.next/ /home/app/AdminApp/.next/
COPY AdminApp/package.json /home/app/AdminApp/
COPY AdminApp/package-lock.json /home/app/AdminApp/
COPY AdminApp/next.config.mjs/ /home/app/AdminApp/
COPY AdminApp/public/ /home/app/AdminApp/public/

COPY VendorApp/.next/ /home/app/VendorApp/.next/
COPY VendorApp/package.json /home/app/VendorApp/
COPY VendorApp/package-lock.json /home/app/VendorApp/
COPY VendorApp/next.config.mjs/ /home/app/VendorApp/
COPY VendorApp/public/ /home/app/VendorApp/public/


RUN npm run cis

CMD npm run dev