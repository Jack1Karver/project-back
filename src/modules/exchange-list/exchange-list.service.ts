import { IUserExchangeList } from '../../models/user-exchange-list.model';
import { ICoincidence } from '../offer-list/dto/coinciends.interface';
import { OfferListRepository } from '../offer-list/offer-list.repository';
import { StatusRepository } from '../status/status.repository';
import { UserRepository } from '../user/user.repository';
import { WishListRepository } from '../wish-list/wish-list.repository';
import { ExchangeListRepository } from './exchange-list.repository';

export class ExchageListService {
  exchangeListRepository = new ExchangeListRepository();
  offerListRepository = new OfferListRepository();
  userRepository = new UserRepository();
  statusRepository = new StatusRepository();

  saveExchangeList = async (coincindence: ICoincidence) => {
    await this.exchangeListRepository.saveExchangeList({
      idWishList1: coincindence.wish.id,
      idOfferList1: coincindence.offerOfferrer?.id,
      idWishList2: coincindence.wishOfferrer?.id,
      idOfferList2: coincindence.offer.id,
      createAt: new Date(),
      isBoth: false,
    });
  };

  getExchanges = async (idUser: string, active: boolean) => {
    const userExchanges = await this.exchangeListRepository.getExchangeList(idUser, true);
    const otherExchanges = await this.exchangeListRepository.getExchangeList(idUser, false);
    const userOffers = await Promise.all(
      userExchanges.map(async exc => {
        const book = await this.exchangeListRepository.getBookByOfferId(exc.idOfferList1);
        const author = await this.offerListRepository.getAuthorById(book.idAuthor);
        const userExchanges = await this.getUserExchange(exc.idOfferList1, exc.idOfferList2);
        const address = await this.exchangeListRepository.getUserAddress(exc.idWishList1)
        return {
          id: exc.id,
          isBoth: exc.isBoth,
          myOffer: {
            author: author,
            book: book,
            isSubmit: true,
            trackNumber: userExchanges.userExchange1 ? userExchanges.userExchange1.trackNumber: null,
            receiving: userExchanges.userExchange1 ? userExchanges.userExchange1.receiving : null,
            idOffer: exc.idOfferList1,
          },
          userOffer: {
            user: await this.exchangeListRepository.getUserByOfferId(exc.idOfferList2),
            categories: await this.exchangeListRepository.getCategoriesByOfferId(exc.idOfferList2),
            isSubmit: exc.isBoth,
            trackNumber: userExchanges.userExchange2 ? userExchanges.userExchange2.trackNumber: null,
            receiving: userExchanges.userExchange2 ? userExchanges.userExchange2.receiving : null,
            address: address
          },
        };
      })
    );
    const otherOffers = await Promise.all(
      otherExchanges.map(async exc => {
        const book = await this.exchangeListRepository.getBookByOfferId(exc.idOfferList2);
        const author = await this.offerListRepository.getAuthorById(book.idAuthor);
        const userExchanges = await this.getUserExchange(exc.idOfferList2, exc.idOfferList1);
        const address = await this.exchangeListRepository.getUserAddress(exc.idWishList1)
        return {
          id: exc.id,
          isBoth: exc.isBoth,
          myOffer: {
            author: author,
            book: book,
            isSubmit: exc.isBoth,
            idOffer: exc.idOfferList2,
            trackNumber: userExchanges.userExchange1 ? userExchanges.userExchange1.trackNumber: null,
            receiving: userExchanges.userExchange1 ? userExchanges.userExchange1.receiving : null
          },
          userOffer: {
            user: await this.exchangeListRepository.getUserByOfferId(exc.idOfferList1),
            categories: await this.exchangeListRepository.getCategoriesByOfferId(exc.idOfferList1),
            isSubmit: true,
            trackNumber: userExchanges.userExchange2 ? userExchanges.userExchange2.trackNumber: null,
            receiving: userExchanges.userExchange2 ? userExchanges.userExchange2.receiving : null,
            address: address
          },
        };
      })
    );
    return userOffers.concat(otherOffers);
  };

  submitExchange = async (id: number) => {
    await this.exchangeListRepository.setBoth(id);
    const exchange = await this.exchangeListRepository.getExchange(id);
    await this.exchangeListRepository.updateWishes(exchange.idWishList1, await this.getStatus('занят'));
    await this.exchangeListRepository.updateWishes(exchange.idWishList2, await this.getStatus('занят'));
    await this.exchangeListRepository.updateOffer(exchange.idOfferList2, await this.getStatus('занят'));
    await this.exchangeListRepository.updateOffer(exchange.idOfferList1, await this.getStatus('занят'));
    await this.exchangeListRepository.insertUserExchange({
      idExchangeList: exchange.id,
      idOfferList: exchange.idOfferList1,
      receiving: false,
    });
    await this.exchangeListRepository.insertUserExchange({
      idExchangeList: exchange.id,
      idOfferList: exchange.idOfferList2,
      receiving: false,
    });
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

  getUserExchange = async (
    idOffer1: number,
    idOffer2: number
  ): Promise<{ userExchange1: IUserExchangeList | null; userExchange2: IUserExchangeList | null; }> => {
    const exc1 = await this.exchangeListRepository.getUserExchange(idOffer1);
    const exc2 = await this.exchangeListRepository.getUserExchange(idOffer2);
    return {
      userExchange1: exc1,
      userExchange2: exc2,
    };
  };

  saveTrackNumber = async (idOfferList: number, track: string)=>{
    await this.exchangeListRepository.setTrackNumber(idOfferList, track)
  }

  setReceiving = async (idOfferList: number)=>{
    await this.exchangeListRepository.setReceiving(idOfferList)
  }
}
