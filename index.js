const scrapeIt = require("scrape-it");
const request = require("tinyreq");
const cheerio = require("cheerio");
const kijijiBase = 'http://www.kijiji.ca';

console.log("Starting kijiji");
request("http://www.kijiji.ca/b-house-rental/calgary/c43l1700199", function (err, body) {
    // console.log(err || body); // Print out the HTML


    if (!err) {
      console.log("Starting parse");
      let $ = cheerio.load(body);
      let container = $('div#MainContainer');
      let thing = $('div.title a').first().attr('href');
      console.log(thing);
      console.log(kijijiBase + thing);

      request(kijijiBase + thing, function (err, body) {
        let $ = cheerio.load(body);
        let table = $('table.ad-attributes').children().eq(2).find('td').text();

        console.log(table);

      });

      //
      // $('div#MainContainer').each(function(i, element){
      //     console.log('in each');
      //    console.log($(this).);
      //  });




      console.log("done");
    }

});
