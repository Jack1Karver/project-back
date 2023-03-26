import { IAuthor } from '../../models/author.model';
import { IBookLiterary } from '../../models/book-literary.model';
import { ICategory } from '../../models/category.module';
import { IOfferList } from '../../models/offer-list.model';
import { AddressRepository } from '../address/address.repository';
import { StatusRepository } from '../status/status.repository';
import { UserRepository } from '../user/user.repository';
import { UserListRepository } from '../userList/user-list.repository';
import { WishListRepository } from '../wish-list/wish-list.repository';
import { ICoincidence, ICoincidences } from './dto/coinciends.interface';
import { OfferListRepository } from './offer-list.repository';

export class OfferListService {
  offerRepository = new OfferListRepository();
  userListRepository = new UserListRepository();
  statusRepository = new StatusRepository();
  wishRepository = new WishListRepository();
  userRepository = new UserRepository();
  addressRepository = new AddressRepository();

  saveOffer = async (idUser: number, book: IBookLiterary, author: IAuthor, categories: string[], offer: IOfferList) => {
    try {
      await this.offerRepository.startTransaction();
      const offerId = await this.offerRepository.saveOffer({
        ...offer,
        yearPublishing: new Date(offer.yearPublishing),
        idBookLiterary: (await this.getBookId(book, author))!,
        idUser: idUser,
        createAt: new Date(),
        updateAt: new Date(),
        idStatus: await this.getStatus('Новый'),
      });
      if (offerId) {
        const userListId = await this.offerRepository.saveOfferList(offerId);
        if (userListId) {
          const categoriesId = await this.getCategories(categories);
          for (let id of categoriesId) {
            await this.offerRepository.saveUserValueCategory(userListId, id);
          }
        }
      }
      await this.offerRepository.commitTransaction();
    } catch (e) {
      console.log(e);
      await this.offerRepository.rollbackTransaction();
      console.log('rollback');
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

  getBookId = async (book: IBookLiterary, author: IAuthor) => {
    try {
      let authorId = await this.offerRepository.getAuthor(author);
      return await this.offerRepository.saveBook({
        ...book,
        idAuthor: authorId ? authorId.id : await this.offerRepository.saveAuthor(author),
      });
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  };

  getCoincidences = async (idUser: string) => {
    try {
      const wishes = await this.wishRepository.getWishCategories(idUser);
      const wishesMap = new Map<number, number[]>();
      for (let wish of wishes) {
        if (wishesMap.has(wish.id)) {
          wishesMap.get(wish.id)!.push(wish.categoryId);
        } else {
          wishesMap.set(wish.id, [wish.categoryId]);
        }
      }
      return await this.findCoincidences(wishesMap, idUser);
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  };

  findCoincidences = async (wishes: Map<number, number[]>, idUser: string): Promise<ICoincidences> => {
    try {
      let fullOffers: ICoincidence[] = [];
      let condOffers: ICoincidence[] = [];
      const ids: number[] = []
      let anotherOffers: ICoincidence[] = [];
      for (let wish of wishes.values()) {
        const res = await this.offerRepository.findOffersByCategories(idUser, wish, true);
        for (let row of res) {
          if (row.count === wish.length) {
            fullOffers.push({
              user: (await this.userRepository.getUserById(row.idUser))!,
              offer: await this.offerRepository.getOfferById(row.id),
              address: await this.addressRepository.getUserAddressById(idUser),
            });
          } else {
            condOffers.push({
              user: (await this.userRepository.getUserById(row.idUser))!,
              offer: await this.offerRepository.getOfferById(row.id),
              address: await this.addressRepository.getUserAddressById(idUser),
            });
          }
          ids.push(row.id)
        }
        const another = (await this.offerRepository.findOffersByCategories(idUser, [], false))
        for (let row of another){
          anotherOffers.push({
            user: (await this.userRepository.getUserById(row.idUser))!,
            offer: await this.offerRepository.getOfferById(row.id),
            address: await this.addressRepository.getUserAddressById(idUser),
          });
        }
      }
      console.log(ids)
      return {
        full: fullOffers,
        partial: condOffers,
        another: anotherOffers.filter(offer=>ids.includes(offer.offer.id))
      };
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  };
}
