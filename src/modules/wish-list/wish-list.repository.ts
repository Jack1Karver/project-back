import { AbstractRepository } from '../../db/abstract.repository';
import { ICategory } from '../../models/category.module';
import { IStatus } from '../../models/status.module';
import { IWishList } from '../../models/wish-list.model';

export class WishListRepository extends AbstractRepository {

  saveWish = async (wish: IWishList) => {
    try {
      return await this.insertAndGetID('wish_list', wish);
    } catch(e) {
      console.log(e);
      throw new Error();
    }
  };

  saveWishList = async ( idList: number) => {
    try {
        return  await this.insertAndGetID('user_list', { idWishList: idList });

    } catch (e) {
      console.log(e);
      throw new Error();
    }
  };

  saveUserValueCategory = async (idUserList: number, idCategory: number) => {
    await this.insertAndGetID('user_value_category', { idUserList, idCategory });
  };
}
