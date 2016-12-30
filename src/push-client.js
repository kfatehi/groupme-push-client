// https://dev.groupme.com/tutorials/push
const debug = require('debug')('groupme-push-client:push-client');
const Promise = require('bluebird');
const Subscription = require('./subscription');
const WebSocket = require('ws');
const EventEmitter = require('events').EventEmitter;

class Client extends EventEmitter {
  constructor(config) {
    this.ACCESS_TOKEN = config.ACCESS_TOKEN;
    if ( !config.ACCESS_TOKEN ) {
      throw new Error('push client requires access token');
    }
    this.clientId = null;
    this.outboundMessagesCount = 0;
    this.ws = null;
    this.channels = {
      '/meta/subscribe': {
        handle: ({successful, subscription}) => {
          let ch = this.channels[subscription];
          successful ? ch.resolve() : ch.reject();
        }
      },
      '/meta/handshake': {
        handle: ({successful, clientId}) => {
          this.clientId = clientId;
          successful ? resolve() : reject();
        }
      }
    };
  }
  send(msg) {
    let obj = Object.assign({}, msg, {id: ++this.outboundMessagesCount});
    this.ws.send(JSON.stringify(obj))
    //debug('sent data', obj);
  }
  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket('wss://push.groupme.com/faye');

      this.ws.on('open', function open() {
        this.send({
          "channel":"/meta/handshake",
          "version":"1.0",
          "supportedConnectionTypes":["callback-polling"]
        });
      });

      this.ws.on('message', (jsonString, flags) => {
        let data = JSON.parse(jsonString)[0];
        //debug('got data', JSON.stringify(data, null, 2));

        let ch = this.channels[data.channel];
        if ( ch ) {
          ch.handle(data);
        } else {
          debug('donno how to handle that message!');
        }
      });
    });
  }
  subscribe(subName) {
    return new Promise((resolve, reject) => {
      this.channels[subName] = {
        resolve: () => {
          resolve(new Subscription(this))
        },
        reject: () => {
          reject(new Error('subscription failed'))
        },
        handle: (msg) => {
        }
      }

      this.send({
        "channel":"/meta/subscribe",
        "clientId":this.clientId,
        "subscription":subName,
        "ext":{"access_token":this.ACCESS_TOKEN}
      })
    });
  } 
}

module.exports = function ({ ACCESS_TOKEN }) {
  return new Client({ACCESS_TOKEN});
}
