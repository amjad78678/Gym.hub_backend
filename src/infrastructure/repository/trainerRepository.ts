import Trainer from "../../domain/trainer";
import iTrainerRepo from "../../useCase/interface/trainerRepo";
import TrainerModel from "../db/trainerModal";

class TrainerRepository implements iTrainerRepo {

  async findAllTrainers(): Promise<Trainer[] | null> {
    const trainers = await TrainerModel.find();
    return trainers;
  }
  async findById(_id: string): Promise<Trainer[] | null> {
    const trainers = await TrainerModel.find({ gymId: _id }).populate("gymId");
    return trainers;
  }
async findByIdTrainer(_id: string): Promise<Trainer | null> {
  const trainer = await TrainerModel.findById(_id)
  return trainer
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
}

export default TrainerRepository;
