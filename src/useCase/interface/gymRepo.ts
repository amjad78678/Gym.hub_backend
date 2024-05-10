import Gym from "../../domain/gym";


interface iGymRepo {
    
    save(user: Gym): Promise<Gym>;
    findByEmail(email: string): Promise<Gym | null>;
    findById(_id: string): Promise<Gym | null>;
    findAllGyms(latitude: number,longitude: number): Promise<{}[] | null>;

}

export default iGymRepo