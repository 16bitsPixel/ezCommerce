const puppeteer = require('puppeteer');

let browser;
let page;


/**
 * Create a headless (not visible) instance of Chrome for each test
 * and open a new page (tab).
 */
beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: true,
  });
  page = await browser.newPage();
});

/**
 * Close the headless instance of Chrome as we no longer need it.
 */
afterEach(async () => {
  await browser.close();
});

it('cat in account cart and purchase', async () => {
  await page.goto('http://localhost:3000');

  await page.setViewport({width: 1920, height: 1080});

  await page.waitForSelector('[aria-label="signInBtn"]', {timeout: 5000});

  // click and go to login page
  await page.click('[aria-label="signInBtn"]');

  // sign in as molly
  await page.waitForSelector('input[type="email"][name="email"]');
  const emailInput = await page.$('input[type="email"][name="email"]');
  const passwordInput = await page.$('input[type="password"][name="password"]');
  await emailInput.type('molly@books.com');
  await passwordInput.type('mollymember');
  await page.click('aria/loginBtn');

  // add cat to cart
  cat = '[aria-label^="cardImage-01dcf491-4ad3-432d-86cc-62e70465cafb"]';
  await page.waitForSelector(cat, {timeout: 5000});

  // click and go to product page
  await page.click(cat);

  // add to cart
  await page.waitForSelector('[aria-label="addToCartBtn"]');
  await page.click('[aria-label="addToCartBtn"]');

  await page.waitForSelector('[aria-label="cardImage-0"]');

  // checkout
  await page.click('[aria-label="checkout-button"]');

  // input card credentials
  await page.waitForSelector('input[type="text"][name="email"]');
  const cardEmailInput = await page.$('input[type="text"][name="email"]');
  await cardEmailInput.type('molly@books.com');

  const cardNumberInput = await page.$('input[type="text"][name="cardNumber"]');
  await cardNumberInput.type('4242 4242 4242 4242');

  const cardExpiry = await page.$('input[type="text"][name="cardExpiry"]');
  await cardExpiry.type('12/34');

  const cardCvc = await page.$('input[type="text"][name="cardCvc"]');
  await cardCvc.type('123');

  const billingName = await page.$('input[type="text"][name="billingName"]');
  await billingName.type('Molly Member');

  const locator = '.SubmitButton';
  await page.evaluate( (paramLocator) => {
    document.querySelector(paramLocator).click();
  }, locator);

  // dumb code thing
  await page.waitForSelector('[aria-label="one-time-code-input-0"]');
  const code0 = await page.$('[aria-label="one-time-code-input-0"]');
  const code1 = await page.$('[aria-label="one-time-code-input-1"]');
  const code2 = await page.$('[aria-label="one-time-code-input-2"]');
  const code3 = await page.$('[aria-label="one-time-code-input-3"]');
  const code4 = await page.$('[aria-label="one-time-code-input-4"]');
  const code5 = await page.$('[aria-label="one-time-code-input-5"]');
  await code0.type('0');
  await code1.type('0');
  await code2.type('0');
  await code3.type('0');
  await code4.type('0');
  await code5.type('0');

  // wait a bit
  await page.evaluate(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  });

  const locator2 = '.SubmitButton';
  await page.evaluate( (paramLocator) => {
    document.querySelector(paramLocator).click();
  }, locator2);

  // should eventually get success message
  await page.waitForNavigation();
  const header = await page.$('h1');
  const textContent =
    await(await header.getProperty('textContent')).jsonValue();
  expect(textContent).toBe('Thank you, your order has been placed.');
}, 30000);

it('go to orders page and see cat', async () => {
  await page.goto('http://localhost:3000');

  await page.setViewport({width: 1920, height: 1080});

  await page.waitForSelector('[aria-label="signInBtn"]', {timeout: 5000});

  // click and go to login page
  await page.click('[aria-label="signInBtn"]');

  // sign in as molly
  await page.waitForSelector('input[type="email"][name="email"]');
  const emailInput = await page.$('input[type="email"][name="email"]');
  const passwordInput = await page.$('input[type="password"][name="password"]');
  await emailInput.type('molly@books.com');
  await passwordInput.type('mollymember');
  await page.click('aria/loginBtn');

  // go order page
  await page.waitForSelector('[aria-label="orderButtonTop"]', {timeout: 5000});
  await page.click('[aria-label="orderButtonTop"]');

  await page.waitForSelector('[aria-label="orderAgainBtn"]');

  // go back to product
  await page.click('[aria-label="viewItemBtn"]');
});

it('go to orders page and put back in cart', async () => {
  await page.goto('http://localhost:3000');

  await page.setViewport({width: 1920, height: 1080});

  await page.waitForSelector('[aria-label="signInBtn"]', {timeout: 5000});

  // click and go to login page
  await page.click('[aria-label="signInBtn"]');

  // sign in as molly
  await page.waitForSelector('input[type="email"][name="email"]');
  const emailInput = await page.$('input[type="email"][name="email"]');
  const passwordInput = await page.$('input[type="password"][name="password"]');
  await emailInput.type('molly@books.com');
  await passwordInput.type('mollymember');
  await page.click('aria/loginBtn');

  // go order page
  await page.waitForSelector('[aria-label="orderButtonTop"]', {timeout: 5000});
  await page.click('[aria-label="orderButtonTop"]');

  // go back to product
  await page.waitForSelector('[aria-label="orderAgainBtn"]');
  await page.click('[aria-label="orderAgainBtn"]');
});
