import dayjs from "dayjs";
import iPayment from "../../useCase/interface/iPaymentRepo";


const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const CLIENT_URL = process.env.CLIENT_URL;


class PaymentRepository implements iPayment {

 async confirmPayment(price: number, cartData: any): Promise<any> {

    console.log('iam cartData in confirm pay',cartData)

    const {subscriptionType,gymId,date,expiryDate} = cartData
    const text = `${subscriptionType} Subscription`
    
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: text,
                        images: [
                            gymId.images[0].imageUrl,
                            gymId.images[1].imageUrl,
                            gymId.images[2].imageUrl,
                            gymId.images[3].imageUrl,
                        ],
                        description: `
                        Welcome to ${gymId.gymName} 🏋️‍♀️💪. Enjoy unlimited access to our facilities with your ${subscriptionType} subscription. Your subscription starts from ${dayjs(date).format("DD-MM-YYYY")} and expires on ${dayjs(expiryDate).format("DD-MM-YYYY")}. Let's get fit together 💪🏋️‍♀️
                        `
                    },
                    unit_amount: price * 100,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${CLIENT_URL}/success`,
        cancel_url: `${CLIENT_URL}/cancel`,
    });
    

  return session.id;

}

}

export default PaymentRepository