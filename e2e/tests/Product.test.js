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

it('Go to capybara page, change quantity and add to cart, go back product', async () => {
  await page.goto('http://localhost:3000');

  // on first render check if capybara product exists
  await page.waitForSelector('[aria-label^="cardImage-eca286ff-43a8-457d-ab07-b2f3d003d903"]', { timeout: 5000 });

  // click and go to product page
  await page.click('[aria-label="cardImage-eca286ff-43a8-457d-ab07-b2f3d003d903"]');

  // change quantity
  await page.waitForSelector('#quantity');
  await page.click('#quantity');
  await page.click('[aria-label="addToCartBtn"]'); // this works b/c the 2 quantity happens to be right above submit btn

  await page.evaluate(() => {
    return new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
  }); // wait a bit for droplist to go away

  // add to cart
  await page.click('[aria-label="addToCartBtn"]');
  await page.waitForSelector('[aria-label="cardImage-0"]');

  const price = await page.$('h5');
  const content =
    await(await price.getProperty('textContent')).jsonValue();
  expect(content).toBe('Total: $39.98');

  // go back to product page using image
  await page.click('[aria-label="cardImage-0"]');

  // wait for page to load
  await page.waitForSelector('[aria-label="cardImage"]');

  // now get capybara title
  const productTitle = await page.$('h5');
  const content3 =
    await(await productTitle.getProperty('textContent')).jsonValue();
  expect(content3).toBe('EASELR WeightedPlush Cute Capybara Plush, 12inch Capybara Stuffed Animal Soft Capybara Plushies Toy Capybara Doll Pillow Birthday for Kids (with Bag)');
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

it('Sign in, go to capybara, add to wishlist', async () => {
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
