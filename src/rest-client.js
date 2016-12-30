// https://dev.groupme.com/docs/v3
const { get, post } = require('axios');
const Promise = require('bluebird');

const baseURL = 'https://api.groupme.com/v3';

const resolveData = ({data:{response}}) => {
  return Promise.resolve(response)
}

class RestClient {
  constructor(token) {
    this.token = token
  }
  url(resource) {
    return `${baseURL}/${resource}?token=${this.token}`;
  }
  getMe() {
    return get(this.url('users/me')).then(resolveData)
  }
  getGroups() {
    return get(this.url('groups')).then(resolveData)
  }
  getGroupMessages(id) {
    return get(this.url(`groups/${id}/messages`)).then(resolveData)
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
