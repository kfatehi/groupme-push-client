const EventEmitter = require('events').EventEmitter;

class Channel extends EventEmitter {
  handleMessage () {
    const { data } = msg;
    if ( !data ) {
      return debug('handle sub with no data?', msg);
    }
    if ( data.type === "subscribe" ) {
      return debug('what do with subscribe?', data);
    }
    if ( data.type === "line.create" ) {
      return this.emit(`${subName}:line.create`, data);
    }
    if ( data.type === "ping" ) {
      return // noop
    }
    return debug('unhandled sub msg', msg);
  }
}

module.exports = Subscription;
