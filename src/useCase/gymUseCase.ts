import Gym from "../domain/gym";
import GymRepository from "../infrastructure/repository/gymRepository";
import EncryptPassword from "../infrastructure/services/bcryptPassword";
import GenerateEmail from "../infrastructure/services/sendEmail";

class GymUseCase {
  private _GymRepository: GymRepository;
  private _EncyptPassword: EncryptPassword;
  private _GenerateEmail: GenerateEmail;

  constructor(
    GymRepository: GymRepository,
    encryptPassword: EncryptPassword,
    generateEmail: GenerateEmail
  ) {
    this._GymRepository = GymRepository;
    this._EncyptPassword = encryptPassword;
    this._GenerateEmail = generateEmail;
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


}

export default GymUseCase;
