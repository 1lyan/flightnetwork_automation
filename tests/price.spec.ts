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
  10. On the Search Resuls page drag price slider
  11. Check the price of the first flight
*/
test('Price', async ({ page }) => {
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

  const priceText = await page.getByTestId('resultPage-PRICE-header').getByText('Price');
  expect(priceText).toBeVisible();

  // get left slider 
  const leftSlider = await page.getByTestId('resultPage-PRICEFilter-content').getByTestId('handle-0')
  // Check that the slider is visible on that page
  // Expect the apge to contain a text
  await expect(leftSlider).toBeVisible();

  // get right slider 
  const rightSlider = await page.getByTestId('resultPage-PRICEFilter-content').getByTestId('handle-1')
  // Check that the slider is visible on that page
  // Expect the apge to contain a text
  await expect(rightSlider).toBeVisible();

});