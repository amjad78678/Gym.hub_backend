import Trainer from "../../domain/trainer"

interface iTrainerRepo {

    findById(_id: string): Promise<Trainer[] | null>;
    save(gymId: string,trainer: Trainer ): Promise<Trainer>;
    findByIdAndUpdate(id: string, data: any): Promise<any>;
    findByEmail(email: string): Promise<Trainer | null>;
    saveTrainer(trainer: Trainer): Promise<Trainer>;
    findAllTrainers(): Promise<Trainer[] | null>;
    findByIdTrainer(_id: string): Promise<Trainer | null>;

}
export default iTrainerRepo