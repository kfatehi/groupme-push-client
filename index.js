const debug = require('debug')('groupme-push-client:index');
const { ACCESS_TOKEN, USER_ID } = require('./config');

if (!ACCESS_TOKEN || !USER_ID) {
  console.error('create config.js per the sample file');
  process.exit(1);
}
const Client = require('./src/client')
const client = new Client({ACCESS_TOKEN});

client.connect().then((client) => {
  return client.subscribe(`/user/${USER_ID}`).then(userSub => {
    console.log('subscribed to user messages');
    userSub.on('line.create', function(data) {
      console.log('line created', data.alert);
    });
  })
}).then(()=>{
  return client.api.getGroups()
}).then(({data:{response}}) => {
  let groups = response;
  return groups[0];
}).then(group => {
  return client
    .subscribe(`/group/${group.id}`)
    .then(groupSub=>{
      console.log('subscribed to events regarding group', group.name);
      groupSub.on('typing', data=>{
        console.log('typing happening in group', group.name);
      })
    })
}).catch(err=>{
  debug(err);
})
