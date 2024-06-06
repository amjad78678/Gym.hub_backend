import iGymRepo from "../../useCase/interface/gymRepo";
import Gym from "../../domain/gym";
import GymModel from "../db/gymModel";
import mongoose from "mongoose";

class GymRepository implements iGymRepo {
  async save(gym: Gym): Promise<Gym> {
    const newGym = new GymModel(gym);
    await newGym.save();
    return newGym;
  }

  async findByEmail(email: string): Promise<Gym | null> {
    const gymData = await GymModel.findOne({ email: email });
    return gymData;
  }
  async findById(_id: string): Promise<any | null> {
    const gymData = await GymModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(_id) } },
      {
        $lookup: {
          from: "gymreviews",
          localField: "_id",
          foreignField: "gymId",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: "$reviews" }, 0] },
              then: { $avg: "$reviews.rating" },
              else: 0,
            },
          },
        },
      },
    ]);
    return gymData;
  }

  async findByIdAndUpdateBlock(_id: string): Promise<any | null> {
    const gym = await GymModel.findById({ _id });
    if (gym) {
      const gymData = await GymModel.findByIdAndUpdate(
        { _id },
        { isBlocked: !gym.isBlocked }
      );

      return gymData;
    }
  }

  async findNearGym(
    latitude: number,
    longitude: number,
    page: number
  ): Promise<Gym[] | null> {
    const limit = 4;
    const offset = (page - 1) * limit;
    const gymData = await GymModel.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [Number(longitude), Number(latitude)],
          },
          distanceField: "dist.calculated",
          maxDistance: 1000000 * 1000,
          spherical: true,
        },
      },
      {
        $skip: offset,
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "gymreviews",
          localField: "_id",
          foreignField: "gymId",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: "$reviews" }, 0] },
              then: { $avg: "$reviews.rating" },
              else: null,
            },
          },
          totalReviews: { $size: "$reviews" },
        },
      },
    ]);

    return gymData;
  }

  async findAllLen(): Promise<number> {
    const length = await GymModel.find().countDocuments();
    return length;
  }

  async findAllGyms(): Promise<Gym[] | null> {
    const gymData = await GymModel.find();
    return gymData;
  }

  async editGymStatus(_id: string, status: boolean): Promise<any> {
    await GymModel.findByIdAndUpdate(_id, {
      isVerified: status,
    });
  }
  async rejectGym(_id: string, status: boolean): Promise<any> {
    await GymModel.findByIdAndUpdate(_id, {
      isRejected: status,
    });
  }
  async findByIdAndGetSubscriptions(_id: string): Promise<any> {
    const gymData = await GymModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(_id) } },
      { $project: { subscriptions: 1 } },
    ]);

    return gymData;
  }
  async findRecentlyGyms(): Promise<{}[] | null> {
    const gymData = await GymModel.find().sort({ createdAt: -1 }).limit(4);
    return gymData;
  }
  async findTotalGyms(): Promise<{} | null> {
    const gymData = await GymModel.find().countDocuments();
    return gymData;
  }
  async findByIdAndUpdate(
    gymId: string,
    type: string,
    amount: string
  ): Promise<{} | null> {
    const price = Number(amount);
  const updated=  await GymModel.updateOne(
      { _id: gymId },
      { $set: { [`subscriptions.${type}`]: price } }
    );

return updated
  }
}

export default GymRepository;
