const { ACCESS_TOKEN } = require('./config');

if (!ACCESS_TOKEN ) {
  console.error('create config.js per the sample file');
  process.exit(1);
}

const Client = require('./')
const client = new Client(ACCESS_TOKEN);

client.connect().then(() => {
  return client.api.getMe();
}).then(user => {
  console.log(user);
  return client.subscribe(`/user/${user.id}`).then(userSub => {
    console.log('subscribed to user messages');
    userSub.on('direct_message.create', function(data) {
      console.log('got a direct message:', data.alert);
    });
    userSub.on('line.create', function(data) {
      console.log('got a group message:', data.alert);
    });
  })
}).then(()=>{
  return client.api.getGroups()
}).then(groups => {
  return groups[0];
}).then(group => {
  let sendMessage = client.api.sendGroupMessage(group.id);
  return Promise.all([
    sendMessage("Hello world"),
    client.subscribe(`/group/${group.id}`).then(groupSub=>{
      console.log('subscribed to events regarding group', group.name);
      groupSub.on('typing', data=>{
        console.log('typing happening in group', group.name);
      })
    })
  ]);
}).catch(err=>{
  console.error(err);
})
