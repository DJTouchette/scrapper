// const scrapeIt = require("scrape-it");
// const RequestProxy = require("request-proxy")
const request = require("tinyreq");
const cheerio = require("cheerio");
const fs = require("fs");
const parser = require('parse-address');
const KijijiScraper = require("./Kijiji/index.js");
const RenFasterScraper = require("./RentFaster/index.js");

async function scrape() {
  for (let i = 0; i < 10; i += 1) {
    await KijijiScraper();
    await RenFasterScraper();
  }


}

async function compareFiles() {
  let kijijiJsonFile = fs.readFileSync('Kijiji/kijijiAdresses.json');
  let rentFasterJsonFile = fs.readFileSync('Rentfaster/rentfasterAdresses.json');

  let kijijiJson = JSON.parse(kijijiJsonFile);
  let rentFatserJson = JSON.parse(rentFasterJsonFile);
  // console.log(kijijiJson);
  // console.log(rentFatserJson);
  rentFatserJson.forEach((currentValue, index, array) => {
    // 40090 Retreat Road
    currentValue = parser.parseLocation(currentValue).street;
    console.log(currentValue);

  });
  kijijiJson.forEach((currentValue, index, array) => {
    // 40090 Retreat Road
    // var parsed = parser.parseLocation(currentValue + ' Calgary' + ' Alberta');

    // console.log(parsed);
    console.log(rentFatserJson.includes(parser.parseLocation(currentValue).street));
  });

}

// scrape();
compareFiles();
