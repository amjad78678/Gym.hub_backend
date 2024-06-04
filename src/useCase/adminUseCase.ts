import { token } from "morgan";
import GymRepository from "../infrastructure/repository/gymRepository";
import JWTToken from "../infrastructure/services/generateToken";
import GenerateEmail from "../infrastructure/services/sendEmail";
import UserRepository from "../infrastructure/repository/userRepository";
import SubscriptionRepository from "../infrastructure/repository/subscriptionRepository";
import TrainerRepository from "../infrastructure/repository/trainerRepository";
import GymModel from "../infrastructure/db/gymModel";
import BookTrainerRepository from "../infrastructure/repository/bookTrainerRepository";

class AdminUseCase {
  private _GymRepository: GymRepository;
  private _UserRepository: UserRepository;
  private _GenerateEmail: GenerateEmail;
  private _JwtToken: JWTToken;
  private _SubscriptionRepository: SubscriptionRepository;
  private _TrainerRepository: TrainerRepository;
  private _BookTrainerRepository: BookTrainerRepository;

  constructor(
    gymRepository: GymRepository,
    generateEmail: GenerateEmail,
    jwtToken: JWTToken,
    userRepository: UserRepository,
    subscriptionRepository: SubscriptionRepository,
    trainerRepository: TrainerRepository,
    bookTrainerRepository: BookTrainerRepository
  ) {
    this._GymRepository = gymRepository;
    this._GenerateEmail = generateEmail;
    this._JwtToken = jwtToken;
    this._UserRepository = userRepository;
    this._SubscriptionRepository = subscriptionRepository;
    this._TrainerRepository = trainerRepository;
    this._BookTrainerRepository = bookTrainerRepository;
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
    console.log("gymData", gymData);
    if (gymData) {
      if (res.type === "rejected") {
        this._GenerateEmail.sendGymRejectEmail(gymData[0].email, res.reason);
        await this._GymRepository.rejectGym(res.id, true);
      } else if (res.type === "accepted") {
        this._GenerateEmail.sendGymAcceptEmail(gymData[0].email);
        await this._GymRepository.editGymStatus(res.id, true);
      }

      return {
        status: 200,
        data: {
          success: true,
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
    const gym = await this._GymRepository.findByIdAndUpdateBlock(id);
    console.log("iam gymdata", gym);
    if (gym) {
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
      gym[0].isDeleted = true;

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

  async updateUser(id: string, isBlocked: boolean, isDeleted: boolean) {
    const updatedUser = await this._UserRepository.findByIdAndUpdate(
      id,
      isBlocked,
      isDeleted
    );

    console.log("isBlocked", isBlocked);
    console.log("isDeleted", isDeleted);

    console.log("iam updated user", updatedUser);

    if (updatedUser) {
      return {
        status: 200,
        data: {
          success: true,
          message: "User updated successfully",
        },
      };
    } else {
      return {
        status: 400,
        data: {
          status: false,
          message: "User not found",
        },
      };
    }
  }

  async fetchSubscriptions() {
    const subscriptions =
      await this._SubscriptionRepository.findAllSubscriptions();
    console.log("iam subscription", subscriptions);
    return {
      status: 200,
      data: {
        success: true,
        subscriptions,
      },
    };
  }

  async fetchGymWithId(gymId: string) {
    const gym = await this._GymRepository.findById(gymId);
    return {
      status: 200,
      data: {
        success: true,
        gym,
      },
    };
  }

  async fetchTrainers() {
    const trainers = await this._TrainerRepository.findAllTrainers();
    return {
      status: 200,
      data: {
        success: true,
        trainers,
      },
    };
  }

  async updateTrainer(id: string, data: any) {
    await this._TrainerRepository.findByIdAndUpdate(id, data);
    return {
      status: 200,
      data: {
        success: true,
        message: "Trainer updated successfully",
      },
    };
  }

  async fetchRecentlyUsers() {
    const userData = await this._UserRepository.findRecentlyUsers();
    const gymData = await this._GymRepository.findRecentlyGyms();
    const totalSalesOfSubscription =
      await this._SubscriptionRepository.findTotalSalesOfSubscriptions();
    console.log("totalSalesOfSubscription", totalSalesOfSubscription);
    const totalSalesOfTrainer =
      await this._BookTrainerRepository.findTotalSalesOfTrainer();
      console.log("totalSalesOfTrainer", totalSalesOfTrainer)

      const totalUsers = await this._UserRepository.findTotalUsers();
      const totalTrainers = await this._TrainerRepository.findTotalTrainers();
      const totalGyms = await this._GymRepository.findTotalGyms();
    return {
      status: 200,
      data: {
        success: true,
        recently: userData,
        recGym: gymData,
        totalSales: totalSalesOfSubscription[0].totalSales+totalSalesOfTrainer[0].totalSales,
        totalUsers,
        totalTrainers,
        totalGyms
      },
    };
  }
}
export default AdminUseCase;
