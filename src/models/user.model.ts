export interface ILoginUser {
  id?: number;
  userName: string;

  password: string;
}

export interface IUser extends ILoginUser {
  email: string;
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
