const express = require("express");
const app = express();
const puppeteer = require("puppeteer");
const cron = require("node-cron");

const port = 3000;

cron.schedule("* * * * *", async () => {
  const browser = await puppeteer.launch({ headless: "shell" });
  const page = await browser.newPage();

  console.info("Navigating to page...");

  await page.goto(
    "https://findbolig.nu/da-dk/udlejere/oestergaarden/ekstern-venteliste/",
    { waitUntil: "networkidle2" }
  );

  console.info("Accepting cookies...");

  await page.evaluate(() => {
    CookieInformation.submitAllCategories();
  });

  const elementHtml = await page.$eval("#app", (el) => el.innerHTML);

  if (elementHtml.includes("Lukket for opskrivning")) {
    console.info("Closed for registration");
  }

  console.info("Done");

  await browser.close();
});

app.get("/health", async (req, res) => {
  res.send("OK");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
