import Gym from "../../domain/gym";


interface iGymRepo {
    
    save(user: Gym): Promise<Gym>;
    findByEmail(email: string): Promise<Gym | null>;
    findById(_id: string): Promise<Gym | null>;
    findAllUsers(): Promise<{}[] | null>;

}

export default iGymRepo