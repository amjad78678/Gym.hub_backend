import Trainer from "../../domain/trainer";
import iTrainerBooking from "../../domain/trainerBooking";
import iTrainerRepo from "../../useCase/interface/trainerRepo";
import TrainerBookingModel from "../db/trainerBookingModel";
import TrainerModel from "../db/trainerModal";

class TrainerRepository implements iTrainerRepo {
  async findTotalTrainers(): Promise<any> {
    const trainers = await TrainerModel.find().countDocuments();
    return trainers;
  }
  async findAllTrainers(): Promise<Trainer[] | null> {
    const trainers = await TrainerModel.find().populate("gymId");
    return trainers;
  }
  async getExperienceFilter(
    experience: "1-3 years" | "3-5 years" | "5plus years" | "All"
  ): Promise<{ $gte: number; $lte: number } | null> {
    const experienceValues = ["1-3 years", "3-5 years", "5plus years"];
    if (experience === "All" || !experienceValues.includes(experience)) {
      return null;
    }

    const lteValues = {
      "1-3 years": { $gte: 1, $lte: 3 },
      "3-5 years": { $gte: 3, $lte: 5 },
      "5plus years": { $gte: 5, $lte: Infinity },
    };

    return lteValues[experience];
  }
  async findTrainersInUserSide(
    page: number,
    search: string,
    sliderValue: number,
    experience: any
  ): Promise<Trainer[] | null> {
    const limit = 4;
    const offset = (page - 1) * limit;
    const filters: {
      monthlyFee: { $lte: number };
      name?: { $regex: string; $options: string };
      experience?: { $gte: number; $lte: number };
    } = {
      monthlyFee: { $lte: sliderValue },
    };

    if (search) {
      filters.name = { $regex: search, $options: "i" };
    }

    if (
      experience &&
      ["1-3 years", "3-5 years", "5plus years", "All"].includes(experience)
    ) {
      const experienceFilter = await this.getExperienceFilter(experience);
      if (experienceFilter !== null) {
        filters.experience = experienceFilter;
      }
    }
    const trainers = await TrainerModel.find(filters)
      .limit(limit)
      .skip(offset)
      .populate("gymId");
    
    return trainers;
  }
  async findFullResultLen() {
    const length = await TrainerModel.find().countDocuments();
    return length;
  }
  async findMaxPrice() {
    const maxPrice = await TrainerModel.aggregate([
      { $group: { _id: null, maxPrice: { $max: "$monthlyFee" } } },
    ]);

    return maxPrice;
  }
  async findById(_id: string): Promise<Trainer[] | null> {
    const trainers = await TrainerModel.find({ gymId: _id }).populate("gymId");
    return trainers;
  }
  async findByIdTrainer(_id: string): Promise<Trainer | null> {
    const trainer = await TrainerModel.findById(_id);
    return trainer;
  }
  async findOne(email: string): Promise<Trainer | null> {
    const trainer = await TrainerModel.findOne({ email });
    return trainer;
  }
  async save(gymId: string, trainer: Trainer): Promise<Trainer> {
    const newTrainer = new TrainerModel({ gymId, ...trainer });
    const trainerData = await newTrainer.save();
    return trainerData;
  }

  async findByIdAndUpdate(id: string, data: any): Promise<any> {
    const trainer = await TrainerModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    return trainer;
  }
  async findByEmail(email: string): Promise<Trainer | null> {
    const trainer = await TrainerModel.findOne({ email });
    return trainer;
  }

  async saveTrainer(trainer: Trainer): Promise<Trainer> {
    const newTrainer = new TrainerModel(trainer);
    const trainerData = await newTrainer.save();
    return trainerData;
  }

  async getBookedTrainers(userId: string): Promise<{} | null> {
    const trainers = await TrainerBookingModel.find({
      userId: userId,
    }).populate({
      path: "trainerId",
      populate: {
        path: "gymId",
      },
    });
    return trainers;
  }

  async getSubscriptions(trainerId: string): Promise<{} | null> {
    const trainers = await TrainerBookingModel.find({ trainerId: trainerId })
      .populate({
        path: "trainerId",
        populate: {
          path: "gymId",
        },
      })
      .populate("userId");

    return trainers;
  }
  async findRecentlyTrainers(): Promise<Trainer[] | null> {
    const trainers = await TrainerModel.find().sort({ createdAt: -1 }).limit(4);
    return trainers;
  }
}

export default TrainerRepository;
