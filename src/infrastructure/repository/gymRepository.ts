import iGymRepo from "../../useCase/interface/gymRepo"
import Gym from "../../domain/gym"
import GymModel from "../db/gymModel"


class GymRepository implements iGymRepo {
    async save(gym: Gym): Promise<Gym > {
        const newGym = new GymModel(gym);
    
        await newGym.save(); 
        return newGym  
    }

    async findByEmail(email: string): Promise<Gym | null> {
        const gymData = await GymModel.findOne({email: email});
        return gymData 
     }
     async findById(_id: string): Promise<Gym | null> {
        const gymData = await GymModel.findById(_id);
        return gymData
     }
     async findAllGyms(): Promise<Gym[] | null> {
        const gymData = await GymModel.find();
        return gymData
     }

     async editGymStatus(_id: string, status: boolean): Promise<any> {
        
        const gymData = await GymModel.findByIdAndUpdate(_id, {isVerified: status});

     }
     async findByIdAndGetSubscriptions(_id: string): Promise<any> {

        const gymData = await GymModel.aggregate([{$match:{_id: _id}},{$project:{subscriptions:1}}])

        return gymData
     }

}


export default GymRepository