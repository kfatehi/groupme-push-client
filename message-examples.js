// in a group sub

{
  channel: '/group/27652728',
  data: {
    type: 'typing',
    user_id: '44906795',
    started: 1483111713008
  },
  clientId: '',
  id: 'cg',
  authenticated: true
}

// in a user sub, text message
{
  channel: '/user/34099505',
  clientId: '',
  id: '371fb7aa',
  data: {
    alert: 'KFATE: test',
    received_at: 1483112098000,
    type: 'line.create',
    subject: {
      attachments: [],
      avatar_url: '',
      created_at: 1483112098,
      group_id: '27652728',
      id: '148311209871305756',
      location: [Object],
      name: 'KFATE',
      picture_url: null,
      sender_id: '44906795',
      sender_type: 'user',
      source_guid: 'a989341ea18b8b573e8996262e829003',
      system: false,
      text: 'test',
      user_id: '44906795'
    },
  }
}

// in a user sub, picture message
{ channel: '/user/34099505',
  clientId: '',
  id: '367549d2',
  data: {
    alert: ' KFATE sent a picture to the group',
    received_at: 1483112330000,
    type: 'line.create',
    subject:{
      attachments: [Object],
      avatar_url: '',
      created_at: 1483112330,
      group_id: '27652728',
      id: '148311233021299225',
      location: [Object],
      name: 'KFATE',
      picture_url: 'https://i.groupme.com/256x256.png.2bc0d5bf88ad4969843743748ba5c109',
      sender_id: '44906795',
      sender_type: 'user',
      source_guid: 'a369a1fa024c5341ff145a9db6b70265',
      system: false,
      text: null,
      user_id: '44906795'
    },
  }
}
