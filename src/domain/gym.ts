interface Gym {
  _id: string;
  gymName?: string;
  email: string;
  contactNumber?: number;
  state?: string;
  city?: string;
  pincode?: string;
  businessId?: string;
  isBlocked?: boolean;
  isDeleted?: boolean;
  quarterlyFee?: number;
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
  images?: {
      imageUrl: string;
      public_id: string;
  }[];
  subscriptions?: any;
}

export default Gym;
