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

  init = 0;

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
      const res =  await this.findCoincidences(wishesMap, Number(idUser));
      return res
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  };

  findCoincidences = async (wishes: Map<number, number[]>, idUser: number): Promise<ICoincidences> => {
    try {
      let fullOffers: ICoincidence[] = [];
      let condOffers: ICoincidence[] = [];
      let anotherOffers: ICoincidence[] = [];

      const users = new Set<number>();
      const ids: number[] = [];

      for (let wish of wishes.keys()) {
        const res = await this.offerRepository.findOffersByCategories(idUser, wishes.get(wish)!, true);
        for (let row of res) {
          if (row.count === wishes.get(wish)!.length) {
            fullOffers.push(await this.formateICoincidens(row.id, row.idUser, wish));
          } else {
            condOffers.push(await this.formateICoincidens(row.id, row.idUser, wish));
          }
          ids.push(row.id);
          users.add(row.idUser);
        }
        const another = await this.offerRepository.findOffersByCategories(idUser, [], false);
        for (let row of another) {
          anotherOffers.push(await this.formateICoincidens(row.id, row.idUser, wish));
        }
      }
      if (this.init == 0) {
        const userCoincidences: ICoincidences[] = [];
        this.init++;
        for (let user of Array.from(users)) {
          userCoincidences.push(await this.getCoincidences(`${user}`));
        }
        let filteredCoincidences = userCoincidences.map(userCoin => {
          userCoin.full = userCoin.full.filter(coinc => {
            return coinc.user.id === idUser;
          });
          userCoin.partial = userCoin.partial.filter(coinc => {
            return coinc.user.id === idUser;
          });
          return {full: userCoin.full, partial: userCoin.partial}
        }).reduce((elem, arr)=>{
          return {
            full: elem.full.concat(arr.full),
            partial: elem.partial.concat(arr.partial)
          }
        });
        return {
          full: fullOffers.reduce((init, userOffers) => {
            let coinc =  filteredCoincidences.full.concat(filteredCoincidences.partial).find(offer=>offer.user.id === idUser)
            if(coinc){
              init.push({
                ...userOffers,
                wishOfferrer: coinc.wish,
                offerOfferrer: coinc.offer
              })
            }return init
          }, (new Array<ICoincidence>(0))),
          partial: condOffers.reduce((init, userOffers) => {
            let coinc =  filteredCoincidences.full.concat(filteredCoincidences.partial).find(offer=>offer.user.id === idUser)
            if(coinc){
              init.push({
                ...userOffers,
                wishOfferrer: coinc.wish,
                offerOfferrer: coinc.offer
              })
            }return init
          }, (new Array<ICoincidence>(0)))
        };
      }

      return {
        full: fullOffers,
        partial: condOffers,
      };
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  };

  formateICoincidens = async (id: number, idOfferer: number, wish: number) => {
    return {
      user: (await this.userRepository.getUserById(idOfferer))!,
      offer: await this.offerRepository.getOfferById(id),
      address: await this.addressRepository.getUserAddressById(`${idOfferer}`),
      wish: await this.wishRepository.getWishById(wish),
    };
  };
}
