const admin = require('firebase-admin')
const { google } = require('googleapis')
const axios = require('axios')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const serviceAccount = require('./messanging-fbf79-firebase-adminsdk-kag1v-664f36ff55.json')
const databaseURL = 'https://fcm-bc6cc.firebaseio.com'
const URL =
  'https://fcm.googleapis.com/v1/projects/fcm-bc6cc/messages:send'
const deviceToken =
  'd3gPN0D-TyrsQt7ry90FFd:APA91bEO1KtLyN_GjsrZNAKv59faa3EtSv6ODFj8yjDBwYmThh-qHHeT5S9pihoVEYaLV7zdTdESt4Qj3_3XlSCmIqSgu-04a6wwKVo9XBvcL2EtJfk88HflTB9sHyzHf0xA7GIEVA_6'
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
})

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    var key = serviceAccount
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    )
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}

async function init() {
  const body = {
    message: {
      data: { key: 'value' },
      notification: {
        title: 'Notification title',
        body: 'Notification body'
      },
      webpush: {
        headers: {
          Urgency: 'high'
        },
        notification: {
          requireInteraction: 'true'
        }
      },
      token: deviceToken
    }
  }

  try {
    const accessToken = await getAccessToken()
    console.log('accessToken: ', accessToken)
    const { data } = await axios.post(URL, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    console.log('name: ', data.name)
  } catch (err) {
    console.log('err: ', err.message)
  }
}
