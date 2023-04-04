import { USER_NOT_FOUND } from "../../config/errors.config";
import { UserRepository } from "./user.repository";


export class UserService{

    repository = new UserRepository

    async getUser(userName: string){
        const user = await this.repository.getUserByName(userName);
        if(user){
            return user
        }
        else throw USER_NOT_FOUND
    }
}