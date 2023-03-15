export interface ILoginUser {
  id?: number;
  email: string;
  password: string;
}

export interface IUser extends ILoginUser {
  userName: string;
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
