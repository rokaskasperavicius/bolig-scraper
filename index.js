const express = require("express");
const app = express();
const puppeteer = require("puppeteer");
const cron = require("node-cron");

const port = 3000;

let counter = 0;

async function scrapeData(counter, url) {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"], // Required.
    headless: "shell",
  });

  const page = await browser.newPage();

  console.info(`[${counter}] Navigating to page...`);

  await page.goto(url, { waitUntil: "networkidle2" });

  console.info(`[${counter}] Accepting cookies...`);

  await page.evaluate(() => {
    CookieInformation.submitAllCategories();
  });

  const elementHtml = await page.$eval("#app", (el) => el.innerHTML);

  if (elementHtml.includes("Lukket for opskrivning")) {
    console.info(`[${counter}] Closed for registration`);
  } else {
    console.info(`[${counter}] Open for registration`);
  }

  console.info(`[${counter}] Done`);

  await browser.close();
}

// Every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  await scrapeData(
    counter++,
    "https://findbolig.nu/da-dk/udlejere/oestergaarden/ekstern-venteliste/"
  );
});

app.get("/scrape", async (req, res) => {
  await scrapeData(counter++, "https://findbolig.nu");
  res.send("Scraped");
});

app.get("/health", async (req, res) => {
  res.send("OK");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
