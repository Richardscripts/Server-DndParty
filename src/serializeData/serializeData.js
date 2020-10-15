const xss = require('xss');

function serializeData(data) {
  for (property in data) {
    data[property] = xss(data[property]);
  }
  return data;
}

module.exports = serializeData;
