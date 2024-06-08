const puppeteer = require('puppeteer');
const {exec} = require('child_process');

let browser;
let page;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: true,
  });
  page = await browser.newPage();
});

afterEach(async () => {
  await browser.close();
});

function runCurlCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`error: ${error.message}`);
        return;
      }

      if (stderr && !stderr.includes('% Total') && !stderr.includes('Average Speed')) {
        reject(`stderr: ${stderr}`);
        return;
      }
      resolve(stdout);
    });
  });
}

it('Vendor Adding a product with authorized api key', async () => {
  const curlCommand = `
        curl -X 'POST' \
        'http://localhost:3010/api/v0/products' \
        -H 'accept: application/json' \
        -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZhMTRmYjdlLTJhMWQtNDFkNS04OTg1LTMwNTY4ZGM4YTdhOSIsIm5hbWUiOiJWaW4gVmVuZG9yIiwiZW1haWwiOiJ2aW5AdmVuZG9yLmNvbSIsImlhdCI6MTcxNjI4MDY0NywiZXhwIjoxNzQ3ODM4MjQ3fQ.pDYeDR_6mUxiU4-PsbzuMOxDn65iq2Iotu7G5Oh8Pjc' \
        -H 'Content-Type: application/json' \
        -d '{
            "name": "string",
            "description": [
                "string"
            ],
            "price": 0,
            "image": [
                "string"
            ]
        }'
    `;

  try {
    await runCurlCommand(curlCommand);
  } catch (error) {
    throw new Error('Test failed due to curl error: ', error);
  }
});

it('Vendor Adding a product without authorized api key', async () => {
  const curlCommand = `
        curl -X 'POST' \
        'http://localhost:3010/api/v0/products' \
        -H 'accept: application/json' \
        -H 'Authorization: Bearer 123' \
        -H 'Content-Type: application/json' \
        -d '{
            "name": "string",
            "description": [
                "string"
            ],
            "price": 0,
            "image": [
                "string"
            ]
        }'
    `;

  try {
    const response = await runCurlCommand(curlCommand);
    const jsonResponse = JSON.parse(response);

    if (jsonResponse.message != 'Unauthorized') {
      throw new Error('Unauthorized vendor was able to add a product');
    }
  } catch (error) {
    throw new Error('Test failed due to curl error: ', error);
  }
});

it('Vendor Gets Orders with authorized api key', async () => {
  const curlCommand = `
        curl -X 'GET' \
        'http://localhost:3010/api/v0/orders' \
        -H 'accept: application/json' \
        -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZhMTRmYjdlLTJhMWQtNDFkNS04OTg1LTMwNTY4ZGM4YTdhOSIsIm5hbWUiOiJWaW4gVmVuZG9yIiwiZW1haWwiOiJ2aW5AdmVuZG9yLmNvbSIsImlhdCI6MTcxNjI4MDY0NywiZXhwIjoxNzQ3ODM4MjQ3fQ.pDYeDR_6mUxiU4-PsbzuMOxDn65iq2Iotu7G5Oh8Pjc'
    `;

  try {
    await runCurlCommand(curlCommand);
  } catch (error) {
    throw new Error('Test failed due to curl error: ', error);
  }
});

it('Vendor Gets Orders without authorized api key', async () => {
  const curlCommand = `
        curl -X 'GET' \
        'http://localhost:3010/api/v0/orders' \
        -H 'accept: application/json' \
        -H 'Authorization: Bearer 123'
    `;

  try {
    const response = await runCurlCommand(curlCommand);
    const jsonResponse = JSON.parse(response);

    if (jsonResponse.message != 'Unauthorized') {
      throw new Error('Unauthorized vendor was able to add a product');
    }
  } catch (error) {
    throw new Error('Test failed due to curl error: ', error);
  }
});


it('Vendor Changes Order Status To Delivered', async () => {
  const curlCommand = `
        curl -X 'GET' \
        'http://localhost:3010/api/v0/orders' \
        -H 'accept: application/json' \
        -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZhMTRmYjdlLTJhMWQtNDFkNS04OTg1LTMwNTY4ZGM4YTdhOSIsIm5hbWUiOiJWaW4gVmVuZG9yIiwiZW1haWwiOiJ2aW5AdmVuZG9yLmNvbSIsImlhdCI6MTcxNjI4MDY0NywiZXhwIjoxNzQ3ODM4MjQ3fQ.pDYeDR_6mUxiU4-PsbzuMOxDn65iq2Iotu7G5Oh8Pjc'
    `;

  try {
    await runCurlCommand(curlCommand);
  } catch (error) {
    throw new Error('Test failed due to curl error: ', error);
  }
});


it('Vendor Changes Order Status To Delivered without authorized api key', async () => {
  const curlCommand = `
        curl -X 'GET' \
        'http://localhost:3010/api/v0/orders' \
        -H 'accept: application/json' \
        -H 'Authorization: Bearer 123'
    `;

  try {
    const response = await runCurlCommand(curlCommand);
    const jsonResponse = JSON.parse(response);

    if (jsonResponse.message != 'Unauthorized') {
      throw new Error('Unauthorized vendor was able to add a product');
    }
  } catch (error) {
    throw new Error('Test failed due to curl error: ', error);
  }
});

