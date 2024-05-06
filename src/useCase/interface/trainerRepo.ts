import Trainer from "../../domain/trainer"

interface iTrainerRepo {

    findById(_id: string): Promise<Trainer[] | null>;
    save(gymId: string,trainer: Trainer ): Promise<Trainer>;




}
export default iTrainerRepo