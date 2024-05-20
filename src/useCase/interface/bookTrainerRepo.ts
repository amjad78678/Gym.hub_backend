import iTrainerBooking from "../../domain/trainerBooking";

interface iBookTrainerRepo {
    save(data: iTrainerBooking): Promise<{}>;
}

export default iBookTrainerRepo