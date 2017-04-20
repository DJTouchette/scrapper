// const scrapeIt = require("scrape-it");
// const RequestProxy = require("request-proxy")
const request = require("tinyreq");
const cheerio = require("cheerio");
const fs = require("fs");
const KijijiScraper = require("./Kijiji/index.js");
const RenFasterScraper = require("./RentFaster/index.js");

async function scrape() {
  for (let i = 0; i < 1; i += 1) {
    await KijijiScraper();
    await RenFasterScraper();
  }


}

async function compareFiles() {
  let kijijiJsonFile = fs.readFileSync('Kijiji/kijijiAdresses.json');
  let rentFasterJsonFile = fs.readFileSync('Rentfaster/rentfasterAdresses.json');

  let kijijiJson = JSON.parse(kijijiJsonFile);
  let rentFatserJson = JSON.parse(rentFasterJsonFile);
  console.log(kijijiJson);
  console.log(rentFatserJson);

  kijijiJson.forEach((currentValue, index, array) => {
    console.log(rentFatserJson.includes(currentValue));
  });

}

// scrape();
compareFiles();
