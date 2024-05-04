import User from '../../domain/user'
import UserModel from '../db/userModel'
import UserRepo from '../../useCase/interface/userRepo'


class UserRepository implements UserRepo {


    async save(user: User): Promise<User> {

        const newUser = new UserModel(user)
        const savedUser = await newUser.save()
        return savedUser
    }
    async findByEmail(email: string): Promise<User | null> {

        const userData=await UserModel.findOne({email:email})

        return userData

    }
     async findById(_id: string): Promise<User | null> {

        const userData = await UserModel.findById(_id)

        return userData
    }

   async findAllUsers(): Promise<{}[] | null> {

        const userData = await UserModel.find().select('')
        return userData
    }

   async findByIdAndUpdate(id: string,isBlocked: boolean, isDeleted: boolean){


  const user =  await UserModel.findByIdAndUpdate(id,{isBlocked,isDeleted},{new: true})

  return user;

        

    }




}

export default UserRepository