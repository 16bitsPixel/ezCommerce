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

it('should allow a user to login', async () => {
  await page.goto('http://localhost:3000/login');

  // sign in as molly
  await page.waitForSelector('input[type="email"][name="email"]');
  const emailInput = await page.$('input[type="email"][name="email"]');
  const passwordInput = await page.$('input[type="password"][name="password"]');
  await emailInput.type('molly@books.com');
  await passwordInput.type('mollymember');
  await page.click('aria/loginBtn');

  // Wait for the login to complete
  await page.waitForNavigation();

  // Assert that the user is redirected to the home page
  expect(page.url()).toBe('http://localhost:3000/');
});

it('signup bob', async () => {
  await page.goto('http://localhost:3000/login');

  await page.waitForSelector('[aria-label="signup"]');
  await page.click('[aria-label="signup"]');

  await page.waitForSelector('[aria-label="signupBtn"]');
  const firstInput = await page.$('input[type="text"][name="firstname"]');
  const lastInput = await page.$('input[type="text"][name="lastname"]');
  const emailInputSignup = await page.$('input[type="email"][name="email"]');
  const passwordInputSignup = await page.$('input[type="password"][name="password"]');
  await firstInput.type('Bob');
  await lastInput.type('Builder');
  await emailInputSignup.type('bob@builder.com');
  await passwordInputSignup.type('bobbuilder');
  await page.click('[aria-label="signupBtn"]');
});

it('sign in bob', async () => {
  await page.goto('http://localhost:3000/login');

  // sign in as bob
  await page.waitForSelector('input[type="email"][name="email"]');
  const emailInput = await page.$('input[type="email"][name="email"]');
  const passwordInput = await page.$('input[type="password"][name="password"]');
  await emailInput.type('bob@builder.com');
  await passwordInput.type('bobbuilder');
  await page.click('aria/loginBtn');

  // Wait for the login to complete
  await page.waitForNavigation();

  // Assert that the user is redirected to the home page
  expect(page.url()).toBe('http://localhost:3000/');
});
