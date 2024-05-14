import Subscription from "../../domain/subscription";
import iSubscriptionRepo from "../../useCase/interface/iSubscriptionRepo";
import SubscriptionModel from "../db/subscriptionModel";


class SubscriptionRepository implements iSubscriptionRepo {

   async save(data: Subscription): Promise<{}> {
        const subscription = new SubscriptionModel(data)
       const subscriptionData = await subscription.save()
       return subscriptionData

    }

    async findAllSubscriptions(): Promise<Subscription[]> {

        const subscriptions = await SubscriptionModel.find().populate("gymId").populate("userId")
        return subscriptions
    }

}

export default SubscriptionRepository