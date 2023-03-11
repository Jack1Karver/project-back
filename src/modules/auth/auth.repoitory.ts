import { AbstractRepository } from "../../db/abstract.repositry"
import { IUser } from "../../models/user.model"


export class AuthRepository extends AbstractRepository{


    saveUser(user: IUser){
        return 'succeded'
    }

    async getUserByEmail(email: string): Promise<IUser>{
        const result = await this.getByField('email', 'user', email)
        return result as IUser
    }
}