/**
 * assets.js
 * Update the list of URLs to in pages.txt file
 * To run this script, copy and paste `node assets.js` in the terminal
 */

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const XLSX = require("xlsx");


// File paths for storing data
const xlsxFilePath = path.join(__dirname, 'Assets.xlsx');

function saveToExcel(data) {
  const headers = Object.keys(data[0]);
  const rows = data.map(item => {
    return headers.map(key => {
      const value = item[key];
      if (Array.isArray(value)) {
        return value.join('\n');
      }
      return value;
    });
  });
  const ws_data = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  XLSX.writeFile(wb, xlsxFilePath);
  console.log('Data Saved');
}

async function fetchData(url) {
    const response = await fetch(url);
    const htmlContent = await response.text();
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;
    let data = {};
    let xlsx = [];
    let pdfs = [];
    let images = [];

    document.querySelectorAll('a').forEach(anchor => {
        const href = anchor.href;
        if (href?.includes('.xlsx')){
            xlsx.push(href);
        }
        else if (href?.includes('.pdf')){
            pdfs.push(href);
        }
    });

    document.querySelectorAll('img').forEach(img => {
        const imgsrc = img.src;
        images.push(imgsrc);
    });

    data["url"] = url;
    data["images"] = images;
    data["pdfs"] = pdfs;
    data["xlsx"] = xlsx;
    return data;
}

function getUrls() {
  const data = fs.readFileSync('pages.txt', 'utf8');
  return data.split('\n');
}

(async () => {
   const urls = getUrls();

   let allData = [];
   for (const url of urls) {
         data = await fetchData(url);
         allData = allData.concat(data);
   }
   saveToExcel(allData);
})();
