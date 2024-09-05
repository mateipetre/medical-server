const { Parser } = require('json2csv');

function getCSV(data) {
  if (data.length === 0) {
    return '';
  }

  const fields = Object.keys(data[0]);
  const opts = { fields };
  const parser = new Parser(opts);
  const csv = parser.parse(data);
  return csv;
}

function DownloadLink(data, fileName) {
  const text = data;
  const element = document.createElement('a');
  element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
  element.setAttribute('download', fileName);

  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();

  document.body.removeChild(element);
}

module.exports = {
  getCSV,
  DownloadLink
};