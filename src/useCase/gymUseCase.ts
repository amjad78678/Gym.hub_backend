import { token } from "morgan";
import Gym from "../domain/gym";
import GymRepository from "../infrastructure/repository/gymRepository";
import EncryptPassword from "../infrastructure/services/bcryptPassword";
import GenerateEmail from "../infrastructure/services/sendEmail";
import JWTToken from "../infrastructure/services/generateToken";
import { consumers } from "stream";
import TrainerRepository from "../infrastructure/repository/trainerRepository";
import Trainer from "../domain/trainer";
import CloudinaryUpload from "../infrastructure/utils/cloudinaryUpload";
import SharpImages from "../infrastructure/services/sharpImages";
import SubscriptionRepository from "../infrastructure/repository/subscriptionRepository";

class GymUseCase {
  private _GymRepository: GymRepository;
  private _EncyptPassword: EncryptPassword;
  private _GenerateEmail: GenerateEmail;
  private _JwtToken: JWTToken;
  private _TrainerRepository: TrainerRepository;
  private _CloudinaryUpload: CloudinaryUpload;
  private _SharpImages: SharpImages;
  private _SubscriptionRepository: SubscriptionRepository;

  constructor(
    GymRepository: GymRepository,
    encryptPassword: EncryptPassword,
    generateEmail: GenerateEmail,
    jwtToken: JWTToken,
    trainerRepository: TrainerRepository,
    cloadinaryUpload: CloudinaryUpload,
    sharpImages: SharpImages,
    subscriptionRepository: SubscriptionRepository
  ) {
    this._GymRepository = GymRepository;
    this._EncyptPassword = encryptPassword;
    this._GenerateEmail = generateEmail;
    this._JwtToken = jwtToken;
    this._TrainerRepository = trainerRepository;
    this._CloudinaryUpload = cloadinaryUpload;
    this._SharpImages = sharpImages;
    this._SubscriptionRepository = subscriptionRepository;
  }

  async gymSignUp(gym: Gym, gymImageFiles: any) {
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

    const files = gymImageFiles as Express.Multer.File[];

    if (files?.length) {
      const imageUrls = await Promise.all(
        files.map(async (file) => {
          const res = await this._SharpImages.sharpenImage(
            file,
            6000,
            4000,
            "gymImages"
          );
          console.log("res", res);
          if (res) {
            return {
              imageUrl: res?.secure_url,
              public_id: res?.public_id,
            };
          }
        })
      );

      console.log("iam image urls", imageUrls);

      if (imageUrls.length === 4) {
        const obj = {
          gymName: gym.gymName,
          email: gym.email,
          contactNumber: gym.contactNumber,
          subscriptions: {
            Daily: gym.dailyFee,
            Monthly: gym.monthlyFee,
            Yearly: gym.yearlyFee,
          },
          description: gym.description,
          businessId: gym.businessId,
          password: gym.password,
          confirmPassword: gym.confirmPassword,
          location: {
            type: "Point",
            coordinates: [gym.long, gym.lat] as [number, number],
          },
          address: gym.address,
          images: imageUrls,
        };

        return {
          status: 200,
          data: {
            status: true,
            message: "Verification otp sent to your email!",
            gymData: obj,
          },
        };
      }
    }
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
      let token = "";

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
            console.log("gymId in Usecase", gym?._id);

            const gymId = gym._id;
            if (gymId) token = this._JwtToken.generateToken(gymId, "gym");

            console.log("iam token in usecase", token);

            return {
              status: 200,
              data: {
                status: true,
                message: "Login successful",
                gym: gym,
                gymId: gym._id,
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
      await this._GymRepository.findByIdAndUpdate(
        gymId,
        subscriptionData.subscription,
        subscriptionData.amount
      );

      return {
        status: 200,
        data: {
          status: true,
          message: "Subscription updated successfully",
        },
      };
    } else {
      return {
        status: 400,
        data: {
          status: false,
          message: "Gym not found",
        },
      };
    }
  }

  async fetchGymSubscription(gymId: string) {
    console.log("gymId", gymId);

    const gymData =
      await this._GymRepository.findByIdAndGetSubscriptions(gymId);

    console.log(gymData);

    if (gymData) {
      return {
        status: 200,
        data: {
          status: true,
          message: gymData,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          status: false,
          message: "Gym not found",
        },
      };
    }
  }

  async forgotPassword(email: string) {
    const user = await this._GymRepository.findByEmail(email);

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
    const user = await this._GymRepository.findByEmail(email);

    const hashedPassword = await this._EncyptPassword.encryptPassword(password);

    if (user && user.password) {
      user.password = hashedPassword;
      await this._GymRepository.save(user);

      return {
        status: 200,
        data: {
          success: true,
          message: user,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          success: false,
          message: "User not found!",
        },
      };
    }
  }

  async fetchGymTrainers(gymId: string) {
    const trainers = await this._TrainerRepository.findById(gymId);

    if (trainers) {
      return {
        status: 200,
        data: {
          status: true,
          message: trainers,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          status: false,
          message: "Trainer not found",
        },
      };
    }
  }

  async addGymTrainer(gymId: string, trainerData: Trainer) {
    const hashedPassword = await this._EncyptPassword.encryptPassword(
      trainerData.password
    );
    const newTrainerData = { ...trainerData, password: hashedPassword };
    const trainer = await this._TrainerRepository.save(gymId, newTrainerData);

    return {
      status: 200,
      data: {
        status: true,
        message: "Trainer added successfully",
      },
    };
  }

  async updateGymTrainer(trainerId: string, trainerData: Trainer) {
    if (trainerData.image !== "null") {
      const trainer = await this._TrainerRepository.findByIdTrainer(trainerId);
      await this._CloudinaryUpload.deleteImage(trainer?.image.public_id);
      console.log("iam imageUrl", trainerData.image, typeof trainerData.image);
      await this._TrainerRepository.findByIdAndUpdate(trainerId, trainerData);
    } else {
      const trainer = await this._TrainerRepository.findByIdTrainer(trainerId);
      const trainerDetails = { ...trainerData, image: trainer?.image };
      await this._TrainerRepository.findByIdAndUpdate(
        trainerId,
        trainerDetails
      );
    }

    return {
      status: 200,
      data: {
        status: true,
        message: "Trainer updated successfully",
      },
    };
  }

  async fetchGymData(gymId: string) {
    const gym = await this._GymRepository.findById(gymId);
    return {
      status: 200,
      data: {
        status: true,
        gymData: gym,
      },
    };
  }

  async bookedMemberships(gymId: string) {
    const bookedMemberships =
      await this._SubscriptionRepository.findBookedMembershipsByGym(gymId);
    console.log("booked", bookedMemberships);

    return {
      status: 200,
      data: {
        success: true,
        subscriptions: bookedMemberships,
      },
    };
  }

  async fetchDashboardDetails(gymId: string) {
    const monthlySales =
      await this._SubscriptionRepository.getMonthlySalesById(gymId);
    console.log("monthlySales", monthlySales);
    const yearlySales =
      await this._SubscriptionRepository.getYearlySalesById(gymId);
    console.log("yearlySales", yearlySales);
    const recentlyBookedMemberships =
      await this._SubscriptionRepository.getLatestSubscriptionsById(gymId);
    console.log("recentlyBookedMemberships", recentlyBookedMemberships);
    const totalSales =
      await this._SubscriptionRepository.getTotalSalesById(gymId);
    console.log("totalSales", totalSales);
    const totalUsers =
      await this._SubscriptionRepository.getTotalUsersById(gymId);
    console.log("totalUsers", totalUsers);
    return {
      status: 200,
      data: {
        success: true,
        monthlySales: monthlySales,
        yearlySales: yearlySales,
        recentlyBookedMemberships: recentlyBookedMemberships,
        totalSales: totalSales,
        totalUsers: totalUsers,
      },
    };
  }
}
export default GymUseCase;
