import { 
  START_PAGE,
  START_PAGE_TEXT,
  ATHENS_OPTION,
  THESSALINIKI_OPTION,
  SEARCH_BUTTON
 } from '../tests/constants';

import { Page } from  '../node_modules/playwright/types/test';
import { expect } from '@playwright/test';

class FlightSearchPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToStartPage() {
    await this.page.goto(START_PAGE);
  }

  async acceptCookies() {
    await this.page.getByRole('button', { name: 'Accept All' }).click();
  }

  async verifyStartPageLoaded() {
    await expect(this.page.getByText(START_PAGE_TEXT)).toBeVisible();
  }

  async fillInFromAthens(){
    const from = this.page.locator('#searchForm-singleBound-origin-input');
    from.click();
    await from.fill('Athens');
    await this.page.getByTestId(ATHENS_OPTION).click();
  }

  async fillInToThessaloniki(){
    const to = this.page.locator('#searchForm-singleBound-destination-input');
    to.click();
    await to.fill('Thessaloniki');
    await this.page.getByTestId(THESSALINIKI_OPTION).click();
  }

  async fillInToMadrid(){
    const to = this.page.locator('#searchForm-singleBound-destination-input');
    to.click();
    await to.fill('Madrid');

    // Click Madrid option
    await this.page.getByTestId('searchForm-LocationDropdownOption-MAD').getByText('Madrid (All Airports)').click();
  }

  setDepartureDate(){
    // Note: Due to complexity of setting a specific date leave the defaults as is
    const departure = this.page.getByPlaceholder('Departure');
    departure.click();
  }

  async clickSearchButton(){
    // Hit the "Search flights" button
    await this.page.getByTestId(SEARCH_BUTTON).click();
  }
}

export default FlightSearchPage;