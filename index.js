const { ACCESS_TOKEN, USER_ID } = require('./config');

if (!ACCESS_TOKEN || !USER_ID) {
  console.error('create config.js per the sample file');
  process.exit(1);
}

const ENDPOINT = "https://push.groupme.com/faye";
const USER_SUB = `/user/${USER_ID}`;
const WebSocket = require('ws');
const ws = new WebSocket('wss://push.groupme.com/faye');

let outboundMessagesCount = 0;
const send = (_obj) => {
  // i have to keep incrementing id according to their docs lol
  // https://dev.groupme.com/tutorials/push
  let obj = Object.assign({}, _obj, {id: ++outboundMessagesCount});
  ws.send(JSON.stringify(obj))
  console.log('sent data', obj);
};

ws.on('open', function open() {
  console.log('opened');
  CHANNELS['/meta/handshake'].start();
});

ws.on('message', function(jsonString, flags) {
  let data = JSON.parse(jsonString)[0];
  console.log('got data', JSON.stringify(data, null, 2));

  let ch = CHANNELS[data.channel];
  if ( ch ) {
    ch.handle(data);
  } else {
    console.log('donno how to handle that message!');
  }
});

const STATE = {};

const CHANNELS = {
  '/meta/handshake': {
    start: () => {
      send({
        "channel":"/meta/handshake",
        "version":"1.0",
        "supportedConnectionTypes":["callback-polling"]
      });
    },
    handle: ({successful, clientId}) => {
      STATE.clientId = clientId;
      if ( successful ) {
        console.log('handshake success');
        CHANNELS['/meta/subscribe'].user()
      } else {
        console.log('handshake unsuccessful!');
      }
    }
  },
  '/meta/subscribe': {
    user: () => {
      send({
        "channel":"/meta/subscribe",
        "clientId":STATE.clientId,
        "subscription":USER_SUB,
        "ext":{"access_token":ACCESS_TOKEN}
      });
      setInterval(CHANNELS[USER_SUB].ping, 30000);
    },
    handle: ({successful, subscription}) => {
      if (!successful) throw new Error('unsuccessful sub to '+subscription);
    }
  },
  [USER_SUB]: {
    ping: () => {
      send({
        "channel":USER_SUB,
        "data":{"type":"ping"},
        "clientId":STATE.clientId,
        "ext":{"access_token":ACCESS_TOKEN}
      })
    },
    handle: ({data}) => {
      if ( !data ) return;
      switch (data.type) {
        case 'ping':
          return // do nothing
        default:
          console.log('unhandled user channel message', data);
      }
    }
  }
}
