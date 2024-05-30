import User from "../domain/user";
import BannerRepository from "../infrastructure/repository/bannerRepository";
import GymRepository from "../infrastructure/repository/gymRepository";
import GymReviewsRepository from "../infrastructure/repository/gymReviewsRepository";
import PaymentRepository from "../infrastructure/repository/paymentRepository";
import SubscriptionRepository from "../infrastructure/repository/subscriptionRepository";
import TrainerRepository from "../infrastructure/repository/trainerRepository";
import UserRepository from "../infrastructure/repository/userRepository";
import EncryptPassword from "../infrastructure/services/bcryptPassword";
import JWTToken from "../infrastructure/services/generateToken";
import SharpImages from "../infrastructure/services/sharpImages";
import CloudinaryUpload from "../infrastructure/utils/cloudinaryUpload";
import fs from "fs";
import path from "path";

interface iWallet {
  userId: string;
  wallet: number;
  walletHistory: {
    amount: number;
    date: Date;
    description: string;
  };
}
class UserUseCase {
  private UserRepository: UserRepository;
  private EncryptPassword: EncryptPassword;
  private JwtToken: JWTToken;
  private _GymRepository: GymRepository;
  private _PaymentRepository: PaymentRepository;
  private _TrainerRepository: TrainerRepository;
  private _SharpImages: SharpImages;
  private _CloudinayUpload: CloudinaryUpload;
  private _SubscriptionRespository: SubscriptionRepository;
  private _GymReviewsRepository: GymReviewsRepository;

  constructor(
    UserRepository: UserRepository,
    encryptPassword: EncryptPassword,
    jwtToken: JWTToken,
    gymRepository: GymRepository,
    paymentRepository: PaymentRepository,
    trainerRepository: TrainerRepository,
    sharpImages: SharpImages,
    cloudinaryUpload: CloudinaryUpload,
    subscriptionRepository: SubscriptionRepository,
    gymReviewsRepository: GymReviewsRepository
  ) {
    this.UserRepository = UserRepository;
    this.EncryptPassword = encryptPassword;
    this.JwtToken = jwtToken;
    this._GymRepository = gymRepository;
    this._PaymentRepository = paymentRepository;
    this._TrainerRepository = trainerRepository;
    this._SharpImages = sharpImages;
    this._CloudinayUpload = cloudinaryUpload;
    this._SubscriptionRespository = subscriptionRepository;
    this._GymReviewsRepository = gymReviewsRepository;
  }

  async signUp(email: string) {
    const userExists = await this.UserRepository.findByEmail(email);

    if (userExists) {
      return {
        status: 400,
        data: {
          status: false,
          message: "User already exists",
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

  async verifyOtpUser(user: User) {
    const hashedPassword = await this.EncryptPassword.encryptPassword(
      user.password
    );

    const newUser = { ...user, password: hashedPassword };

    console.log("iam new user after pass enc", newUser);

    const userData = await this.UserRepository.save(newUser);

    if (user.isGoogle) {
      const userId = userData._id;

      let token = this.JwtToken.generateToken(userId, "user");

      return {
        status: 200,
        data: {
          status: true,
          message: "User created successfully",
          user,
          token,
        },
      };
    } else {
      return {
        status: 200,
        data: {
          status: true,
          message: "User created successfully",
        },
      };
    }
  }

  async login(email: string, password: string) {
    const user = await this.UserRepository.findByEmail(email);
    let token = "";

    if (user) {
      if (user.isBlocked) {
        return {
          status: 400,
          data: {
            status: false,
            message: "You have been blocked by admin!",
            token: "",
          },
        };
      }

      const isPasswordMatch = await this.EncryptPassword.compare(
        password,
        user.password
      );

      if (isPasswordMatch) {
        const userId = user._id;

        token = this.JwtToken.generateToken(userId, "user");

        return {
          status: 200,
          data: {
            status: true,
            message: user,
            token,
          },
        };
      } else {
        return {
          status: 400,
          data: {
            success: false,
            message: "Invalid email or password!",
            token: "",
          },
        };
      }
    } else {
      return {
        status: 400,
        data: {
          success: false,
          message: "Invalid email or password!",
          token: "",
        },
      };
    }
  }

  async getGymList(latitude: any, longitude: any) {
    const gymList = await this._GymRepository.findNearGym(latitude, longitude);

    return {
      status: 200,
      data: {
        success: false,
        message: gymList,
      },
    };
  }

  async getGymListNormal() {
    const gymList = await this._GymRepository.findAllGyms();
    return {
      status: 200,
      data: {
        success: true,
        message: gymList,
      },
    };
  }

  async getGymDetails(id: string) {
    const gymDetails = await this._GymRepository.findById(id);

    return {
      status: 200,
      data: {
        success: true,
        message: gymDetails,
      },
    };
  }

  async getTrainers(page: any) {
    const trainers = await this._TrainerRepository.findAllTrainers(page);
    return {
      status: 200,
      data: {
        success: true,
        trainers,
      },
    };
  }

  async forgotPassword(email: string) {
    const user = await this.UserRepository.findByEmail(email);
    if (user?.isGoogle === false) {
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
    } else {
      return {
        status: 400,
        data: {
          success: false,
          message: "Google users cannot change password!",
        },
      };
    }
  }

  async updatePassword(email: string, password: string) {
    const user = await this.UserRepository.findByEmail(email);

    const hashedPassword = await this.EncryptPassword.encryptPassword(password);

    if (user && user.password) {
      user.password = hashedPassword;
      await this.UserRepository.save(user);

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

  async getUserDetails(id: string) {
    const user = await this.UserRepository.findById(id);
    return {
      status: 200,
      data: user,
    };
  }

  async addMoneyToWallet(walletData: iWallet) {
    const sessionId =
      await this._PaymentRepository.confirmAddMoneyToWalletPayment(walletData);

    return {
      status: 200,
      data: {
        success: true,
        stripeId: sessionId,
      },
    };
  }

  async getBookedTrainers(userId: string) {
    const trainers = await this._TrainerRepository.getBookedTrainers(userId);

    return {
      status: 200,
      data: {
        success: true,
        trainers,
      },
    };
  }

  async getTrainerDetails(id: string) {
    const trainer = await this._TrainerRepository.findByIdTrainer(id);
    return {
      status: 200,
      data: {
        success: true,
        trainer,
      },
    };
  }

  async editProfile(userId: string, userData: any, file: any) {
    const userDetails = await this.UserRepository.findById(userId);
    if (userDetails) {
      if (file) {
        const profilePic = await this._SharpImages.sharpenImage(
          file,
          640,
          640,
          "userProfile"
        );

        const obj = {
          imageUrl: profilePic.secure_url,
          public_id: profilePic.public_id,
        };

        if (userDetails && userDetails?.profilePic?.public_id !== "") {
          this._CloudinayUpload.deleteImage(userDetails?.profilePic.public_id);
        }
        const usr = { ...userData, profilePic: obj };

        if (!userData.mobileNumber) {
          delete usr.mobileNumber;
        }

        if (!userData.oldPassword) {
          delete usr.oldPassword;
          delete usr.password;
        } else {
          const isPasswordMatch = await this.EncryptPassword.compare(
            userData.password,
            userDetails?.password
          );
          if (isPasswordMatch) {
            const hashedPassword = await this.EncryptPassword.encryptPassword(
              userData.password
            );
            usr.password = hashedPassword;
          } else {
            return {
              status: 400,
              data: {
                success: false,
                message: "Old password is incorrect",
              },
            };
          }
        }
        await this.UserRepository.findByIdAndUpdateProfile(userId, usr);
      } else {
        const usr = { ...userData };
        delete usr.profilePic;

        if (!userData.mobileNumber) {
          delete usr.mobileNumber;
        }

        if (!userData.oldPassword) {
          delete usr.oldPassword;
          delete usr.password;
        } else {
          const isPasswordMatch = await this.EncryptPassword.compare(
            userData.password,
            userDetails?.password
          );
          if (isPasswordMatch) {
            const hashedPassword = await this.EncryptPassword.encryptPassword(
              userData.password
            );
            usr.password = hashedPassword;
          }
        }

        await this.UserRepository.findByIdAndUpdateProfile(userId, usr);
      }
      return {
        status: 200,
        data: {
          success: true,
          message: "Profile updated successfully",
        },
      };
    } else {
      return {
        status: 400,
        data: {
          success: false,
          message: "User not found",
        },
      };
    }
  }

  async isReviewPossible(userId: string, gymId: string) {
    const isPossible = await this._SubscriptionRespository.isReviewPossible(
      userId,
      gymId
    );
    console.log("isPossible", isPossible);

    return {
      status: 200,
      data: {
        success: true,
        isPossible: isPossible,
      },
    };
  }

  async addGymReview(userId: string, body: any) {
    const review = await this._GymReviewsRepository.addGymReview(userId, body);
    return {
      status: 200,
      data: {
        success: true,
        message: "Review added successfully",
      },
    };
  }

  async getGymReviews(userId: string, gymId: string) {
    const reviews = await this._GymReviewsRepository.getAllGymReviews(gymId);
    const isUserReviewed = await this._GymReviewsRepository.isUserReviewed(
      userId,
      gymId 
    );
    return {
      status: 200,
      data: {
        success: true,
        reviews,
        isUserReviewed,
      },
    };
  }

  async updateRatingGym(reviewData: any, reviewId: string) {
    const review = await this._GymReviewsRepository.updateRatingGym(
      reviewData,
      reviewId
    );
    return {
      status: 200,
      data: {
        success: true,
        message: "Rating updated successfully",
      },
    };
  }

  async getWorkoutsList() {
    const dataPath = path.join(
      __dirname,
      "../infrastructure/utils/static/bodyPartList.json"
    );
    const workoutList = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    return {
      status: 200,
      data: {
        success: true,
        workoutList,
      },
    };
  }

  async getExercisesDetails(bodyPart: string) {
    const dataPath = path.join(
      __dirname,
      `../infrastructure/utils/static/${bodyPart}.json`
    );
    const details = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    return {
      status: 200,
      data: {
        success: true,
        details,
      },
    };
  }
}

export default UserUseCase;
