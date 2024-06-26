import Cart from "../domain/cart";
import CartRepository from "../infrastructure/repository/cartRepository";
import CouponRepository from "../infrastructure/repository/couponRepository";
import SubscriptionRepository from "../infrastructure/repository/subscriptionRepository";
import UserRepository from "../infrastructure/repository/userRepository";

class CartUseCase {
  private _CartRepository: CartRepository;
  private _CouponRepository: CouponRepository;
  private _UserRepository: UserRepository;
  private _SubscriptionRepository: SubscriptionRepository;

  constructor(cartRepository: CartRepository,couponRepository: CouponRepository,userRepository:UserRepository,subscriptionRepository: SubscriptionRepository) {
    this._CartRepository = cartRepository;
    this._CouponRepository = couponRepository;
    this._UserRepository = userRepository;
    this._SubscriptionRepository = subscriptionRepository;
  }

  async addToCart(data: any) {

    
    const subscription = await this._SubscriptionRepository.verifySubscription(data.userId,data.gymId,data.subscriptionType);
    if(subscription){

      return {
        status: 200,
        data: {
          failure: true,
          message: `${data.subscriptionType} is already subscribed`
        }
      }

    }else{
      if(!data.userId){
        return {
          status: 400,
          data: {
            success: false,
            message: "Before proceeding please login"
          }
        }
      }else{
        await this._CartRepository.deleteByUserId(data.userId);
        const cart = await this._CartRepository.save(data);
    
        return {
          status: 200,
          data: {
             success: true,
             message: cart
          }
        }
      }
    }

  


  }

  async getCheckoutDetails(userId: string) {

    const cart = await this._CartRepository.cartDataForCheckout(userId);
    const user = await this._UserRepository.findById(userId);

    
    const gymId = cart.gymId._id

    const coupons = await this._CouponRepository.findCheckoutCoupons(gymId);   
    
    
    if(cart){

      return {
        status: 200,
        data: {
           success: true,
           message: cart,
           coupons,
           userWallet: user?.wallet
        }
    }
    }else{

      return {
        status: 400,
        data: {
           success: false,
           message: "Cart is empty"
        }
    }
    }
  }
}

export default CartUseCase;
