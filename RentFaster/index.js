
const request = require("tinyreq");
const rp = require('request-promise');
const cheerio = require("cheerio");
const Nightmare = require('nightmare');
const fs = require('fs');

const firefox = "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36";
const rentFasterBaseUrl = 'https://www.rentfaster.ca';
let pageNum = 0;
function getPageUrl() {
  let currentPageUrl = pageNum == 0 ? "https://www.rentfaster.ca/ab/calgary/rentals/?keywords=&sortby=price" : rentFasterBaseUrl + '/ab/calgary/rentals/?keywords=&sortby=price&cur_page=' + pageNum + '&proximity_type=location-city&novacancy=0&city_id=1';
  console.log(currentPageUrl);
  pageNum += 1;
  return currentPageUrl;
}

function scrape() {
  try {
    headlessBorwserParse(getPageUrl(), pageNum - 1)
    .then((pagenum) => {
      return readScrappedHtml(pagenum);
    })
    .then( ({ urlArray, pagenum }) => {
      for (let i = 0; i < urlArray.length; i += 1) {
        getAddress(urlArray[i], pagenum);
      }
    })
    .then((adresses) => {
      console.log('done');
    });
  }

  catch(err) {
    console.log("Nothing worked heres why: ", err);
  }

}

function getAddress(url, pagenum) {
  return new Promise( function(resolve, reject) {
    console.log('getting address');
    request(url, function (err, body) {

        if (!err) {
          console.log("Starting rentfaster parse");

          let $ = cheerio.load(body);
          let address = $('div.address').first().children().eq(1).text();
          if (address.includes("City:")) {
            return;
          }
          console.log(address.replace(/Address:/g,''), 'on page: '+ pagenum);

          if (address){
            let jsonFile = fs.readFileSync('Rentfaster/rentfasterAdresses.json');
            let json = JSON.parse(jsonFile);

            json.push(address.replace(/Address:/g,'').substring(1));
            let jsonFileString = JSON.stringify(json);
            console.log(jsonFileString);
            fs.writeFileSync('Rentfaster/rentfasterAdresses.json', jsonFileString);
          }

          resolve(address);
        }

        if (err) reject(err);

  });
});
}

function readScrappedHtml(pagenum) {
  return new Promise( function(resolve, reject) {
    let urlArray = [];
    const data = fs.readFileSync('Rentfaster/rentfasterhtml/rentfaster'+ pagenum +'.html', 'utf8');

    let $ = cheerio.load(data);

    const allListings = $('h4.listing-title');
    console.log(allListings);

    for (let i = 0; i < allListings.length; i += 1) {
      urlArray.push(allListings[i].children[2].next.attribs.href);
      console.log('\n \n \n \n \n \n \n \n \n Line');
      console.log(allListings[i].children[2].next.attribs.href);
      // getAddress(allListings[i].children[2].next.attribs.href);
    }
    console.log('url array');
    console.log(urlArray);
    resolve({ urlArray, pagenum });
  });
}

function headlessBorwserParse(url, pagenum) {
  return new Promise( function(resolve, reject) {
    new Nightmare()
      .viewport(1000, 1000)
      .useragent(firefox)
      .goto(url)
      .wait()
      .html('Rentfaster/rentfasterhtml/rentfaster'+ pagenum + '.html', 'HTMLComplete')
      .wait()
      .screenshot('Rentfaster/rentfasterScreenshots/screenshot'+ pageNum +'.png')
      .end()
      .run(function(err, nightmare) {
        if (err) return reject(err)
        console.log('Done!');
        resolve(pagenum);
      });
    });
}



  // console.log(screenshot);


module.exports = scrape;
