
//import { Builder, Capabilities, By } from "selenium-webdriver"
const {Builder, Capabilities, By} = require('selenium-webdriver');

require('chromedriver')

const driver = new Builder().withCapabilities(Capabilities.chrome()).build()

beforeEach(async () => {
    driver.get('http://localhost:4000/')
})

afterAll(async () => {
    driver.quit()
})

test('Title shows up when page loads', async () => {
    const title = await driver.findElement(By.id('title'))
    const displayed = await title.isDisplayed()
    expect(displayed).toBe(true)
})

test('Verify that the Choices div displays after clicking the Draw button', async () => {
    //click the Draw button
    const drawButton = await driver.findElement(By.id('draw'));
    await drawButton.click();

    //look for the Choices container
    const choicesContainer = await driver.findElement(By.id('choices'));
    //await driver.sleep(3000);

    expect(choicesContainer.isDisplayed()).toBeTruthy();
});

test(`Verify that the correct bot is added to the "Your Duo" section when its "Add to Duo" button is clicked`, async () => {
    //click the Draw button
    const drawButton = await driver.findElement(By.id('draw'));
    await drawButton.click();

    //await driver.sleep(10000);
    //find the name of the first bot and click the its "Add to Duo" button
    const botName = await driver.findElement(By.xpath(`//div[@class="bot-card outline"]/h3`)).getText();
    const addToDuoButton = await driver.findElement(By.xpath(`//button[@class='bot-btn']`));
    await addToDuoButton.click();

    //verify that the name of the chosen bot appears in the player-duo container
    const selectedBotName = await driver.findElement(By.xpath(`//div[@id='player-duo']/div[@class='bot-card outline']/h3`)).getText();

    //await driver.sleep(5000);
    expect(botName).toBe(selectedBotName);
});