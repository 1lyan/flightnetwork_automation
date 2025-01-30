import { test, expect } from '@playwright/test';
import { GRAPHQL_URL } from './constants';

import FlightSearchPage from './FlightSearchPage';

/* 
  1. Open https://en.flightnetwork.com/
  2. Fill in "From": Athens
  3. Fill in "To": Thessaloniki
  4. Leave  "Departure" as is: defaults to current date
  5. Leave "Return" as is: defaults to 7 days in future
  6. Leave "Passengers" as is: 1 adult
  7. Leave "Class" as is: Economy
  8. Leave "Return" radio button as is: Return
  9. Hit "Search Flights" button
  10. On the Search Resuls page check that self transfer checkbox is visible on the page
*/

test('Self Transfer', async ({ page }) => {
  const helper = new FlightSearchPage(page);
  // Visit app start page
  await helper.navigateToStartPage();

  // accept all cookies
  await helper.acceptCookies()

  // Expect the apge to contain a text
  await helper.verifyStartPageLoaded()

  // Fill in From field
  await helper.fillInFromAthens()

  // Fill in To field
  await helper.fillInToThessaloniki();
  
  // Click on Departure field
  helper.setDepartureDate();
  
  // To make sure the loading is done ...
  const requestPromise = page.waitForRequest(GRAPHQL_URL);
  // Hit the "Search flights" button
  await helper.clickSearchButton();
  
  // At this point the Search Results page is done loading and we can proceed
  await requestPromise;

  const selfTransferCheckbox = page.locator('#self-transfer-only');
  await expect(selfTransferCheckbox).toBeVisible();
  selfTransferCheckbox.click();
});