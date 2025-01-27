/**
 * assets.js
 * Update the list of URLs to scrape on Line 56
 * To run this script, copy and paste `node assets.js` in the terminal
 */

const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');


// File paths for storing data
const jsonFilePath = path.join(__dirname, 'assets.json');

function saveToJSON(data) {
   fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2));
   console.log(`Data saved`);
}

async function fetchData(url) {
    const response = await fetch(url);
    const $ = cheerio.load(await response.text());
    let data = {};
    let xlsx = [];
    let pdfs = [];
    let images = [];

    const country = url.split('/')[3];

    $('a').each((index, element) => {
        const anchorsrc = $(element).attr('href');
        if (anchorsrc?.includes('.xlsx')){
            xlsx.push(anchorsrc);
        }
        else if (anchorsrc?.includes('.pdf')){
            pdfs.push(anchorsrc);
        }
    });

    $('img').each((index, element) => {
        const imgsrc = $(element).attr('src');
        images.push(imgsrc);
    });

    data["url"] = url;
    data["images"] = images;
    data["pdfs"] = pdfs;
    data["xlsx"] = xlsx;
    return data;
}

(async () => {
   const urls = ["https://www.sample.com/abc.html","https://www.sample.com/def.html"];

   let allData = [];
   for (const url of urls) {
         data = await fetchData(url);
         allData = allData.concat(data);
   }
   saveToJSON(allData);

})();
