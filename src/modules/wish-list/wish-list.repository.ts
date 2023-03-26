import { AbstractRepository } from '../../db/abstract.repository';
import { ICategory } from '../../models/category.module';
import { IStatus } from '../../models/status.module';
import { IWishList } from '../../models/wish-list.model';

export class WishListRepository extends AbstractRepository {
  saveWish = async (wish: IWishList) => {
    try {
      return await this.insertAndGetID('wish_list', wish);
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  };

  saveWishList = async (idList: number) => {
    try {
      return await this.insertAndGetID('user_list', { idWishList: idList });
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  };

  saveUserValueCategory = async (idUserList: number, idCategory: number) => {
    await this.insertAndGetID('user_value_category', { idUserList, idCategory });
  };

  getWishCategories = async (idUser: string) => {
    try{
   let res =  await this.connection.sqlQuery(
      `SELECT wish_list.id as id, category.id as "categoryId" 
      FROM wish_list 
      JOIN user_list ON wish_list.id = user_list."idWishList" 
      JOIN user_value_category as uvc ON user_list.id = uvc."idUserList"
      JOIN category ON category.id = uvc."idCategory"
      WHERE wish_list."idUser" = ${idUser}` 
    );

    return res as {id: number, categoryId: number}[]
   } catch(err){
    console.log(err)
    throw new Error();
   }
  };
}
