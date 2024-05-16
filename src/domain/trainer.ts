import { Schema } from "mongoose"

interface Trainer {
    
    _id?: string,
    gymId?: Schema.Types.ObjectId,
    name: string,
    gender: string,
    age: number,
    experience: number,
    achievements: string,
    monthlyFee: number,
    yearlyFee: number,
    email: string,
    password: string,
    image?: any,
    isBlocked?: boolean,
    isDeleted?: boolean
}

export default Trainer