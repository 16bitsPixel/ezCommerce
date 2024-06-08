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


it('should allow a vendor to login', async () => {
  await page.goto('http://localhost:3002/vendor');
  // Fill in the email and password fields
  await page.type('#email', 'vin@vendor.com');
  await page.type('#password', 'vinvendor');

  await page.click('button[type="submit"]');
}, 60000);

