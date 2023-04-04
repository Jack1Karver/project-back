import bcryptjs from 'bcryptjs';
import { ILoginUser, IUser, IUserExtended } from '../../models/user.model';
import { AuthRepository } from './auth.repoitory';
import jwt from 'jsonwebtoken';
import { USER_NOT_FOUND } from '../../config/errors.config';
import { IUserAddress } from '../../models/user-address.model';
import { AddressService } from '../address/address.service';
import { SECRET_TOKEN } from '../../config/secret';

export class AuthService {
  private authRepository = new AuthRepository();
  private addressService = new AddressService();
  private salt = bcryptjs.genSaltSync(10);

  async login(user: ILoginUser) {
    const candidate = await this.authRepository.getUserByFields({ userName: user.userName });
    if (candidate) {
      const passwordResult = bcryptjs.compareSync(user.password, candidate.password);
      if (passwordResult) {
        const token = jwt.sign(
          {
            userId: candidate.id,
            userName: candidate.userName,
          },
          SECRET_TOKEN,
          { expiresIn: 3600 }
        );
        return { token: `Bearer ${token}` };
      } else {
        throw USER_NOT_FOUND;
      }
    } else throw USER_NOT_FOUND;
  }

  async signin(user: IUser, address: IUserAddress) {
    const candidate = await this.authRepository.getUserByFields({
      email: user.email,
      userName: user.userName,
    });
    if (!candidate) {
      user.password = bcryptjs.hashSync(user.password, this.salt);
      const newUser: IUserExtended = {
        ...user,
        rating: 0,
        createdAt: new Date(),
        isStaff: false,
        isSuperUser: false,
        enabled: true,
      };
      const userId = await this.authRepository.saveUser(newUser);
      if (userId) {
        this.addressService.saveAddress(address, userId);
      }

      return { message: 'Succeeded' };
    } else {
      throw { code: 422, json: { message: 'User was registered' } };
    }
  }
}
