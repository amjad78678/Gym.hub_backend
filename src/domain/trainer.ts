interface Trainer {
    
    _id: string,
    name: string,
    gender: string,
    age: number,
    experiance: number,
    achievements: string,
    monthlyFee: number,
    yearlyFee: number,
    isBlocked?: boolean,
    isDeleted?: boolean
}

export default Trainer