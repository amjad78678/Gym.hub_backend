import TrainerRepository from "../infrastructure/repository/trainerRepository";
import EncryptPassword from "../infrastructure/services/bcryptPassword";
import JWTToken from "../infrastructure/services/generateToken";


class TrainerUseCase {

    private _TrainerRepository: TrainerRepository
    private _EncryptPassword: EncryptPassword
    private _JwtToken: JWTToken

    constructor(trainerRepository: TrainerRepository, encryptPassword: EncryptPassword, jwtToken: JWTToken) {
        this._TrainerRepository = trainerRepository
        this._EncryptPassword=encryptPassword 
        this._JwtToken = jwtToken
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
}

export default TrainerUseCase