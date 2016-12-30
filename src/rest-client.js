// https://dev.groupme.com/docs/v3
const { get, post } = require('axios');

const baseURL = 'https://api.groupme.com/v3';

class RestClient {
  constructor(token) {
    this.token = token
  }
  url(resource) {
    return `${baseURL}/${resource}?token=${this.token}`;
  }
  getGroups() {
    return get(this.url('groups'))
  }
  getGroupMessages(id) {
    return get(this.url(`groups/${id}/messages`))
  }
  // TODO Attachment support
  // https://dev.groupme.com/docs/v3#messages_create
  sendGroupMessage(id) {
    let guid = Math.random().toString(16).substring(2);
    let url = this.url(`groups/${id}/messages`);
    return (text) => post(url, {
      message: { source_guid: guid, text }
    })
  }
}

module.exports = RestClient;
