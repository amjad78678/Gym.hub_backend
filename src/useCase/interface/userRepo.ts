import User from '../../domain/user'

interface UserRepo {
    
    save(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(_id: string): Promise<User | null>;
    findAllUsers(): Promise<{}[] | null>;

}

export default UserRepo;