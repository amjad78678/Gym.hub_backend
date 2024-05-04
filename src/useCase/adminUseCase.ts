import { token } from "morgan";
import GymRepository from "../infrastructure/repository/gymRepository";
import JWTToken from "../infrastructure/services/generateToken";
import GenerateEmail from "../infrastructure/services/sendEmail";
import UserRepository from "../infrastructure/repository/userRepository";

class AdminUseCase {
  private _GymRepository: GymRepository;
  private _UserRepository: UserRepository;
  private _GenerateEmail: GenerateEmail;
  private _JwtToken: JWTToken;

  constructor(
    gymRepository: GymRepository,
    generateEmail: GenerateEmail,
    jwtToken: JWTToken,
    userRepository: UserRepository
  ) {
    this._GymRepository = gymRepository;
    this._GenerateEmail = generateEmail;
    this._JwtToken = jwtToken;
    this._UserRepository = userRepository;
  }

  async getGymDetails() {
    const gym = await this._GymRepository.findAllGyms();

    return {
      status: 200,
      data: {
        status: true,
        message: gym,
      },
    };
  }

  async gymAdminResponse(res: any) {
    console.log("uecaseres", res);

    const gymData = await this._GymRepository.findById(res.id);
    if (gymData) {
      if (res.type === "rejected") {
        this._GenerateEmail.sendGymRejectEmail(gymData.email, res.reason);
        const gym = await this._GymRepository.editGymStatus(res.id, false);
      } else if (res.type === "accepted") {
        this._GenerateEmail.sendGymAcceptEmail(gymData.email);

        const gym = await this._GymRepository.editGymStatus(res.id, true);
      }

      return {
        status: 200,
        data: {
          status: true,
          message: "Gym updated successfully",
        },
      };
    } else {
      return {
        status: 400,
        data: {
          status: false,
          message: "Gym cannot be found",
        },
      };
    }
  }

  async gymBlockAction(id: string) {
    const gym = await this._GymRepository.findById(id);

    console.log("iam gymdata", gym);

    if (gym) {
      gym.isBlocked = !gym.isBlocked;

      await this._GymRepository.save(gym);
      return {
        status: 200,
        data: {
          status: true,
          message: "Gym updated successfully",
        },
      };
    }

    return {
      status: 400,
      data: {
        status: false,
        message: "Gym cannot be found",
      },
    };
  }
  async gymDeleteAction(id: string) {
    const gym = await this._GymRepository.findById(id);
    console.log("iam gym", gym);

    if (gym) {
      gym.isDeleted = true;

      console.log("iam gym inside", gym);

      await this._GymRepository.save(gym);
      return {
        status: 200,
        data: {
          status: true,
          message: "Gym updated successfully",
        },
      };
    }

    return {
      status: 400,
      data: {
        status: false,
        message: "Gym cannot be found",
      },
    };
  }

  async adminLogin(email: string, password: string) {
    if (
      email == process.env.ADMIN_EMAIL &&
      password == process.env.ADMIN_PASSWORD
    ) {
      const token = this._JwtToken.generateToken(email, "admin");

      return {
        status: 200,
        data: {
          status: true,
          message: "Login successful",
          token,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          status: false,
          message: "Invalid email or password",
          token: null,
        },
      };
    }
  }

  async fetchUsers() {
    const users = await this._UserRepository.findAllUsers();
    
    if (users) {
      return {
        status: 200,
        data: {
          status: true,
          message: users,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          status: false,
          message: "No users found",
        },
      };
    }
  }

  async updateUser(id: string,isBlocked: boolean, isDeleted: boolean) {
    

    const updatedUser =  await this._UserRepository.findByIdAndUpdate(id,isBlocked,isDeleted)

    console.log('isBlocked',isBlocked)
    console.log('isDeleted',isDeleted)

    console.log("iam updated user", updatedUser)


    if(updatedUser){
      return {
        status: 200,
        data: {
          status : true,
          message: updatedUser
        }
      }
    }else{

      return {
        status: 400,
        data: {
          status : false,
          message: "User not found"
        }
      }
    }


  }
}
export default AdminUseCase;
