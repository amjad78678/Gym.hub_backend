import iTrainerBooking from "../domain/trainerBooking"
import BookTrainerRepository from "../infrastructure/repository/bookTrainerRepository"
import PaymentRepository from "../infrastructure/repository/paymentRepository"


class BookTrainerUseCase {

    private _PaymentRepository: PaymentRepository
    private _TrainerRepository: BookTrainerRepository

    constructor(paymentRepository: PaymentRepository, trainerRepository: BookTrainerRepository) {
        this._PaymentRepository = paymentRepository
        this._TrainerRepository = trainerRepository
    }

    async verifyTrainerBooking (body: any) { 

    const isAlreadyTrainerBooked = await this._TrainerRepository.isAlreadyBooked(body.userId,body.trainerId)

    if(!isAlreadyTrainerBooked){
      const sessionId = await this._PaymentRepository.confirmBookTrainerPayment(body)
    
      return {
        status: 200,
        data: {
          success: true,
          stripeId: sessionId,
        }
      }
    }else{
      return {
        status: 400,
        data: {
          success: false,
          message: "Already booked the trainer",
        }
      }
    }
    
  }

      async confirmBooking (body: iTrainerBooking) {
        
       await this._TrainerRepository.save(body)
       return {
         status: 200,
         data:{
           success: true,
         }
       }

      }


}


export default BookTrainerUseCase

