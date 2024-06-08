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

  // click and go to product page
  await page.click('[aria-label="cardImage-eca286ff-43a8-457d-ab07-b2f3d003d903"]');

  // wait for page to load
  await page.waitForSelector('[aria-label="cardImage"]');

  // now get capybara title
  const productTitle = await page.$('h5');
  const content =
    await(await productTitle.getProperty('textContent')).jsonValue();
  expect(content).toBe('EASELR WeightedPlush Cute Capybara Plush, 12inch Capybara Stuffed Animal Soft Capybara Plushies Toy Capybara Doll Pillow Birthday for Kids (with Bag)');

  // change the thumbnail
  await page.waitForSelector('[aria-label="thumbnail-1"]');
  await page.click('[aria-label="thumbnail-1"]');
});

it('Go to capybara page and change image', async () => {
  await page.goto('http://localhost:3000');

  // on first render check if capybara product exists
  await page.waitForSelector('[aria-label^="cardImage-eca286ff-43a8-457d-ab07-b2f3d003d903"]', { timeout: 5000 });
  const cardImage = await page.$('[aria-label="cardImage-eca286ff-43a8-457d-ab07-b2f3d003d903"]');
  expect(cardImage).toBeDefined();

  // click and go to product page
  await page.click('[aria-label="cardImage-eca286ff-43a8-457d-ab07-b2f3d003d903"]');

  // wait for page to load
  await page.waitForSelector('[aria-label="cardImage"]');

  // now get capybara title
  const productTitle = await page.$('h5');
  const content =
    await(await productTitle.getProperty('textContent')).jsonValue();
  expect(content).toBe('EASELR WeightedPlush Cute Capybara Plush, 12inch Capybara Stuffed Animal Soft Capybara Plushies Toy Capybara Doll Pillow Birthday for Kids (with Bag)');
});