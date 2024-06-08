const puppeteer = require('puppeteer');
const http = require('http');
const path = require('path');
const express = require('express');


let browser;
let page;


/**
 * Create a headless (not visible) instance of Chrome for each test
 * and open a new page (tab).
 */
beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false,
  });
  page = await browser.newPage();
});

/**
 * Close the headless instance of Chrome as we no longer need it.
 */
afterEach(async () => {
  await browser.close();
});

it('Find product cards and go to first product (capybara) and change image', async () => {
  await page.goto('http://localhost:3000');

  // on first render check if capybara product exists
  await page.waitForSelector('[aria-label^="cardImage-eca286ff-43a8-457d-ab07-b2f3d003d903"]', { timeout: 5000 });
  const cardImage = await page.$('[aria-label="cardImage-eca286ff-43a8-457d-ab07-b2f3d003d903"]');
  expect(cardImage).toBeDefined();

  // hover
  await page.hover('[aria-label="cardImage-eca286ff-43a8-457d-ab07-b2f3d003d903"]');
  // click and go to product page
  await page.click('[aria-label="cardImage-eca286ff-43a8-457d-ab07-b2f3d003d903"]');

  // wait for page to load
  await page.waitForSelector('[aria-label="cardImage"]');

  // now get capybara title
  const productTitle = await page.$('h5');
  const content =
    await(await productTitle.getProperty('textContent')).jsonValue();
  expect(content).toBe('EASELR WeightedPlush Cute Capybara Plush, 12inch Capybara Stuffed Animal Soft Capybara Plushies Toy Capybara Doll Pillow Birthday for Kids (with Bag)');

  // hover
  await page.hover('[aria-label="cardImage"]');

  // change the thumbnail
  await page.waitForSelector('[aria-label="thumbnail-1"]');
  await page.click('[aria-label="thumbnail-1"]');
}, 20000);

it('Go to capybara page, add to cart, go back product add to cart, 2 quantity', async () => {
  await page.goto('http://localhost:3000');

  // on first render check if capybara product exists
  await page.waitForSelector('[aria-label^="cardImage-eca286ff-43a8-457d-ab07-b2f3d003d903"]', { timeout: 5000 });

  // click and go to product page
  await page.click('[aria-label="cardImage-eca286ff-43a8-457d-ab07-b2f3d003d903"]');

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

  // now get capybara title
  const productTitle = await page.$('h5');
  const content3 =
    await(await productTitle.getProperty('textContent')).jsonValue();
  expect(content3).toBe('EASELR WeightedPlush Cute Capybara Plush, 12inch Capybara Stuffed Animal Soft Capybara Plushies Toy Capybara Doll Pillow Birthday for Kids (with Bag)');

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
  await page.waitForSelector('[aria-label^="cardImage-eca286ff-43a8-457d-ab07-b2f3d003d903"]', { timeout: 5000 });

  // click and go to product page
  await page.click('[aria-label="cardImage-eca286ff-43a8-457d-ab07-b2f3d003d903"]');

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
    return new Promise(resolve => {
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

it('Go to capybara page, add to cart, checkout but sent to login', async () => {
  await page.goto('http://localhost:3000');

  // on first render check if capybara product exists
  await page.waitForSelector('[aria-label^="cardImage-eca286ff-43a8-457d-ab07-b2f3d003d903"]', { timeout: 5000 });

  // click and go to product page
  await page.click('[aria-label="cardImage-eca286ff-43a8-457d-ab07-b2f3d003d903"]');

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
  await page.waitForSelector('[aria-label^="cardImage-eca286ff-43a8-457d-ab07-b2f3d003d903"]', { timeout: 5000 });

  // click and go to product page
  await page.click('[aria-label="cardImage-eca286ff-43a8-457d-ab07-b2f3d003d903"]');

  // add to cart
  await page.waitForSelector('[aria-label="addToWishlistBtn"]');
  await page.click('[aria-label="addToWishlistBtn"]');

  const emailInput = await page.$('input[type="text"][name="email"]');
  expect(emailInput).toBeDefined();
});

it('Sign in, go to capybara, add to wishlist', async () => {
  await page.goto('http://localhost:3000');

  await page.setViewport({ width: 1920, height: 1080 });

  await page.waitForSelector('[aria-label="signInBtn"]', { timeout: 5000 });

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
  await page.waitForSelector('[aria-label^="cardImage-eca286ff-43a8-457d-ab07-b2f3d003d903"]', { timeout: 5000 });

  // click and go to product page
  await page.click('[aria-label="cardImage-eca286ff-43a8-457d-ab07-b2f3d003d903"]');

  // add to wishlist
  await page.waitForSelector('[aria-label="addToCartBtn"]');
  await page.click('[aria-label="addToWishlistBtn"]');
});

it('go to strawberry cat, add to cart, checkout, sent to login, should be in cart now', async () => {
  await page.goto('http://localhost:3000');

  await page.setViewport({ width: 1920, height: 1080 });

  // on first render check if capybara product exists
  await page.waitForSelector('[aria-label^="cardImage-01dcf491-4ad3-432d-86cc-62e70465cafb"]', { timeout: 5000 });

  // click and go to product page
  await page.click('[aria-label="cardImage-01dcf491-4ad3-432d-86cc-62e70465cafb"]');

  // add to cart
  await page.waitForSelector('[aria-label="addToCartBtn"]');
  await page.click('[aria-label="addToCartBtn"]');
  await page.waitForSelector('[aria-label="cardImage-0"]');

  await page.click('[aria-label="checkout-button"]');

  // sign in as molly
  await page.waitForSelector('input[type="email"][name="email"]');
  const emailInput = await page.$('input[type="email"][name="email"]');
  const passwordInput = await page.$('input[type="password"][name="password"]');
  await emailInput.type('molly@books.com');
  await passwordInput.type('mollymember');
  await page.click('aria/loginBtn');

  // go back to cart page
  await page.waitForSelector('[aria-label="cartBtn"]', { timeout: 5000 });
  await page.click('[aria-label="cartBtn"]');
  await page.waitForSelector('[aria-label="cardImage-0"]');

  // strawberry cat is in cart still
  // should be 12.99 in cart
  const price = await page.$('h5');
  const content =
    await(await price.getProperty('textContent')).jsonValue();
  expect(content).toBe('Total: $12.99');
});

it('go to cart as molly, strawberry cat still here, checkout and purchase', async () => {
  await page.goto('http://localhost:3000');

  await page.setViewport({ width: 1920, height: 1080 });

  await page.waitForSelector('[aria-label="signInBtn"]', { timeout: 5000 });

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
  await page.waitForSelector('[aria-label="cartBtn"]', { timeout: 5000 });
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

  const locator = ".SubmitButton";
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
    return new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
  });

  const locator2 = ".SubmitButton";
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
