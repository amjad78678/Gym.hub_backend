import CartRepository from "../infrastructure/repository/cartRepository";
import PaymentRepository from "../infrastructure/repository/paymentRepository";
import SubscriptionRepository from "../infrastructure/repository/subscriptionRepository";

class SubscriptionUseCase {
  private _CartRepository: CartRepository;
  private _PaymentRepository: PaymentRepository
  private _SubscriptionRepository: SubscriptionRepository

  constructor(cartRepository: CartRepository, paymentRepository: PaymentRepository, subscriptionRepository: SubscriptionRepository) {
    this._CartRepository = cartRepository;
    this._PaymentRepository = paymentRepository
    this._SubscriptionRepository = subscriptionRepository
  }

  async addNewSubscription(data: any) {
        
    const verifyCart=await this._CartRepository.cartDataForCheckout(data.userId)

    if(verifyCart){

      //saving subscribtion to db also need to be care about qr code also its pending
      const subscriptionSaveData = {...data}
      const subscription = await this._SubscriptionRepository.save(subscriptionSaveData)

      //after that deleting in user cart
      await this._CartRepository.deleteByUserId(data.userId)

      return {
        status: 200,
        data: {
          message: 'Subscription added successfully',
          subscription: subscription
        }
      }

    }
  }

  async verifyOnlinePayment(userId: string, gymId: string, price: number) {
    const verifyCart = await this._CartRepository.cartDataForCheckout(userId);

    if (
      verifyCart &&
      verifyCart.gymId._id == gymId &&
      verifyCart.price == price
    ) {
      console.log("verifyCart", "nammal verigy cart aayittund", verifyCart);

      
      const stripeId = await this._PaymentRepository.confirmPayment(price,verifyCart)

       return {
        status: 200,
        data: {
           success: true,
           stripeId: stripeId
        }
       }
    }else{
        return {
            status: 400,
            data: { message: 'An error occurred! Please try again later.' }
        };
    }
  }
}

export default SubscriptionUseCase;
