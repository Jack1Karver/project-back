import { AbstractRepository } from '../../db/abstract.repository';
import { ICategory } from '../../models/category.module';

export class UserListRepository extends AbstractRepository {

  getCategory = async (category: string): Promise<ICategory | null> => {
    try {
      console.log(category);
      const res = await this.getByFields('category', { name: category });
      console.log(res);
      if (res.length) {
        return res[0] as ICategory;
      }
      return null;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  };

  saveCategory = async (category: string) => {
    try {
      return await this.insertAndGetID('category', { name: category, idParent: 0, multiSelect: false });
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  };
  
  
  saveUserList = async ( type:'wish'| 'offer', idList: number) => {

    console.log(idList);
    console.log(await this.connection.sqlQuery('SELECT * from wish_list'))
    try {
    switch(type){
      case 'wish':{
        return  await this.insertAndGetID('user_list', { idWishList: idList });
      }
        case 'offer': {
          return  await this.insertAndGetID('user_list', { idOfferList: idList });
        }
    }
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  };

  saveUserValueCategory = async (idUserList: number, idCategory: number) => {
    await this.insertAndGetID('user_value_category', { idUserList, idCategory });
  };
}
