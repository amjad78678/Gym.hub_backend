import Cart from "../domain/cart";
import CartRepository from "../infrastructure/repository/cartRepository";

class CartUseCase {
  private _CartRepository: CartRepository;

  constructor(cartRepository: CartRepository) {
    this._CartRepository = cartRepository;
  }

  async addToCart(data: any) {

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

  async getCheckoutDetails(userId: string) {

    const cart = await this._CartRepository.cartDataForCheckout(userId);
    
    if(cart){

      return {
        status: 200,
        data: {
           success: true,
           message: cart
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
