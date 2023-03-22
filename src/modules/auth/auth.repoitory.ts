import { AbstractRepository } from '../../db/abstract.repository';
import { IUser } from '../../models/user.model';

export class AuthRepository extends AbstractRepository {
  async saveUser(user: IUser) {
    try{
    return await this.insertAndGetID('user_table', user)
    } catch(e){
      console.log(e)
    }
  }

  async getUserByFields(values: object): Promise<IUser | null> {
      const result = await this.getByFields('user_table', values);
      if (result.length) {
        return result[0] as IUser;
      }
      return null;

   
  }
}
