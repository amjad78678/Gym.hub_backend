import CartRepository from "../infrastructure/repository/cartRepository";
import CouponRepository from "../infrastructure/repository/couponRepository";
import PaymentRepository from "../infrastructure/repository/paymentRepository";
import SubscriptionRepository from "../infrastructure/repository/subscriptionRepository";
import UserRepository from "../infrastructure/repository/userRepository";

class SubscriptionUseCase {
  private _CartRepository: CartRepository;
  private _PaymentRepository: PaymentRepository;
  private _SubscriptionRepository: SubscriptionRepository;
  private _CouponRepository: CouponRepository;
  private _UserRepository: UserRepository;

  constructor(
    cartRepository: CartRepository,
    paymentRepository: PaymentRepository,
    subscriptionRepository: SubscriptionRepository,
    couponRepository: CouponRepository,
    userRepository: UserRepository
  ) {
    this._CartRepository = cartRepository;
    this._PaymentRepository = paymentRepository;
    this._SubscriptionRepository = subscriptionRepository;
    this._CouponRepository = couponRepository;
    this._UserRepository = userRepository;
  }

  async addNewSubscription(data: any) {
    console.log('iam data in usecase',data)
    const verifyCart = await this._CartRepository.cartDataForCheckout(
      data.userId
    );


    if (verifyCart) {
      //updating the coupon
      if (data.coupon.isApplied == true) {
        const couponData = await this._CouponRepository.findByNameData(
          data.coupon.name
        );
        const updated = await this._CouponRepository.applyCoupon(
          data.userId,
          data.coupon.name
        );
        console.log("updated", updated);
        if (updated) {
          data.coupon = {
            name: data.coupon.name,
            discount: couponData?.discount,
            isApplied: true,
          };
        }
      }

      if(data.paymentType == "wallet"){
       const wallet =  await this._UserRepository.updateWalletBallance(data.userId,data.price)
       if(!wallet){
        return {
          status: 400,
          data:{
            message: "Insuffiecient balance in wallet"
          }
        }
       }

      }

      //saving subscribtion to db also need to be care about qr code also its pending
      const subscriptionSaveData = { ...data };
      const subscription =
        await this._SubscriptionRepository.save(subscriptionSaveData);

      //after that deleting in user cart
      await this._CartRepository.deleteByUserId(data.userId);

      return {
        status: 200,
        data: {
          message: "Subscription added successfully",
          subscription: subscription,
        },
      };
    }else{
      return {
        status: 400,
        data: { message: "An error occurred! Please try again later." },
      }
    }
  }

  async verifyOnlinePayment(userId: string, gymId: string, price: number) {
    const verifyCart = await this._CartRepository.cartDataForCheckout(userId);

    if (verifyCart && verifyCart.gymId._id == gymId) {
      const stripeId = await this._PaymentRepository.confirmPayment(
        price,
        verifyCart
      );

      return {
        status: 200,
        data: {
          success: true,
          stripeId: stripeId,
        },
      };
    } else {
      return {
        status: 400,
        data: { message: "An error occurred! Please try again later." },
      };
    }
  }

  async fetchSubscriptions(userId: string) {
    const subscriptions = await this._SubscriptionRepository.findAllSubscriptionsWithId(userId);
    console.log('iam subscription',subscriptions)
    return {
      status: 200,
      data :{
      success: true,
      subscriptions
      }
    }
  }
}

export default SubscriptionUseCase;
