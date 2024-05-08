import iCardRepo from "../../useCase/interface/iCartRepo";
import CartModel from "../db/cartModel";


class CartRepository implements iCardRepo  {

     async save(data: any): Promise<{}> {
        const cart = new CartModel(data)
       const cartData = await cart.save()
       return cartData
    }

    async deleteByUserId(userId: string): Promise<any> {
        try {
            const userCart = await CartModel.findOne({userId: userId})

            if(userCart){
                await CartModel.deleteOne({userId: userId})
            }
        } catch (error) {
         console.log(error)
        }
    }

     async cartDataForCheckout(userId: string): Promise<any> {

        const userCart = await CartModel.findOne({userId: userId}).populate('gymId')

         if(userCart){
            return userCart
         }
    }


}

export default CartRepository