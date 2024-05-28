interface Gym {
  _id?: string;
  gymName?: string;
  email: string;
  contactNumber?: number;
  businessId?: string;
  isBlocked?: boolean;
  isDeleted?: boolean;
  dailyFee?: number;
  monthlyFee?: number;
  yearlyFee?: number;
  description?: string;
  password: string;
  confirmPassword?: string;
  isVerified?: boolean;
  location?: {
    type: string;
    coordinates: [number, number];
  };
  lat?: number;
  long?: number;
  address?: string;
  images?: string[];
  subscriptions?: any;
}

export default Gym;
