interface User {
  _id: string;
  username: string;
  email: string;
  mobileNumber: number;
  gender: string;
  age: number;
  password: string;
  isBlocked?: boolean;
  isDeleted?: boolean;
  isGoogle?: boolean;
  profilePic?: string;
  wallet?: number;
  walletHistory?: any;
}

export default User;
