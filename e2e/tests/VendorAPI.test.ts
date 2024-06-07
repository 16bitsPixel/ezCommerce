// import puppeteer, { Browser, Page } from 'puppeteer';
// import http from 'http';
// import { exec } from 'child_process';
// import dotenv from 'dotenv';
// import util from 'util';
// import keyApp from '../../APIKeyService/src/app';
// import accountApp from '../../AccountService/src/app';
// import productApp from '../../ProductService/src/app';
// import orderApp from '../../OrderService/src/app';
// import vendorAPIApp from '../../VendorAPI/src/app';

// dotenv.config();

// const execPromise = util.promisify(exec);

// let APIKeyService: http.Server;
// let ProductService: http.Server;
// let OrderService: http.Server;
// let AccountService: http.Server;
// let VendorAPI: http.Server;
// let browser: Browser;
// let page: Page;

// beforeAll((done) => {
//   APIKeyService = http.createServer(keyApp);
//   APIKeyService.listen(3013, () => {
//     console.log('APIKeyService running on 3013');
//   });

//   ProductService = http.createServer(productApp);
//   ProductService.listen(3012, () => {
//     console.log('ProductService running on 3012');
//   });

//   OrderService = http.createServer(orderApp);
//   OrderService.listen(3015, () => {
//     console.log('OrderService running on 3015');
//   });

//   AccountService = http.createServer(accountApp);
//   AccountService.listen(3010, () => {
//     console.log('AccountService running on 3010');
//   });

//   VendorAPI = http.createServer(vendorAPIApp);
//   VendorAPI.listen(3014, () => {
//     console.log('VendorAPI running on 3014');
//     done();
//   });
// });

// afterAll((done) => {
//   APIKeyService.close(() => {
//     ProductService.close(() => {
//       OrderService.close(() => {
//         AccountService.close(() => {
//           VendorAPI.close(done);
//         });
//       });
//     });
//   });
// });

// beforeEach(async () => {
//   browser = await puppeteer.launch({ headless: true });
//   page = await browser.newPage();
// });

// afterEach(async () => {
//   await browser.close();
// });

// const testProduct = {
//   name: "watch",
//   description: ["tells time"],
//   price: 300,
//   image: ["https://m.media-amazon.com/images/I/81oMxPD2JML._AC_SY535_.jpg"]
// };

// const APIKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZhMTRmYjdlLTJhMWQtNDFkNS04OTg1LTMwNTY4ZGM4YTdhOSIsIm5hbWUiOiJWaW4gVmVuZG9yIiwiZW1haWwiOiJ2aW5AdmVuZG9yLmNvbSIsImlhdCI6MTcxNjI4MDY0NywiZXhwIjoxNzQ3ODM4MjQ3fQ.pDYeDR_6mUxiU4-PsbzuMOxDn65iq2Iotu7G5Oh8Pjc';

// test('Vendor Adds a Product with being authorized', async () => {
//   const command = `curl -X 'POST' 'http://localhost:3010/api/v0/products' -H 'accept: application/json' -H 'Authorization: Bearer ${APIKey}' -H 'Content-Type: application/json' -d '${JSON.stringify(testProduct)}'`;
//   const { stdout, stderr } = await execPromise(command);

//   const response = JSON.parse(stdout);
//   expect(response.name).toBe(testProduct.name);
// });
