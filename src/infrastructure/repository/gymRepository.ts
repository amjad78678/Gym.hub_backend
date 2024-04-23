import iGymRepo from "../../useCase/interface/gymRepo"
import Gym from "../../domain/gym"
import GymModel from "../db/gymModel"


class GymRepository implements iGymRepo {
    async save(gym: Gym): Promise<Gym > {
        const newGym = new GymModel(gym);
    
        const savedGym = await newGym.save();
        return savedGym.toObject() as Gym; 
    }

    async findByEmail(email: string): Promise<Gym | null> {
        const gymData = await GymModel.findOne({email: email});
        return gymData ? gymData.toObject() as Gym : null; 
     }
     async findById(_id: string): Promise<Gym | null> {
        const gymData = await GymModel.findById(_id);
        return gymData ? gymData.toObject() as Gym : null;
     }
     async findAllUsers(): Promise<Gym[] | null> {
        const gymData = await GymModel.find();
        return gymData ? gymData.map((gym) => gym.toObject() as Gym) : null;
     }

}


export default GymRepository