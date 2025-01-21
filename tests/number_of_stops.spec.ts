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
  10. Verify there are search results available
*/
test('Number of Stops: All', async ({ page }) => {
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
  const request = await requestPromise;

  // And now check the block that contains the results
  const resultsBlock = await page.getByTestId('resultPage-searchResults');
  await expect(resultsBlock).toBeVisible();

  // Check that there is at least one block with trip-tags
  const tripTags = await resultsBlock.getByTestId('trip-tags').first();
  await expect(tripTags).toBeVisible();

  // Check that there is at least one block with departure info
  const departureInfo = await resultsBlock.locator('[data-testid*="resultPage-resultTrip"]').nth(0);
  await expect(departureInfo).toBeVisible();

  // check that Departure block has text
  await expect(departureInfo.getByText('Departure')).toBeVisible();

  const returnInfo = await resultsBlock.locator('[data-testid*="resultPage-resultTrip"]').nth(1);
  await expect(returnInfo).toBeVisible();
  // check that Return block has text
  await expect(returnInfo.getByText('Return')).toBeVisible();
});

/* 
  1. Open https://en.flightnetwork.com/
  2. Fill in "From": Athens
  3. Fill in "To": Madrid
  4. Leave  "Departure" as is: defaults to current date
  5. Leave "Return" as is: defaults to 7 days in future
  6. Leave "Passengers" as is: 1 adult
  7. Leave "Class" as is: Economy
  8. Leave "Return" radio button as is: Return
  9. Hit "Search Flights" button
  10. On the Results page pick "Maximum one stop"
  11. Verify that the first flight has 1 stop
*/

test('Number of Stops: Maximum one stop', async ({ page }) => {
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
  await to.fill('Madrid');

  // Click Thessaloniki option
  await page.getByTestId('searchForm-LocationDropdownOption-MAD').getByText('Madrid (All Airports)').click();
  
  // Click on Departure field
  // Note: Due to complexity of setting a specific date leave the defaults as is
  const departure = page.getByPlaceholder('Departure');
  departure.click();

  // To make sure the loading is done ...
  const requestPromise = page.waitForRequest('https://en.flightnetwork.com/graphql/SearchOnResultPage');
  // Hit the "Search flights" button
  await page.getByTestId('searchForm-searchFlights-button').click();
  
  // At this point the Search Results page is done loading and we can proceed
  const request = await requestPromise;

  // Pick Nonstop flights
  await page.getByTestId('MAX_STOPS-max').click();

  // And now check the block that contains the results
  const resultsBlock = await page.getByTestId('resultPage-searchResults');
  await expect(resultsBlock).toBeVisible();

  // Check that there is at least one block with trip-tags
  const tripTags = await resultsBlock.getByTestId('trip-tags').first();
  await expect(tripTags).toBeVisible();

  // Check that there is at least one block with departure info
  const departureInfo = await resultsBlock.locator('[data-testid*="resultPage-resultTrip"]').nth(0);
  await expect(departureInfo).toBeVisible();

  // check that Departure block has text
  await expect(departureInfo.getByText('Departure')).toBeVisible();
  // Check that this is a nonstop flight
  await expect(departureInfo.getByText('1 stop')).toBeVisible();

  const returnInfo = await resultsBlock.locator('[data-testid*="resultPage-resultTrip"]').nth(1);
  await expect(returnInfo).toBeVisible();
  // check that Return block has text
  await expect(returnInfo.getByText('Return')).toBeVisible();
  // Check that this is a nonstop flight
  await expect(returnInfo.getByText('1 stop')).toBeVisible();
});

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
  10. On the Results page pick "Nonstop flights"
  11. Verify that the first flight is nonstop
*/
test('Number of Stops: Nonstop flights', async ({ page }) => {
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
  const request = await requestPromise;

  // Pick Nonstop flights
  await page.getByTestId('MAX_STOPS-direct').click();

  // And now check the block that contains the results
  const resultsBlock = await page.getByTestId('resultPage-searchResults');
  await expect(resultsBlock).toBeVisible();

  // Check that there is at least one block with trip-tags
  const tripTags = await resultsBlock.getByTestId('trip-tags').first();
  await expect(tripTags).toBeVisible();

  // Check that there is at least one block with departure info
  const departureInfo = await resultsBlock.locator('[data-testid*="resultPage-resultTrip"]').nth(0);
  await expect(departureInfo).toBeVisible();

  // check that Departure block has text
  await expect(departureInfo.getByText('Departure')).toBeVisible();
  // Check that this is a nonstop flight
  await expect(departureInfo.getByText('Nonstop flights')).toBeVisible();

  const returnInfo = await resultsBlock.locator('[data-testid*="resultPage-resultTrip"]').nth(1);
  await expect(returnInfo).toBeVisible();
  // check that Return block has text
  await expect(returnInfo.getByText('Return')).toBeVisible();
  // Check that this is a nonstop flight
  await expect(returnInfo.getByText('Nonstop flights')).toBeVisible();
});