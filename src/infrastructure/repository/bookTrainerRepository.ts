import iTrainerBooking from "../../domain/trainerBooking";
import iBookTrainerRepo from "../../useCase/interface/bookTrainerRepo";
import TrainerBookingModel from "../db/trainerBookingModel";


class BookTrainerRepository implements iBookTrainerRepo{
  
    async save(data: iTrainerBooking): Promise<{}> {

        const bookTrainer = new TrainerBookingModel(data)
        const trainer= await bookTrainer.save()
        return trainer
    }

    async isAlreadyBooked(userId: string, trainerId: string): Promise<boolean> {
        const trainer = await TrainerBookingModel.findOne({ userId, trainerId })
        if (trainer) {
            return true
        }
        return false
    }

    async findTotalSalesOfTrainer(): Promise<any[]> {
        const trainers = await TrainerBookingModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$amount" }
                }
            }
        ])
        return trainers
    }
}

export default BookTrainerRepository