import mongoose from "mongoose";
import Subscription from "../../domain/subscription";
import iSubscriptionRepo from "../../useCase/interface/iSubscriptionRepo";
import SubscriptionModel from "../db/subscriptionModel";

class SubscriptionRepository implements iSubscriptionRepo {
  async save(data: Subscription): Promise<{}> {
    const subscription = new SubscriptionModel(data);
    const subscriptionData = await subscription.save();
    return subscriptionData;
  }

  async findAllSubscriptionsWithId(userId: string): Promise<Subscription[]> {
    const subscriptions = await SubscriptionModel.find({ userId: userId }).sort({createdAt: -1})
      .populate("gymId")
      .populate("userId");
    return subscriptions;
  }
  async findAllSubscriptions(): Promise<Subscription[]> {
    const subscriptions = await SubscriptionModel.find()
      .populate("gymId")
      .populate("userId");
    return subscriptions;
  }

  async verifySubscription(
    userId: string,
    gymId: string,
    subscriptionType: string
  ) {
    const subscription = await SubscriptionModel.findOne({
      userId: userId,
      gymId: gymId,
      subscriptionType: subscriptionType,
    });
    
    if (subscription) {
      return true;
    } else {
      return false;
    }
  }

  async isReviewPossible(userId: string, gymId: string) {
    const subscription = await SubscriptionModel.findOne({
      userId: userId,
      gymId: gymId,
      $and: [
        { date: { $lte: new Date() } },
        { expiryDate: { $gte: new Date() } },
      ],
    });

    return !!subscription;
  }

  async findTotalSalesOfSubscriptions(): Promise<any[]> {
    const subscriptions = await SubscriptionModel.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$price" },
        },
      },
    ]);
    return subscriptions;
  }

  async findPaymentMethodCount(): Promise<any[]> {
    const payments = await SubscriptionModel.aggregate([
      {
        $facet: {
          onlinePaymentCount: [
            { $match: { paymentType: "online" } },
            {
              $group: {
                _id: "$paymentMethod",
                count: { $sum: 1 },
              },
            },
          ],
          walletPaymentCount: [
            { $match: { paymentType: "wallet" } },
            {
              $group: {
                _id: "$paymentMethod",
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
      { $project: { onlinePaymentCount: 1, walletPaymentCount: 1, _id: 0 } },
    ]);
    return payments;
  }
  async findTotalBookings(): Promise<any> {
    const subscriptionCount = await SubscriptionModel.find().countDocuments();
    return subscriptionCount;
  }

  async findMonthlySales(): Promise<any[]> {
    const trainers = await SubscriptionModel.aggregate([
      {
        $match: {
          date: { $exists: true },
        },
      },
      {
        $group: {
          _id: { $month: "$date" },
          totalSales: { $sum: "$price" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          x: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "January" },
                { case: { $eq: ["$_id", 2] }, then: "February" },
                { case: { $eq: ["$_id", 3] }, then: "March" },
                { case: { $eq: ["$_id", 4] }, then: "April" },
                { case: { $eq: ["$_id", 5] }, then: "May" },
                { case: { $eq: ["$_id", 6] }, then: "June" },
                { case: { $eq: ["$_id", 7] }, then: "July" },
                { case: { $eq: ["$_id", 8] }, then: "August" },
                { case: { $eq: ["$_id", 9] }, then: "September" },
                { case: { $eq: ["$_id", 10] }, then: "October" },
                { case: { $eq: ["$_id", 11] }, then: "November" },
                { case: { $eq: ["$_id", 12] }, then: "December" },
              ],
              default: "Unknown",
            },
          },
          y: "$totalSales",
        },
      },
    ]);

    return trainers;
  }

  async findYearlySales(): Promise<any[]> {
    const trainers = await SubscriptionModel.aggregate([
      {
        $match: {
          date: { $exists: true },
        },
      },
      {
        $group: {
          _id: { $year: "$date" },
          totalSales: { $sum: "$price" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          x: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 2023] }, then: "2023" },
                { case: { $eq: ["$_id", 2024] }, then: "2024" },
                { case: { $eq: ["$_id", 2025] }, then: "2025" },
                { case: { $eq: ["$_id", 2026] }, then: "2026" },
                { case: { $eq: ["$_id", 2027] }, then: "2027" },
                { case: { $eq: ["$_id", 2028] }, then: "2028" },
                { case: { $eq: ["$_id", 2029] }, then: "2029" },
                { case: { $eq: ["$_id", 2030] }, then: "2030" },
              ],
              default: "Unknown",
            },
          },
          y: "$totalSales",
        },
      },
    ]);

    return trainers;
  }

  async findBookedMembershipsByGym(gymId: string): Promise<any[]> {
    const data = await SubscriptionModel.find({ gymId: gymId }).populate(
      "userId"
    );
    return data;
  }
  async getMonthlySalesById(
    gymId: string
  ): Promise<{ x: string; y: number }[]> {
    const sales = await SubscriptionModel.aggregate([
      { $match: { gymId: new mongoose.Types.ObjectId(gymId) } },
      {
        $group: {
          _id: { $month: "$date" },
          totalSales: { $sum: "$price" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          x: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "January" },
                { case: { $eq: ["$_id", 2] }, then: "February" },
                { case: { $eq: ["$_id", 3] }, then: "March" },
                { case: { $eq: ["$_id", 4] }, then: "April" },
                { case: { $eq: ["$_id", 5] }, then: "May" },
                { case: { $eq: ["$_id", 6] }, then: "June" },
                { case: { $eq: ["$_id", 7] }, then: "July" },
                { case: { $eq: ["$_id", 8] }, then: "August" },
                { case: { $eq: ["$_id", 9] }, then: "September" },
                { case: { $eq: ["$_id", 10] }, then: "October" },
                { case: { $eq: ["$_id", 11] }, then: "November" },
                { case: { $eq: ["$_id", 12] }, then: "December" },
              ],
            },
          },
          y: "$totalSales",
        },
      },
    ]);
    return sales;
  }

  async getYearlySalesById(gymId: string): Promise<{ x: string; y: number }[]> {
    const sales = await SubscriptionModel.aggregate([
      { $match: { gymId: new mongoose.Types.ObjectId(gymId) } },
      {
        $group: {
          _id: { $year: "$date" },
          totalSales: { $sum: "$price" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          x: { $toString: "$_id" },
          y: "$totalSales",
        },
      },
    ]);
    return sales;
  }

  async getLatestSubscriptionsById(gymId: string): Promise<any[]> {
    const subscriptions = await SubscriptionModel.aggregate([
      { $match: { gymId: new mongoose.Types.ObjectId(gymId) } },
      { $sort: { createdAt: -1 } },
      { $limit: 4 },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 1,
          userId: 1,
          username: "$user.username",
          email: "$user.email",
          profilePic: "$user.profilePic.imageUrl",
          date: 1,
          expiryDate: 1,
          subscriptionType: 1,
          paymentType: 1,
          price: 1,
        },
      },
    ]);
    return subscriptions;
  }
  async getTotalSalesById(gymId: string): Promise<number> {
    const result = await SubscriptionModel.aggregate([
      { $match: { gymId: new mongoose.Types.ObjectId(gymId) } },
      { $group: { _id: null, totalSales: { $sum: "$price" } } },
    ]);
    return result[0]?.totalSales || 0;
  }

  async getTotalUsersById(gymId: string): Promise<number> {
    const result = await SubscriptionModel.aggregate([
      { $match: { gymId: new mongoose.Types.ObjectId(gymId) } },
      { $group: { _id: "$userId" } },
      { $count: "totalUsers" },
    ]);
    return result[0]?.totalUsers || 0;
  }
}

export default SubscriptionRepository;
