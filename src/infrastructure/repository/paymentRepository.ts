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
        success_url: `${CLIENT_URL}/success/checkout`,
        cancel_url: `${CLIENT_URL}/cancel/checkout`,
    });
    

  return session.id;

}

async confirmAddMoneyToWalletPayment(walletData: any): Promise<any> {

    const {userId,wallet}=walletData

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Add Money To Wallet",
              images: [
                "https://partner.visa.com/content/dam/gpp/homepage/card-lab-header-v2-2x.png",
              ],
              description: `An amount of ₹${wallet} will be credited to your wallet after this payment.`,
            },
            unit_amount: wallet * 100,
          },

          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${CLIENT_URL}/profile/subscriptions`,
      cancel_url: `${CLIENT_URL}/cancel/add_money`,
  })

  return session.id
}

async confirmBookTrainerPayment(bookTrainerData: any): Promise<any> {

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Book Your Trainer",
              images: [
                "https://partner.visa.com/content/dam/gpp/homepage/card-lab-header-v2-2x.png",
              ],
              description: `Join GymHub and unlock personalized training with our Book Your Trainer service Chat with your trainer anytime, day or night 🌞🌜, and dive into video classes for flexible workouts 📺. We're here to support you every step of the way towards your fitness goals 💪🚴‍♂️.`
          },
            unit_amount: bookTrainerData.amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${CLIENT_URL}/success/book_trainer`,
      cancel_url: `${CLIENT_URL}/cancel/book_trainer`,
  })

  return session.id
  
}

}

export default PaymentRepository