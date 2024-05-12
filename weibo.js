const puppeteer = require("puppeteer");
const os = require("os");
const path = require("path");

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 0,
      height: 0,
    },
    userDataDir: path.join(os.homedir(), ".puppeteer-data"),
  });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto("https://service.account.weibo.com/show?rid=K1CeK8Atd6K4f", {
    waitUntil: "domcontentloaded",
  });

  //   // Type into search box
  //   await page.type('.devsite-search-field', 'automate beyond recorder');

  //   // Wait and click on first result
  //   const searchResultSelector = '.devsite-result-item-link';
  //   await page.waitForSelector(searchResultSelector);
  //   await page.click(searchResultSelector);

  //   // Locate the full title with a unique string
  //   const textSelector = await page.waitForSelector(
  //     'text/Customize and automate'
  //   );
  //   const fullTitle = await textSelector?.evaluate(el => el.textContent);

  //   获取页面数据
  const quotes = await page.evaluate(() => {
    if (document) {
      const quote = document
        .querySelector('[node-type="report_user_area"]')
        .querySelector(".mb")
        .querySelector("a").innerHTML;

      return { quote };
    }
    return null;
  });

  //   输出 quotes
  console.log(quotes);

  //   await page.waitForNavigation({
  //     waitUntil: "load",
  //   });

  await page.screenshot({
    path: path.resolve(__dirname, `./${Date.now()}.png`),
    type: "png",
    fullPage: true,
  });

  await browser.close();
})();
