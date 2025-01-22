import { test, expect } from '@playwright/test';
import { 
  GRAPHQL_URL,
  PRICE_EL,
  SEARCH_RESULTS_EL,
 } from '../tests/constants';

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
  10. On the Search Resuls page check that price slider is visible on that page
  11. Drag the slider
  12. Then check the 1st flight's price
  13. The price must be lowerPrice <= Flight Price <= upperPrice
*/

test('Price', async ({ page }) => {
  const helper = new FlightSearchPage(page);
  // Visit app start page
  await helper.navigateToStartPage();

  // accept all cookies
  await helper.acceptCookies();

  // Expect the apge to contain a text
  await helper.verifyStartPageLoaded()

  // Fill in From field
  await helper.fillInFromAthens()

  // Fill in To field
  await helper.fillInToThessaloniki();
  
  // Click on Departure field
  helper.setDepartureDate()
  
  // To make sure the loading is done ...
  const request = page.waitForRequest(GRAPHQL_URL);
  // Hit the "Search flights" button
  await helper.clickSearchButton();
  
  // At this point the Search Results page is done loading and we can proceed
  await request;

  const priceText = await page.getByTestId('resultPage-PRICE-header').getByText('Price');
  expect(priceText).toBeVisible();

  // get left slider 
  const leftSlider = await page.getByTestId(PRICE_EL).getByTestId('handle-0')
  // Check that the slider is visible on that page
  // Expect the apge to contain a text
  await expect(leftSlider).toBeVisible();

  // get right slider 
  const rightSlider = await page.getByTestId(PRICE_EL).getByTestId('handle-1')
  // Check that the slider is visible on that page
  await expect(rightSlider).toBeVisible();

  const leftSliderDiv = await page.getByTestId(PRICE_EL).locator('div.slider-handles > [data-testid="handle-0"]')
  const rightSliderDiv = await page.getByTestId(PRICE_EL).locator('div.slider-handles > [data-testid="handle-1"]')

  // To make sure the filtering is done ...
  const priceFiltering = page.waitForRequest(GRAPHQL_URL);

  await leftSliderDiv.hover();
  await page.mouse.down();
  await rightSliderDiv.hover();
  await page.mouse.up();

  // wait until the page loads the search results
  await priceFiltering;

  // get elements with lower and upper prices
  const lowerPriceDiv = await page.getByTestId(PRICE_EL).getByText('$').first()
  const upperPriceDiv = await page.getByTestId(PRICE_EL).getByText('$').last()

  const leftSliderConent = await lowerPriceDiv.textContent();
  const rightSliderContent = await upperPriceDiv.textContent();
  const lowerPriceNum = leftSliderConent.replace("$", "");
  const upperPriceNum = rightSliderContent.replace("$", "");

  // get search results block
  const resultsBlock = await page.getByTestId(SEARCH_RESULTS_EL);
  await expect(resultsBlock).toBeVisible();

  // get price block in first flight
  const priceDiv = await resultsBlock.getByTestId("result-trip-card").first().getByTestId('standard-price');
  const standardPrice = await priceDiv.textContent();
  const standardPriceNum = standardPrice.replace('$', '');
  
  expect(lowerPriceNum <= standardPrice && standardPriceNum <= upperPriceNum)

});