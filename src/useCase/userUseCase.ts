import User from "../domain/user";
import GymRepository from "../infrastructure/repository/gymRepository";
import UserRepository from "../infrastructure/repository/userRepository";
import EncryptPassword from "../infrastructure/services/bcryptPassword";
import JWTToken from "../infrastructure/services/generateToken";

class UserUseCase {
  private UserRepository: UserRepository;
  private EncryptPassword: EncryptPassword;
  private JwtToken: JWTToken;
  private _GymRepository: GymRepository;

  constructor(
    UserRepository: UserRepository,
    encryptPassword: EncryptPassword,
    jwtToken: JWTToken,
    gymRepository: GymRepository
  ) {
    this.UserRepository = UserRepository;
    this.EncryptPassword = encryptPassword;
    this.JwtToken = jwtToken;
    this._GymRepository = gymRepository;
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

    return {
      status: 200,
      data: {
        status: true,
        message: "User created successfully",
      },
    };
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

  async getGymList() {
    const gymList = await this._GymRepository.findAllGyms();
    return {
      status: 200,
      data: {
        success: false,
        message: gymList,
      },
    };
  }

  async getGymDetails(id: string) {
    const gymDetails = await this._GymRepository.findById(id);

    console.log("gymDeti", gymDetails);

    return {
      status: 200,
      data: {
        success: true,
        message: gymDetails,
      },
    };
  }

  async forgotPassword(email: string) {
    const user = await this.UserRepository.findByEmail(email);

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
}

export default UserUseCase;
