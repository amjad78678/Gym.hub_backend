import Subscription from "../../domain/subscription";
import iSubscriptionRepo from "../../useCase/interface/iSubscriptionRepo";
import SubscriptionModel from "../db/subscriptionModel";


class SubscriptionRepository implements iSubscriptionRepo {

   async save(data: Subscription): Promise<{}> {
        const subscription = new SubscriptionModel(data)
       const subscriptionData = await subscription.save()
       return subscriptionData

    }

    async findAllSubscriptionsWithId(userId: string): Promise<Subscription[]> {

        const subscriptions = await SubscriptionModel.find({userId: userId}).populate("gymId").populate("userId")
        return subscriptions
    }
    async findAllSubscriptions(): Promise<Subscription[]> {

        const subscriptions = await SubscriptionModel.find().populate("gymId").populate("userId")
        return subscriptions
    }

    async verifySubscription(userId: string, gymId: string, subscriptionType: string) {

        const subscription = await SubscriptionModel.findOne({userId: userId, gymId: gymId, subscriptionType: subscriptionType})
        console.log('subs',subscription)
        if(subscription){
            return true
        }else{
            return false
        }
    }

    async isReviewPossible(userId: string, gymId: string) {
        const subscription = await SubscriptionModel.findOne({
            userId: userId,
            gymId: gymId,
            $and: [
                { date: { $lte: new Date() } },
                { expiryDate: { $gte: new Date() } }
            ]
        });

    
        return !!subscription;
    }
    

}

export default SubscriptionRepository