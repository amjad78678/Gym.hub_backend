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
  async findTrainersInUserSide(page: any): Promise<Trainer[] | null> {
    const limit = 4;
    const offset = (page - 1) * limit;
    const trainers = await TrainerModel.find()
      .limit(limit)
      .skip(offset)
      .populate("gymId");
    console.log("trainers from repository", trainers, trainers.length);
    return trainers;
  }
  async findFullResultLen() {
    const length = await TrainerModel.find().countDocuments();
    return length;
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
