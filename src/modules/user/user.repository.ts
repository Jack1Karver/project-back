import { AbstractRepository } from '../../db/abstract.repository';
import { IUserExtended } from '../../models/user.model';

export class UserRepository extends AbstractRepository {
  getUserByName = async (userName: string) => {
    const result = await this.getByFields('user_table', { userName: userName });
    if (result.length) {
      return result[0] as IUserExtended;
    }
    return null;
  };

  getUserById = async (id: number): Promise<IUserExtended | null> => {
    const result = await this.getByFields('user_table', { id: id });
    if (result.length) {
      return result[0] as IUserExtended;
    }
    return null;
  };
}
