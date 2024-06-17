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
      
      
      // fs.readFile(
      //   path.join(__dirname, "../services/fireBaseConfig.json"),
      //   "utf8",
      //   async (err: any, jsonString: any) => {
      //     if (err) {
      //       
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

      //         

      //         fcm.send(pushMessage, function (err: any, response: any) {
      //           if (err) {
      //             
      //           } else {
      //             
      //           }
      //         });
      //       }
      //     } catch (err) {
      //       
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
        },
      };

      const response = await firebase.messaging().send(message);
      
    } catch (error) {
      
    }
  }
}

export default PushNotificationRepository;
