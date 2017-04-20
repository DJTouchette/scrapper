const request = require("tinyreq");
const rp = require('request-promise');
const cheerio = require("cheerio");
const kijijiBase = 'http://www.kijiji.ca';
const fs = require('fs');

let kijijiPageNum = 1;
let allAdressesKijiji = [];

function getPageUrl() {
  let currentPageUrl = kijijiBase + '/b-house-rental/calgary' + '/page-' + kijijiPageNum + '/c43l1700199';
  kijijiPageNum += 1;
  console.log(currentPageUrl);
  return currentPageUrl;
}

async function scrapePage(){
  console.log("Starting kijiji");
  await request(getPageUrl(), function (err, body) {

      if (!err) {
        console.log("Starting kiji parse");

        let $ = cheerio.load(body);
        let container = $('div#MainContainer');

        let thing = $('div.title a').children();

        console.log("Looping through all the a tags to get links");

        let keys = Object.keys(thing);
        for (let i = 0; i < thing.prevObject.length; i += 1) {
          let currentChild = thing.prevObject[i];

          console.log('requesting info page for this url');
          request(kijijiBase + currentChild.attribs.href, function (err, body) {
            let $ = cheerio.load(body);
            let address = $('table.ad-attributes').children().eq(2).find('td').text();


            const validatedAddress = address.split(',')[0];

            if (validatedAddress == "Calgary") return;
            console.log(validatedAddress, "Found the address, appending to array");

            let jsonFile = fs.readFileSync('Kijiji/kijijiAdresses.json');
            let json = JSON.parse(jsonFile);

            json.push(validatedAddress);
            let jsonFileString = JSON.stringify(json);
            // console.log(jsonFileString);
            fs.writeFileSync('Kijiji/kijijiAdresses.json', jsonFileString);

            // allAdressesKijiji.push(table);


          });
        }

      }

      if (err) console.log("Error", err);

  });
}

module.exports = scrapePage;
