import { ObjectId } from "mongoose";
import PushNotificationModel from "../db/pushNotificationModel";
import firebase from "../services/firebasePushNotification";
const fs = require("fs");
const path = require("path");

class PushNotificationRepository {
  async updateOne(userId: string, token: string) {
    const notification = await PushNotificationModel.updateOne(
      { userId: userId },
      { $set: { token: token } },
      { upsert: true }
    );
    return notification;
  }

  async sendPushNotification(recieverId: ObjectId, content: string) {
    try {
      console.log("User Id:- " + recieverId);
      console.log("message:- " + content);
      // fs.readFile(
      //   path.join(__dirname, "../services/fireBaseConfig.json"),
      //   "utf8",
      //   async (err: any, jsonString: any) => {
      //     if (err) {
      //       console.log("Error reading file from disk:", err);
      //       return err;
      //     }
      //     try {
      //       //firebase push notification send
      //       const data = JSON.parse(jsonString);
      //       var serverKey = data.SERVER_KEY;
      //       var fcm = new FCM(serverKey);

      //       var push_tokens = await PushNotificationModel.findOne({
      //         userId: recieverId,
      //       });

      //       var reg_ids = [];

      //       reg_ids.push(push_tokens?.token);

      //       if (reg_ids.length > 0) {
      //         var pushMessage = {
      //           //this may vary according to the message type (single recipient, multicast, topic, et cetera)
      //           registration_ids: reg_ids,
      //           content_available: true,
      //           mutable_content: true,
      //           notification: {
      //             body: content,
      //             icon: "myicon", //Default Icon
      //             sound: "mySound", //Default sound
      //             // badge: badgeCount, example:1 or 2 or 3 or etc....
      //           },
      //           // data: {
      //           //   notification_type: 5,
      //           //   conversation_id:inputs.user_id,
      //           // }
      //         };

      //         console.log('iam push message',pushMessage)

      //         fcm.send(pushMessage, function (err: any, response: any) {
      //           if (err) {
      //             console.log("Something has gone wrong!", err);
      //           } else {
      //             console.log("Push notification sent.", response);
      //           }
      //         });
      //       }
      //     } catch (err) {
      //       console.log("Error parsing JSON string:", err);
      //     }
      //   }
      // );

      var push_tokens = await PushNotificationModel.findOne({
        userId: recieverId,
      });

      let message = {
        token: push_tokens?.token,
        notification: {
          title: "GymHub",
          body: content,
          icon: "https://res.cloudinary.com/dkxtgziy2/image/upload/v1718292712/1_xc02g4.png",
        },
      };

      const response = await firebase.messaging().send(message);
      console.log("firebase sent notification response", response);
    } catch (error) {
      console.log(error);
    }
  }
}

export default PushNotificationRepository;
