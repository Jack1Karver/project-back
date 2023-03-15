import bcryptjs from 'bcryptjs';
import { ILoginUser, IUser, IUserExtended } from '../../models/user.model';
import { AuthRepository } from './auth.repoitory';
import jwt from 'jsonwebtoken';
import { USER_NOT_FOUND } from '../../config/errors.config';

export class AuthService {
  private authRepository = new AuthRepository();
  private salt = bcryptjs.genSaltSync(10);

  async login(user: ILoginUser) {
    const candidate = await this.authRepository.getUserByFields({email: user.email});
    console.log(process.env.SECRET_TOKEN)
    console.log(candidate)
    if (candidate) {
      const passwordResult = bcryptjs.compareSync(user.password, candidate.password);
      if (passwordResult) {
        const token = jwt.sign(
          {
            userId: candidate.id,
            userName: candidate.userName
          },
          process.env.SECRET_TOKEN!,
          { expiresIn: 3600 }
        );
        return { token: `Bearer ${token}` };
      } else {
        throw { code: 401, json: { message: 'Email or Password are not valid' } };
      }
    } else throw USER_NOT_FOUND;
  }

  async signin(user: IUser) {

    const candidate = await this.authRepository.getUserByFields({
      email : user.email,
      userName: user.userName
    });
    user.password = bcryptjs.hashSync(user.password, this.salt);
    if (!candidate) {
      const newUser: IUserExtended = {
        ...user,
        rating: 0,
        createdAt: new Date(),
        isStaff: false,
        isSuperUser: false,
        enabled: true,
      };
      this.authRepository.saveUser(newUser);
      return { message: 'Succeeded'};
    } else {
      throw { code: 422, json: { message: 'User was registered' } };
    }

  }
}
