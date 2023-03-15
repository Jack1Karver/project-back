import { AbstractRepository } from '../../db/abstract.repositry';
import { IUser } from '../../models/user.model';

export class AuthRepository extends AbstractRepository {
  saveUser(user: IUser) {
    try{
    this.insertAndGetID('user_table', user)
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
