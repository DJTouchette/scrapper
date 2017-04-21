// const scrapeIt = require("scrape-it");
// const RequestProxy = require("request-proxy")
const request = require("tinyreq");
const cheerio = require("cheerio");
const fs = require("fs");
const parser = require('parse-address');
const KijijiScraper = require("./Kijiji/index.js");
const RenFasterScraper = require("./RentFaster/index.js");
const amountOfPagesRentFaster = 1;
const amountOfPagesKijiji = 1;
let shared = 0;

async function scrape() {
  const allPromises = [];

  for (let i = 0; i < amountOfPagesRentFaster; i += 1) {
    allPromises.push(RenFasterScraper());
  }

  for (let i = 0; i < amountOfPagesKijiji; i += 1) {
      allPromises.push(KijijiScraper());
  }

  Promise.all(allPromises)
  .then(() => {
    // compareFiles();
  })
  .catch(reason => {
    console.log(reason)
  });
}

async function compareFiles() {
  return new Promise( function(resolve, reject) {
    let kijijiJsonFile = fs.readFileSync('Kijiji/kijijiAdresses.json');
    let rentFasterJsonFile = fs.readFileSync('Rentfaster/rentfasterAdresses.json');

    let kijijiJson = JSON.parse(kijijiJsonFile);
    let rentFatserJson = JSON.parse(rentFasterJsonFile);

    kijijiJson.forEach((currentValue, index, array) => {
      if (rentFatserJson.includes(currentValue)) shared += 1;
    });

    console.log("Rent faster has " + rentFatserJson.length + " properties that have addresses in " + amountOfPagesRentFaster + " pages scrapped");
    console.log("Kijiji has " + kijijiJson.length + " properties that have addresses in " + amountOfPagesKijiji + " pages scrapped");

    console.log("Of those " + rentFatserJson.length + " adds there is " + shared + " that are on kijiji" );
    resolve(shared);
  });

}

scrape();
// compareFiles();
