// https://dev.groupme.com/docs/v3
const { get } = require('axios');

const baseURL = 'https://api.groupme.com/v3';

module.exports = ({ ACCESS_TOKEN }) => {
  const urlFor = resource => {
    return `${baseURL}/${resource}?token=${ACCESS_TOKEN}`;
  }

  return {
    getGroups: () => get(urlFor('groups'))
  }
}
