import TrainerRepository from "../infrastructure/repository/trainerRepository";
import UserRepository from "../infrastructure/repository/userRepository";
import EncryptPassword from "../infrastructure/services/bcryptPassword";
import JWTToken from "../infrastructure/services/generateToken";


class TrainerUseCase {

    private _TrainerRepository: TrainerRepository
    private _EncryptPassword: EncryptPassword
    private _JwtToken: JWTToken
    private _UserRepository: UserRepository

    constructor(trainerRepository: TrainerRepository, encryptPassword: EncryptPassword, jwtToken: JWTToken,userRepository: UserRepository) {
        this._TrainerRepository = trainerRepository
        this._EncryptPassword=encryptPassword 
        this._JwtToken = jwtToken
        this._UserRepository = userRepository
    }


    async login(email: string, password: string) {
        
        if(email && password){

            const trainer = await this._TrainerRepository.findOne(email);
            let token=""
            if(trainer){
            const isPasswordMatch = await this._EncryptPassword.compare(password,trainer.password)
                
                if(isPasswordMatch){
                    const trainerId=trainer._id

                    if(trainerId) token = this._JwtToken.generateToken(trainerId,"trainer")


                        return {
                            status: 200,
                            data: {
                                status: true,
                                message: "Login successful",
                                trainer: trainer,
                                token: token
                            }
                        }
                }else{
                    return {
                        status: 400,
                        data: {
                            status: false,
                            message: "Invalid email or password",
                            token: ""
                        }
                    }
                }
            }else{
                return {
                    status: 400,
                    data: {
                        status: false,
                        message: "Invalid email or password",
                        token: ""
                    }
                }
            }
        }else{
            return {
                status: 400,
                data: {
                    status: false,
                    message: "Invalid email or password",
                    token: ""
                }
            }
        }
    }

    async forgotPassword(email: string) {
        const user = await this._TrainerRepository.findByEmail(email);
    
        if (!user) {
          return {
            status: 400,
            data: {
              success: false,
              message: "User not found!",
            },
          };
        } else if (user?.isBlocked) {
          return {
            status: 400,
            data: {
              success: false,
              message: "You have been blocked by admin!",
            },
          };
        } else {
          return {
            status: 200,
            data: {
              success: true,
              message: "Verification otp sent to your email!",
            },
          };
        }
      }
    
      async updatePassword(email: string, password: string) {
        const trainer = await this._TrainerRepository.findByEmail(email);
    
        const hashedPassword = await this._EncryptPassword.encryptPassword(password);
    
        if (trainer && trainer.password) {
          trainer.password = hashedPassword;
          await this._TrainerRepository.saveTrainer(trainer);
    
          return {
            status: 200,
            data: {
              success: true,
              message: trainer,
            },
          }
        }else {
          return {
            status: 400,
            data: {
              success: false,
              message: "User not found!",
            },
          };
        }
      }

      async getUserDetails(id: string) {

        const user = await this._UserRepository.findById(id);
        console.log('user',user)

        return {
          status: 200,
          data: {
            success: true,
            user: user
          }
        }
      }

      async getSubscriptions(trainerId: string) {
        const trainerBookings = await this._TrainerRepository.getSubscriptions(trainerId);
        console.log('subscriptions',trainerBookings)
        return {
          status: 200,
          data: {
            success: true,
            trainees: trainerBookings
          }
        }
      }

    
}

export default TrainerUseCase