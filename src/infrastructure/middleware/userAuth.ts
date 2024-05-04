import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request,Response,NextFunction } from "express"
import UserRepository from '../repository/userRepository';

const _userRepo= new UserRepository()


declare global {
    namespace Express {

        interface Request {

            userId?: string

        }

    }
}


const protect = async(req: Request,res: Response, next: NextFunction) => {
    

    let token;

    token=req.cookies.userJwt;

    if(token){

        try {

            const decodedData= jwt.verify(token,process.env.JWT_SECRET_KEY as string) as JwtPayload;

            const user= await _userRepo.findById(decodedData.userId as string)
            
            if(decodedData && (!decodedData.role || decodedData.role !== 'user')){

                return res.status(401).json({ message: 'Not authorized, invalid token' });


            }


            if(user){
                req.userId= user._id
                if(user.isBlocked){

                    return res.status(401).json({ message: 'You are blocked by admin!' });

                }else{

                    next();
                }
            }else{

                return res.status(401).json({ message: 'Not authorized, invalid token' });
            }



            
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, invalid token' });
        }
    }else{
        return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
}

export {protect}