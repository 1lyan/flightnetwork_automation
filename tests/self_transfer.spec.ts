import { test, expect } from '@playwright/test';

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
  // Visit app start page
  await page.goto('https://en.flightnetwork.com/');

  // accept all cookies
  await page.getByRole('button', { name: 'Accept All' }).click();

  // Expect the apge to contain a text
  await expect(page.getByText('The best airline tickets and airfares for cheap flights')).toBeVisible();

  // Fill in From field
  const from = page.locator('#searchForm-singleBound-origin-input');
  from.click();
  await from.fill('Athens');
  await from.press('Enter');

  // Fill in To field
  const to = page.locator('#searchForm-singleBound-destination-input');
  to.click();
  await to.fill('Thessaloniki');

  // Click Thessaloniki option
  await page.getByTestId('searchForm-LocationDropdownOption-SKG').click();
  
  // Click on Departure field
  // Note: Due to complexity of setting a specific date leave the defaults as is
  const departure = page.getByPlaceholder('Departure');
  departure.click();
  
  // To make sure the loading is done ...
  const requestPromise = page.waitForRequest('https://en.flightnetwork.com/graphql/SearchOnResultPage');
  // Hit the "Search flights" button
  await page.getByTestId('searchForm-searchFlights-button').click();
  
  // At this point the Search Results page is done loading and we can proceed
  const _ = await requestPromise;

  const selfTransferCheckbox = page.locator('#self-transfer-only');
  await expect(selfTransferCheckbox).toBeVisible();
  selfTransferCheckbox.click();
});