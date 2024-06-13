const firebase = require("firebase-admin");
const serviceAccount = require("./gymhub-push-notification-firebase-adminsdk-34ryj-4eaaeb8cda.json");
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
});

export default firebase;
