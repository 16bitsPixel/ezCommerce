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
  // Fill in the email and password fields
  await page.type('#email', 'molly@books.com');
  await page.type('#password', 'mollymember');

  const submit = await page.$('aria/Submit');

  await submit.click();

  // Wait for the login to complete
  await page.waitForNavigation();

  // Assert that the user is redirected to the home page
  expect(page.url()).toBe('http://localhost:3000/');
});
// it('user logs ins and logsout', async () => {
//   await page.goto('http://localhost:3000/login');
//   // Fill in the email and password fields
//   await page.type('#email', 'molly@books.com');
//   await page.type('#password', 'mollymember');

//   const submit = await page.$('aria/Submit');

//   await submit.click();

//   // Wait for the login to complete
//   await page.waitForNavigation();

//   // Assert that the user is redirected to the home page
//   expect(page.url()).toBe('http://localhost:3000/');

//   // Wait for the logout button to be available
//   await page.waitForSelector('[aria-label="Logout"]');

//   // Find the logout button and press it
//   const logout = await page.$('[aria-label="Logout"]');
//   await logout.click();

//   // Assert that the user is redirected to the home page
//   expect(page.url()).toBe('http://localhost:3000/login');
// });
// it('user enters invalid credentials', async () => {
//   // to sense the dialog which is the window aler
//   const alertDialogPromise = new Promise((resolve, reject) => {
//     page.on('dialog', (dialog) => {
//       if (dialog.type() === 'alert') {
//         resolve(dialog); // Resolve the promise when an alert is detected
//       } else {
//         reject(new Error('Window.Alert was not triggered'));
//       }
//     });
//   });
//   await page.goto('http://localhost:3000/login');
//   // Fill in the email and password fields
//   await page.type('#email', 'badmeber@books.com');
//   await page.type('#password', 'badpassword');

//   const submit = await page.$('aria/Submit');

//   await submit.click();

//   // Wait for dialog and then dismiss it
//   const dialog = await alertDialogPromise;
//   await dialog.dismiss();
// });
// it('Wont be able to click submit given bad email format', async () => {
//   await page.goto('http://localhost:3000/login');
//   // Fill in the email and password fields
//   await page.type('#email', 'badmeberbooks.com');
//   await page.type('#password', 'badpassword');

//   const isDisabled = await page.$eval('aria/Submit', (el) => el.disabled);
//   expect(isDisabled).toBe(true);
// });
// it('Good email format but no passwrod', async () => {
//   await page.goto('http://localhost:3000/login');
//   // Fill in the email and password fields
//   await page.type('#email', 'molly@books.com');
//   await page.type('#password', '');

//   const isDisabled = await page.$eval('aria/Submit', (el) => el.disabled);
//   expect(isDisabled).toBe(true);
// });
