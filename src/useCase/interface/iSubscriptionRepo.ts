import Subscription from "../../domain/subscription";


interface iSubscriptionRepo {

    save(data: Subscription): Promise<{}>;
    findTotalSalesOfSubscriptions(): Promise<any[]>;

}

export default iSubscriptionRepo