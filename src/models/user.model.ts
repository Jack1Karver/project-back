export interface ILoginUser {
  id: number;
  email: string;
  password: string;
  userName: string;
}

export interface IUser extends ILoginUser {
  firstName: string;
  lastName: string;
  secondName: string;
  rating: number;
  createdAr: Date;
  avatar: string;
}

export interface IUserExtended extends IUser {
  isStaff: boolean;
  isSuperAdmin: boolean;
  enabled: boolean;
}
