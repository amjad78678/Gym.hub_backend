import jwt from 'jsonwebtoken';
import JWT from '../../useCase/interface/jwt';

class JWTToken implements JWT {
    generateToken(userId: string, role: string): string {
        
        const SECRETKEY=process.env.JWT_SECRET_KEY;

        if(SECRETKEY){
            const token: string = jwt.sign({userId,role},SECRETKEY);
            return token
        }
        
        throw new Error('JWT key is not defined!')
    }
}

export default JWTToken