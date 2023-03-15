import { AuthController } from './modules/auth/auth.controller';
import { UserController } from './modules/user/user.controller';

export const ROUTES = [
  {
    path: '/auth',
    router: AuthController,
  },
  {
    path: '/user',
    router: UserController,
  },
];
