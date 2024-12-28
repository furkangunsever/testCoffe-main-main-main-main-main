const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendNotification = functions.https.onRequest(async (req, res) => {
  try {
    const {token, title, body, data} = req.body;

    const message = {
      token: token,
      notification: {
        title: title,
        body: body,
      },
      data: data,
      android: {
        notification: {
          channel_id: 'default_notification_channel',
        },
      },
    };

    const response = await admin.messaging().send(message);
    res.json({success: true, response});
  } catch (error) {
    res.status(500).json({success: false, error: error.message});
  }
});
