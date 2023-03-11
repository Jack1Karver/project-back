import bcryptjs from 'bcryptjs';
import { IUser } from '../../models/user.model';
import { AuthRepository } from './auth.repoitory';
import jwt from 'jsonwebtoken';

export class AuthService {
  private authRepository = new AuthRepository();
  private salt = bcryptjs.genSaltSync(10);

  async login(email: string, password: string) {
    const candidate = await this.authRepository.getUserByEmail(email);
    if (candidate) {
      const passwordResult = bcryptjs.compareSync(password, candidate.password);
      if (passwordResult) {
        const token = jwt.sign(
          {
            email: candidate.email,
            userId: candidate.id,
          },
          process.env.SECRET_TOKEN!,
          { expiresIn: 3600 }
        );
        return { code: 200, json: { token: `Bearer ${token}` } };
      } else {
        return { code: 401, json: { message: 'Email or Password are not valid' } };
      }
    } else return { code: 404, json: { message: 'User not found' } };
  }

  signin(user: IUser) {
    if (!this.authRepository.getUserByEmail(user.email)) {
      user.password = bcryptjs.hashSync(user.password, this.salt);
      this.authRepository.saveUser(user);
      return { code: 200, json: { message: 'Succeeded' } };
    } else {
      return { code: 422, json: { message: 'User was reqistered' } };
    }
  }
}
