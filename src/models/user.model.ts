export interface ILoginUser {
  id: number;
  email: string;
  password: string;
  userName: string;
}

export interface IUser extends ILoginUser {
  firstName: string;
  lastName: string;
  secondName?: string;
  avatar?: string;
}

export interface IUserExtended extends IUser {
  isStaff: boolean;
  isSuperUser: boolean;
  enabled: boolean;
  rating: number;
  createdAt: Date;
}
