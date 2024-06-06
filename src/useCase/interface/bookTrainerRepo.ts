import iTrainerBooking from "../../domain/trainerBooking";

interface iBookTrainerRepo {
    save(data: iTrainerBooking): Promise<{}>;
    findTotalTraineesById(trainerId: string): Promise<number>;
    

}

export default iBookTrainerRepo