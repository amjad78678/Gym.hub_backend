import Subscription from "../../domain/subscription";


interface iSubscriptionRepo {

    save(data: Subscription): Promise<{}>;

}

export default iSubscriptionRepo