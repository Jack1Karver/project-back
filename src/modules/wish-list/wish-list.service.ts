import { IAuthor } from '../../models/author.model';
import { IBookLiterary } from '../../models/book-literary.model';
import { ICategory } from '../../models/category.module';
import { IOfferList } from '../../models/offer-list.model';
import { IUserAddress } from '../../models/user-address.model';
import { AddressRepository } from '../address/address.repository';
import { StatusRepository } from '../status/status.repository';
import { UserListRepository } from '../userList/user-list.repository';
import { WishListRepository } from './wish-list.repository';

export class WishListService {
  wishRepository = new WishListRepository();
  addresRepository = new AddressRepository();
  userListRepository = new UserListRepository();
  statusRepository = new StatusRepository();

  saveOffer = async (idUser: number, categories: string[], address: IUserAddress, useDefault?: boolean) => {
    try {
      await this.wishRepository.startTransaction();
      let idUserAddress: number;
      if (useDefault) {
        const defaultAddress = await this.addresRepository.getDefaultUserAddress(idUser);
        if (!defaultAddress) {
          throw new Error();
        }
        idUserAddress = defaultAddress.id;
      } else {
        idUserAddress = (await this.addresRepository.saveAddress(address))!;
      }
      const wishId = await this.wishRepository.saveWish({
        idUser: idUser,
        createAt: new Date(),
        updateAt: new Date(),
        idStatus: await this.getStatus('свободен'),
        idUserAddress: idUserAddress,
      });
      if (wishId) {
        const userListId = await this.wishRepository.saveWishList(wishId);
        if (userListId) {
          const categoriesId = await this.getCategories(categories);
          for (let id of categoriesId) {
            await this.wishRepository.saveUserValueCategory(userListId, id);
          }
        }
      }
      await this.wishRepository.commitTransaction();
    } catch (e) {
      console.log(e);
      await this.wishRepository.rollbackTransaction();
      throw new Error();
    }
  };

  getCategories = async (categories: string[]) => {
    try {
      let categoriesId: number[] = [];
      for (let category of categories) {
        const idCategory = await this.userListRepository.getCategory(category);
        if (idCategory) {
          categoriesId.push(idCategory.id);
        } else {
          const res = await this.userListRepository.saveCategory(category);
          if (res) {
            categoriesId.push(res);
          }
        }
      }
      return categoriesId;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  };

  getStatus = async (status: string) => {
    try {
      let statusId = await this.statusRepository.getStatus({ name: status });
      if (!statusId) {
        return await this.statusRepository.insertStatus(status);
      }
      return statusId.id;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  };
}
