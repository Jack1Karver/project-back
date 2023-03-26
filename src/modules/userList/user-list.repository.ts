import { AbstractRepository } from '../../db/abstract.repository';
import { ICategory } from '../../models/category.module';

export class UserListRepository extends AbstractRepository {

  getCategory = async (category: string): Promise<ICategory | null> => {
    try {
      const res = await this.getByFields('category', { name: category });
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
}
