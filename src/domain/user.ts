interface User {

    _id: string
    username: string
    email: string
    mobileNumber: number
    gender: string
    age: number
    password: string
    isBlocked?: boolean
    isDeleted?: boolean
    isGoogle?: boolean
    profilePic?: string
}

export default User