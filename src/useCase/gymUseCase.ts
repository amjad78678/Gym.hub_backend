import { token } from "morgan";
import Gym from "../domain/gym";
import GymRepository from "../infrastructure/repository/gymRepository";
import EncryptPassword from "../infrastructure/services/bcryptPassword";
import GenerateEmail from "../infrastructure/services/sendEmail";
import JWTToken from "../infrastructure/services/generateToken";
import { consumers } from "stream";

class GymUseCase {
  private _GymRepository: GymRepository;
  private _EncyptPassword: EncryptPassword;
  private _GenerateEmail: GenerateEmail;
  private _JwtToken: JWTToken;

  constructor(
    GymRepository: GymRepository,
    encryptPassword: EncryptPassword,
    generateEmail: GenerateEmail,
    jwtToken: JWTToken
  ) {
    this._GymRepository = GymRepository;
    this._EncyptPassword = encryptPassword;
    this._GenerateEmail = generateEmail;
    this._JwtToken = jwtToken;
  }

  async gymSignUp(gym: Gym) {
    const gymExists = await this._GymRepository.findByEmail(gym.email);

    if (gymExists) {
      return {
        status: 400,
        data: {
          status: false,
          message: "Gym already exists",
        },
      };
    }

    return {
      status: 200,
      data: {
        status: true,
        message: "Verification otp sent to your email!",
      },
    };
  }

  async gymOtpVerification(gym: Gym) {
    if (gym.password === gym.confirmPassword) {
      const hashedPassword = await this._EncyptPassword.encryptPassword(
        gym.password
      );

      const newGym = { ...gym, password: hashedPassword };

      const gymData = await this._GymRepository.save(newGym);
    }

    return {
      status: 200,
      data: {
        status: true,
        message: "We will be verify your gym within 3 days thankyou,",
      },
    };
  }

  async gymLogin(gymData: any) {
    if (gymData.email && gymData.password) {
      const gym = await this._GymRepository.findByEmail(gymData.email);

      if (gym) {
        if (gym.isBlocked) {
          return {
            status: 400,
            data: {
              status: false,
              message: "Gym is blocked by admin!",
              token: "",
            },
          };
        }

        if (gym?.isVerified) {
          const passwordMatch = await this._EncyptPassword.compare(
            gymData.password,
            gym.password
          );

          if (passwordMatch) {
            const token = this._JwtToken.generateToken(gym._id, "gym");

            return {
              status: 200,
              data: {
                status: true,
                message: "Login successful",
                gym: gym,
                token,
              },
            };
          } else {
            return {
              status: 400,
              data: {
                status: false,
                message: "Invalid email or password",
                token: "",
              },
            };
          }
        } else {
          return {
            status: 400,
            data: {
              status: false,
              message: "Gym not verified",
              token: "",
            },
          };
        }
      } else {
        return {
          status: 400,
          data: {
            status: false,
            message: "Invalid email or password",
            token: "",
          },
        };
      }
    }
  }


  async editGymSubscription(gymId: string, subscriptionData: any) {
    const gymData = await this._GymRepository.findById(gymId);

    if (gymData) {
      console.log("subscr data", subscriptionData);
 
      if (subscriptionData.subscription == "quarterlyFee") {
        gymData.subscriptions.quarterlyFee = subscriptionData.amount; 
       } else if (subscriptionData.subscription == "monthlyFee") {
        gymData.subscriptions.monthlyFee = subscriptionData.amount; 
       } else if (subscriptionData.subscription == "yearlyFee") {
        gymData.subscriptions.yearlyFee = subscriptionData.amount;
       }
       

      await this._GymRepository.save(gymData);

      return {
        status: 200,
        data: {
          status: true,
          message: "Subscription updated successfully",
        },
      }
    }else{
      return {
        status: 400,
        data: {
          status: false,
          message: "Gym not found",
        },
      }
    }


  }

  async fetchGymSubscription(gymId: string){

   const gymData = await this._GymRepository.findByIdAndGetSubscriptions(gymId);




   if(gymData){
    return {
      status: 200,
      data: {
        status: true,
        message: gymData
      },
    }
   }else{
    return {
      status: 400,
      data: {
        status: false,
        message: "Gym not found"
      },
    }
   }


  }
}
export default GymUseCase;
