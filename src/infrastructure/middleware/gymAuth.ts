import jwt,{ JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import GymRepository from '../repository/gymRepository';

const _gymRepo = new GymRepository();


declare global {
    namespace Express{
        interface Request {
            gymId?: string
        }
    }
}

const protect = async (req: Request, res: Response, next: NextFunction) => {
    

    let token;

    token=req.cookies.gymJwt;

    console.log('tokeninAuth',token)   

    if(token){


        try {

            const decodedData=jwt.verify(token,process.env.JWT_SECRET_KEY as string) as JwtPayload;

            console.log('tokenDecoded',decodedData)

            const gym=await _gymRepo.findById(decodedData.userId as string);

            console.log('tokenGym',gym)

            if(decodedData && (!decodedData.role || decodedData.role !== 'gym')){

                return res.status(401).json({ message: 'Not authorized, invalid token' });
            }

            if(gym){

                req.gymId = gym._id ;

                if(gym.isBlocked){

                     
                    return res.status(401).json({ message: 'Gym have been blocked by admin!' });

                } else {
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

export {protect};
