import mongoose from "mongoose";
import iTrainerBooking from "../../domain/trainerBooking";
import iBookTrainerRepo from "../../useCase/interface/bookTrainerRepo";
import TrainerBookingModel from "../db/trainerBookingModel";

class BookTrainerRepository implements iBookTrainerRepo {
  async save(data: iTrainerBooking): Promise<{}> {
    const bookTrainer = new TrainerBookingModel(data);
    const trainer = await bookTrainer.save();
    return trainer;
  }

  async isAlreadyBooked(userId: string, trainerId: string): Promise<boolean> {
    const trainer = await TrainerBookingModel.findOne({ userId, trainerId });
    if (trainer) {
      return true;
    }
    return false;
  }

  async findTotalSalesOfTrainer(): Promise<any[]> {
    const trainers = await TrainerBookingModel.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$amount" },
        },
      },
    ]);
    return trainers;
  }

  async findTotalBookings(): Promise<any> {
    const trainersCount = await TrainerBookingModel.find().countDocuments();
    return trainersCount;
  }

  async findMonthlySales(): Promise<any> {
    const trainers = await TrainerBookingModel.aggregate([
      {
        $match: {
          bookingDate: { $exists: true },
        },
      },
      {
        $group: {
          _id: { $month: "$bookingDate" },
          totalSales: { $sum: "$amount" },
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

  async findYearlySales(): Promise<any> {
    const trainers = await TrainerBookingModel.aggregate([
      {
        $match: {
          bookingDate: { $exists: true },
        },
      },
      {
        $group: {
          _id: { $year: "$bookingDate" },
          totalSales: { $sum: "$amount" },
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

  async findTotalSalesOfTrainerById(trainerId: string): Promise<number> {
    const result = await TrainerBookingModel.aggregate([
      { $match: { trainerId: new mongoose.Types.ObjectId(trainerId) } },
      { $group: { _id: null, totalSales: { $sum: "$amount" } } },
    ]);
    return result[0]?.totalSales || 0;
  }

  async findTotalBookingsById(trainerId: string): Promise<number> {
    const result = await TrainerBookingModel.aggregate([
      { $match: { trainerId: new mongoose.Types.ObjectId(trainerId) } },
      { $count: "totalBookings" },
    ]);
    return result[0]?.totalBookings || 0;
  }
  async findTotalTraineesById(trainerId: string): Promise<number> {
    const result = await TrainerBookingModel.aggregate([
      { $match: { trainerId: new mongoose.Types.ObjectId(trainerId) } },
      { $group: { _id: "$userId" } },
      { $count: "totalTrainees" },
    ]);
    return result[0]?.totalTrainees || 0;
  }

  async trainerMonthlySalesById(
    trainerId: string
  ): Promise<{ x: string; y: number }[]> {
    const sales = await TrainerBookingModel.aggregate([
      { $match: { trainerId: new mongoose.Types.ObjectId(trainerId) } },
      {
        $group: {
          _id: { $month: "$bookingDate" },
          totalSales: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          x: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "Jan" },
                { case: { $eq: ["$_id", 2] }, then: "Feb" },
                { case: { $eq: ["$_id", 3] }, then: "Mar" },
                { case: { $eq: ["$_id", 4] }, then: "Apr" },
                { case: { $eq: ["$_id", 5] }, then: "May" },
                { case: { $eq: ["$_id", 6] }, then: "Jun" },
                { case: { $eq: ["$_id", 7] }, then: "Jul" },
                { case: { $eq: ["$_id", 8] }, then: "Aug" },
                { case: { $eq: ["$_id", 9] }, then: "Sep" },
                { case: { $eq: ["$_id", 10] }, then: "Oct" },
                { case: { $eq: ["$_id", 11] }, then: "Nov" },
                { case: { $eq: ["$_id", 12] }, then: "Dec" },
              ],
            },
          },
          y: "$totalSales",
        },
      },
    ]);
    return sales;
  }

  async trainerYearlySalesById(
    trainerId: string
  ): Promise<{ x: string; y: number }[]> {
    const sales = await TrainerBookingModel.aggregate([
      { $match: { trainerId: new mongoose.Types.ObjectId(trainerId) } },
      {
        $group: {
          _id: { $year: "$bookingDate" },
          totalSales: { $sum: "$amount" },
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

  async recentlyJoinedTraineesById(trainerId: string): Promise<any[]> {
    const trainees = await TrainerBookingModel.aggregate([
      {
        $match: {
          trainerId: new mongoose.Types.ObjectId(trainerId),
        },
      },
      {
        $sort: { bookingDate: -1 },
      },
      {
        $group: {
          _id: "$userId",
          latestBooking: { $first: "$$ROOT" },
        },
      },
      {
        $sort: { "latestBooking.bookingDate": -1 },
      },
      {
        $limit: 4,
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          username: "$user.username",
          email: "$user.email",
          profilePic: "$user.profilePic.imageUrl",
          bookingDate: "$latestBooking.bookingDate",
          bookingType: "$latestBooking.bookingType",
          amount: "$latestBooking.amount",
          walletHistory: { $slice: ["$user.walletHistory", -3] },
        },
      },
    ]);

    return trainees;
  }
}

export default BookTrainerRepository;
