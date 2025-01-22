import { test, expect } from '@playwright/test';
import {
  GRAPHQL_URL,
  SEARCH_RESULTS_EL,
} from './constants';

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
  10. On the Results page click "Clear all" airlines filter
  11. Tick one airline, for example, SKY
  12. Check that first flight belongs to SKY airline
*/

test('Airlines', async ({ page }) => {
  const helper = new FlightSearchPage(page);
  // Visit app start page
  await helper.navigateToStartPage();

  // accept all cookies
  await helper.acceptCookies();

  await helper.verifyStartPageLoaded();

  // Fill in From field
  await helper.fillInFromAthens();

  // Fill in To field
  await helper.fillInToThessaloniki()
  
  // Click on Departure field
  // Note: Due to complexity of setting a specific date leave the defaults as is
  helper.setDepartureDate();

  // To make sure the loading is done ...
  const requestPromise = page.waitForRequest(GRAPHQL_URL);
  // Hit the "Search flights" button
  await helper.clickSearchButton();
  
  // At this point the Search Results page is done loading and we can proceed
  await requestPromise;

  const clearAll = await page.getByTestId('resultPage-AIRLINESFilter-deselect-all-button');
  await clearAll.click();

  const skyCheckbox = await page.locator('#airlines-GQ');
  await skyCheckbox.click();

  // And now check the block that contains the results
  const resultsBlock = page.getByTestId(SEARCH_RESULTS_EL);
  expect(resultsBlock).toBeVisible();

  // // Check that there is at least one block with departure info
  const departureInfo = await resultsBlock.locator('[data-testid*="resultPage-resultTrip"]').nth(0);
  await expect(departureInfo).toBeVisible();

  // // check that Departure block has SKY logo
  await expect(departureInfo.getByText('Departure')).toBeVisible();
  const skyLogo1 = await departureInfo.getByAltText('SKY express');
  await expect(skyLogo1).toBeVisible();

  const returnInfo = await resultsBlock.locator('[data-testid*="resultPage-resultTrip"]').nth(1);
  await expect(returnInfo).toBeVisible();
  // check that Return block has SKY logo
  await expect(returnInfo.getByText('Return')).toBeVisible();
  const skyLogo2 = await returnInfo.getByAltText('SKY express');
  await expect(skyLogo2).toBeVisible();
});