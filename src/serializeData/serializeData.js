const xss = require('xss');

function serializeData(data) {
  for (property in data) {
    if (property !== 'dm_needed') data[property] = xss(data[property]);
  }
  console.log(data);
  return data;
}

module.exports = serializeData;
