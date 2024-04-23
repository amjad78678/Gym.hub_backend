import User from "../domain/user";
import UserRepository from "../infrastructure/repository/userRepository";
import EncryptPassword from "../infrastructure/services/bcryptPassword";
import JWTToken from "../infrastructure/services/generateToken";

class UserUseCase {
  private UserRepository: UserRepository;   
  private EncryptPassword:EncryptPassword
  private JwtToken: JWTToken;

  constructor(UserRepository: UserRepository,encryptPassword: EncryptPassword,jwtToken: JWTToken) {
    this.UserRepository = UserRepository;
    this.EncryptPassword=encryptPassword
    this.JwtToken=jwtToken
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

  async login(email: string, password: string) {

    const user = await this.UserRepository.findByEmail(email);
    let token='';

    if(user){

        if(user.isBlocked){
            return {
                status: 400,
                data: {
                    status:false,
                    message:'You have been blocked by admin!',
                    token:''
                }
            }
        }

       const isPasswordMatch=await this.EncryptPassword.compare(password,user.password)

       if(isPasswordMatch){
        const userId=user._id

         token=this.JwtToken.generateToken(userId,'user')

         return {
             status: 200,
             data: {
                 status:true,
                 message:user,
                 token
             }
         }

       }else{
        return {
            status: 400,
            data: {
                message: 'Invalid email or password!',
                token:''
            }
        };
       }
       
    }else{
        
        return {
            status: 400,
            data: {
                message: 'Invalid email or password!',
                token:''
            }
        }
    }

  }


}


export default UserUseCase