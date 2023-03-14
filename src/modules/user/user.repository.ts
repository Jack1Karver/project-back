import { AbstractRepository } from "../../db/abstract.repositry";

export class UserRepository extends AbstractRepository{
  getUserById = async (id: number) => {
    return await this.getByFields('user', {id: id}, false)
  };
}
