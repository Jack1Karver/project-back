import { AuthController } from './modules/auth/auth.controller';
import { OfferListController } from './modules/offer-list/offer-list.controller';
import { UserController } from './modules/user/user.controller';
import { WishListController } from './modules/wish-list/wish-list.controller';

export const ROUTES = [
  {
    path: '/auth',
    router: AuthController,
  },
  {
    path: '/user',
    router: UserController,
  },
  {
    path: '/offer',
    router: OfferListController
  },{
    path: '/wish',
    router: WishListController
  }
];
