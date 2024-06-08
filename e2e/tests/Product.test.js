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

it('Go to capybara change image', async () => {
  await page.goto('http://localhost:3000');

  // on first render check if capybara product exists
  const capy = `[aria-label^="cardImage-eca286ff-43a8-457d-ab07-b2f3d003d903"]`;
  await page.waitForSelector(capy, {timeout: 5000});
  const cardImage = await page.$(capy);
  expect(cardImage).toBeDefined();

  // hover
  await page.hover(capy);
  // click and go to product page
  await page.click(capy);

  // wait for page to load
  await page.waitForSelector('[aria-label="cardImage"]');

  // hover
  await page.hover('[aria-label="cardImage"]');

  // change the thumbnail
  await page.waitForSelector('[aria-label="thumbnail-1"]');
  await page.click('[aria-label="thumbnail-1"]');
}, 20000);

it('add to cart, go back add to cart, 2 quantity', async () => {
  await page.goto('http://localhost:3000');

  // on first render check if capybara product exists
  const capy = `[aria-label^="cardImage-eca286ff-43a8-457d-ab07-b2f3d003d903"]`;
  await page.waitForSelector(capy, {timeout: 5000});

  // click and go to product page
  await page.click(capy);

  // change quantity
  await page.waitForSelector('#quantity');

  // add to cart
  await page.click('[aria-label="addToCartBtn"]');
  await page.waitForSelector('[aria-label="cardImage-0"]');

  const price = await page.$('h5');
  const content =
    await(await price.getProperty('textContent')).jsonValue();
  expect(content).toBe('Total: $19.99');

  // go back to product page using image
  await page.click('[aria-label="cardImage-0"]');

  // wait for page to load
  await page.waitForSelector('[aria-label="cardImage"]');

  // add again
  await page.click('[aria-label="addToCartBtn"]');
  await page.waitForSelector('[aria-label="cardImage-0"]');

  const price2 = await page.$('h5');
  const content2 =
    await(await price2.getProperty('textContent')).jsonValue();
  expect(content2).toBe('Total: $39.98');
});

it('Go to capybara page, add to cart, delete', async () => {
  await page.goto('http://localhost:3000');

  // on first render check if capybara product exists
  capybara = '[aria-label^="cardImage-eca286ff-43a8-457d-ab07-b2f3d003d903"]';
  await page.waitForSelector(capybara, {timeout: 5000});

  // click and go to product page
  await page.click(capybara);

  // add to cart
  await page.waitForSelector('[aria-label="addToCartBtn"]');
  await page.click('[aria-label="addToCartBtn"]');
  await page.waitForSelector('[aria-label="cardImage-0"]');

  // should be 19.99 in cart
  const price = await page.$('h5');
  const content =
    await(await price.getProperty('textContent')).jsonValue();
  expect(content).toBe('Total: $19.99');

  await page.evaluate(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }); // wait a bit for droplist to go away

  // delete from cart
  await page.click('[aria-label="deleteBtn-0"]');

  // now price is 0
  const content2 =
    await(await price.getProperty('textContent')).jsonValue();
  expect(content2).toBe('Total: $0.00');
});

it('add to cart, checkout but sent to login', async () => {
  await page.goto('http://localhost:3000');

  // on first render check if capybara product exists
  capybara = '[aria-label^="cardImage-eca286ff-43a8-457d-ab07-b2f3d003d903"]';
  await page.waitForSelector(capybara, {timeout: 5000});

  // click and go to product page
  await page.click(capybara);

  // add to cart
  await page.waitForSelector('[aria-label="addToCartBtn"]');
  await page.click('[aria-label="addToCartBtn"]');
  await page.waitForSelector('[aria-label="cardImage-0"]');

  await page.click('[aria-label="checkout-button"]');

  const emailInput = await page.$('input[type="text"][name="email"]');
  expect(emailInput).toBeDefined();
});

it('Go to capybara page, add to wishlist, but sent to login', async () => {
  await page.goto('http://localhost:3000');

  // on first render check if capybara product exists
  capybara = '[aria-label^="cardImage-eca286ff-43a8-457d-ab07-b2f3d003d903"]';
  await page.waitForSelector(capybara, {timeout: 5000});

  // click and go to product page
  await page.click(capybara);

  // add to cart
  await page.waitForSelector('[aria-label="addToWishlistBtn"]');
  await page.click('[aria-label="addToWishlistBtn"]');

  const emailInput = await page.$('input[type="text"][name="email"]');
  expect(emailInput).toBeDefined();
});

it('Sign in, go to capybara, add to wishlist', async () => {
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

  // wait for capybara
  capybara = '[aria-label^="cardImage-eca286ff-43a8-457d-ab07-b2f3d003d903"]';
  await page.waitForSelector(capybara, {timeout: 5000});

  // click and go to product page
  await page.click(capybara);

  // add to wishlist
  await page.waitForSelector('[aria-label="addToCartBtn"]');
  await page.click('[aria-label="addToWishlistBtn"]');
});

it('local cart to account cart', async () => {
  await page.goto('http://localhost:3000');

  await page.setViewport({width: 1920, height: 1080});

  // on first render check if capybara product exists
  cat = '[aria-label^="cardImage-01dcf491-4ad3-432d-86cc-62e70465cafb"]';
  await page.waitForSelector(cat, {timeout: 5000});

  // click and go to product page
  await page.click(cat);

  // add to cart
  await page.waitForSelector('[aria-label="addToCartBtn"]');
  await page.click('[aria-label="addToCartBtn"]');
  await page.waitForSelector('[aria-label="cardImage-0"]');

  await page.click('[aria-label="signInBtn"]');

  // sign in as molly
  await page.waitForSelector('input[type="email"][name="email"]');
  const emailInput = await page.$('input[type="email"][name="email"]');
  const passwordInput = await page.$('input[type="password"][name="password"]');
  await emailInput.type('molly@books.com');
  await passwordInput.type('mollymember');
  await page.click('aria/loginBtn');

  // go back to cart page
  await page.waitForSelector('[aria-label="cartBtn"]', {timeout: 5000});
  await page.click('[aria-label="cartBtn"]');
  await page.waitForSelector('[aria-label="cardImage-0"]');

  // wait a bit
  await page.evaluate(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  });

  // strawberry cat is in cart still
  // should be 12.99 in cart
  const price = await page.$('h5');
  const content =
    await(await price.getProperty('textContent')).jsonValue();
  expect(content).toBe('Total: $12.99');
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

  // go to cart
  await page.waitForSelector('[aria-label="cartBtn"]', {timeout: 5000});
  await page.click('[aria-label="cartBtn"]');
  await page.waitForSelector('[aria-label="cardImage-0"]');

  // strawberry cat is in cart still
  // should be 12.99 in cart
  const price = await page.$('h5');
  const content =
    await(await price.getProperty('textContent')).jsonValue();
  expect(content).toBe('Total: $12.99');

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
}, 20000);
