import User from "../../domain/user";
import UserModel from "../db/userModel";
import UserRepo from "../../useCase/interface/userRepo";
import GymModel from "../db/gymModel";

class UserRepository implements UserRepo {
  async save(user: User): Promise<User> {
    const newUser = new UserModel(user);
    const savedUser = await newUser.save();
    return savedUser;
  }
  async findByEmail(email: string): Promise<User | null> {
    const userData = await UserModel.findOne({ email: email });

    return userData;
  }
  async findById(_id: string): Promise<User | null> {
    const userData = await UserModel.findById(_id);
    return userData;
  }

  async findAllUsers(): Promise<{}[] | null> {
    const userData = await UserModel.find().select("");
    return userData;
  }

  async findByIdAndUpdate(id: string, isBlocked: boolean, isDeleted: boolean) {
    const user = await UserModel.findByIdAndUpdate(
      id,
      { isBlocked, isDeleted },
      { new: true }
    );

    return user;
  }

  async findByIdAndUpdateProfile(id: string, data: any) {
    const user = await UserModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    return user;
  }

 

  async updateWalletBallance(userId: string, price: number) {
    try {
      const user = await UserModel.findById(userId);
      if (user?.wallet) {
        if (user && user.wallet < price) {
          return false;
        } else {
          const newWalletBalance = user.wallet - price;
          const history = {
            date: new Date(),
            amount: price,
            description: "Purchased subscription using wallet money",
            type: "Debit",
          };
          const updated = await UserModel.updateOne(
            { _id: userId },
            {
              $set: { wallet: newWalletBalance },
              $push: { walletHistory: history },
            }
          );

          if (updated) return true;
        }
      }
    } catch (error) {
      return false;
    }
  }

  async findRecentlyUsers(): Promise<{}[] | null> {
    const userData = await UserModel.find().sort({createdAt: -1}).limit(5);
    return userData;
  }

  async findTotalUsers(): Promise<{} | null> {
    const userData = await UserModel.find().countDocuments();
    return userData;

}
}
export default UserRepository;
