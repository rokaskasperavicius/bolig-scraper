const express = require("express");
const app = express();
const puppeteer = require("puppeteer");
const cron = require("node-cron");

const port = 3000;

async function scrapeData() {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"], // Required.
    headless: "shell",
  });

  const page = await browser.newPage();

  console.group();
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

  console.groupEnd();

  await browser.close();
}

// Every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  await scrapeData();
});

app.get("/scrape", async (req, res) => {
  await scrapeData();
  res.send("Scraped");
});

app.get("/health", async (req, res) => {
  res.send("OK");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
