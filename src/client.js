// https://dev.groupme.com/tutorials/push
const debug = require('debug')('groupme-push-client:push-client');
const Promise = require('bluebird');
const WebSocket = require('ws');
const EventEmitter = require('events').EventEmitter;
const RestClient = require('./rest-client')

class Subscription extends EventEmitter {}

class Client {
  constructor(token) {
    this.token = token;
    this.api = new RestClient(token);
    this.clientId = null;
    this.msgId = 0;
    this.ws = null;
    this.channels = {}
  }
  connect() {
    this.ws = new WebSocket('wss://push.groupme.com/faye');
    this.ws.on('message', (jsonString, flags) => {
      let data = JSON.parse(jsonString)[0];
      let ch = this.channels[data.channel];
      debug('got data', data);
      ch ? ch.handle(data) : debug('unhandled message', data);
    });
    return new Promise((resolve, reject) => {
      this.ws.on('open', () => resolve(this._handshake()));
    });
  }
  send(msg) {
    let obj = Object.assign({}, msg, {id: ++this.msgId});
    this.ws.send(JSON.stringify(obj))
    debug('sent data', obj);
  }
  _handshake() {
    return new Promise((resolve, reject) => {
      this.channels['/meta/handshake'] = {
        handle: (data) => {
          const {successful, clientId} = data;
          this.clientId = clientId;
          successful ? resolve(this) : reject(data);
        }
      }
      this.send({
        "channel":"/meta/handshake",
        "version":"1.0",
        "supportedConnectionTypes":["callback-polling"]
      });
    });
  }
  subscribe(subName) {
    return new Promise((resolve, reject) => {
      this.channels['/meta/subscribe'] = {
        handle: (data) => {
          const {successful, subscription} = data;
          const ch = this.channels[subscription];
          if ( successful ) {
            const emitter = new Subscription();
            this.channels[subName] = {
              emitter,
              handle: (msg)=>{
                const { data } = msg;
                if ( data && data.type ) {
                  emitter.emit(data.type, data);
                }
              }
            }
            resolve(emitter);
          } else {
            reject(data);
          }
        }
      }
      this.send({
        "channel":"/meta/subscribe",
        "clientId":this.clientId,
        "subscription":subName,
        "ext":{"access_token":this.token}
      })
    });
  }
}

module.exports = Client;
