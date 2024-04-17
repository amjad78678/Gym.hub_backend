import User from "../domain/user";
import UserRepository from "../infrastructure/repository/userRepository";
import EncryptPassword from "../infrastructure/services/bcryptPassword";

class UserUseCase {
  private UserRepository: UserRepository;
  private EncryptPassword:EncryptPassword

  constructor(UserRepository: UserRepository,encryptPassword: EncryptPassword) {
    this.UserRepository = UserRepository;
    this.EncryptPassword=encryptPassword
  }

  async signUp(email: string){   

    const userExists = await this.UserRepository.findByEmail(email)

    if(userExists){

        return {
            status: 400,
            data: {
                status:false,
                message:'User already exists'
            }
        }
    }

    return {
        status: 200,
        data: {
            status:true,
            message:'Verification otp sent to your email!'
        }
    }


  }

  async verifyOtpUser(user: User){

    const hashedPassword=await this.EncryptPassword.encryptPassword(user.password)

    const newUser={...user,password:hashedPassword}

    console.log('iam new user after pass enc',newUser)

    const userData=await this.UserRepository.save(newUser)

    return {
        status: 200,
        data: {
            status:true,
            message:'User created successfully'
        }
    } 

  }


}


export default UserUseCase