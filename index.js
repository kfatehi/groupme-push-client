const debug = require('debug')('groupme-push-client:index');
const { ACCESS_TOKEN, USER_ID } = require('./config');

if (!ACCESS_TOKEN || !USER_ID) {
  console.error('create config.js per the sample file');
  process.exit(1);
}

const { connect } = require('./src/push-client')({
  ACCESS_TOKEN,
  USER_ID
});

const { getGroups } = require('./src/rest-client')({
  ACCESS_TOKEN
});

const USER_SUB = `/user/${USER_ID}`;

const conn = connect()

conn.on('handshake:success', ()=>{
  conn.on(`/user/${USER_ID}:line.create`, (data)=>{
    debug('USER CHANNEL EVENT', data);
  })
  conn.once(`/user/${USER_ID}:subscribed`, ()=>{
    getGroups().then(({data:{response}}) => {
      let groups = response;
      // groups seems to be in a good order already wherein we can take the first
      // lets subscribe to BridgeTest group
      return testGroup = groups.find(g=>g.name === "BridgeTest");
    }).then(group=>{
      return conn.subscribe(`/group/${group.id}`)
    }).then(sub=>{

    }).catch(err=>{
      debug(err);
    })
  })
  conn.subscribe(USER_SUB).then(userSub => {
    console.log('user subbed', userSub);
  });
})

function getTestRoom() {
}
