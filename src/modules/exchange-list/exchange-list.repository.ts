import { AbstractRepository } from '../../db/abstract.repository';
import { IBookLiterary } from '../../models/book-literary.model';
import { ICategory } from '../../models/category.module';
import { IExchangeList } from '../../models/exchange-list.model';
import { IUserAddress } from '../../models/user-address.model';
import { IUserExchangeList } from '../../models/user-exchange-list.model';
import { IUserExtended } from '../../models/user.model';

export class ExchangeListRepository extends AbstractRepository {
  saveExchangeList = async fields => {
    return this.insertAndGetID('exchange_list', fields);
  };

  getExchangeList = async (idUser: string, byUser: boolean) => {
    const res = await this.connection.sqlQuery(`
        SELECT el.* FROM exchange_list  as el
        JOIN offer_list as of ON of.id = el."idOfferList${byUser ? 1 : 2}"
        WHERE of."idUser" = ${idUser}
        `);
    return res as IExchangeList[];
  };

  getBookByOfferId = async (id: number) => {
    const res = await this.connection.sqlQuery(`
        SELECT bl.* FROM book_literary as bl
        JOIN offer_list as of ON of."idBookLiterary" = bl.id 
        WHERE of.id = ${id}
        `);
    return res[0] as IBookLiterary;
  };

  getCategoriesByOfferId = async (id: number) => {
    const res = await this.connection.sqlQuery(`
        SELECT c.*
        from category as c 
                JOIN user_value_category as uvc ON uvc."idCategory" = c.id
                JOIN user_list as ul ON ul.id = uvc."idUserList"
                JOIN offer_list as ol ON ol.id = ul."idOfferList"
                WHERE ol.id = ${id}
        `);
    return res as ICategory[];
  };

  getUserByOfferId = async (id: number) => {
    const res = await this.connection.sqlQuery(`
        SELECT ut.* FROM user_table as ut
        JOIN offer_list as of ON of."idUser" = ut.id 
        WHERE of.id = ${id}
        `);
    return res[0] as IUserExtended;
  };
  setBoth = async (id: number) => {
    await this.connection.sqlQuery(`UPDATE exchange_list SET "isBoth" = true WHERE id = ${id}`);
  };

  getExchange = async (id: number) => {
    const res = await this.getByFields('exchange_list', { id });
    return res[0] as IExchangeList;
  };

  updateWishes = async (idWishList: number, statusId: number) => {
    await this.connection.sqlQuery(`UPDATE wish_list SET "idStatus" = ${statusId} WHERE id = ${idWishList}`);
  };

  updateOffer = async (idOfferList: number, statusId: number) => {
    await this.connection.sqlQuery(`UPDATE offer_list SET "idStatus" = ${statusId} WHERE id = ${idOfferList}`);
  };

  insertUserExchange = async fields => {
    await this.insertAndGetID('user_exchange_list', fields);
  };

  getUserExchangeByOffer = async (idOfferList: number) => {
    const res = await this.getByFields('user_exchange_list', { idOfferList });
    if (res.length) {
      return res[0] as IUserExchangeList;
    }
    return null;
  };

  setTrackNumber = async (idOfferList: number, trackNumber: string) => {
    await this.connection.sqlQuery(
      `UPDATE user_exchange_list SET "trackNumber" = ${trackNumber} WHERE "idOfferList" = ${idOfferList}`
    );
  };
  setReceiving = async (idOfferList: number) => {
    await this.connection.sqlQuery(
      `UPDATE user_exchange_list SET receiving = true WHERE "idOfferList" = ${idOfferList}`
    );
  };

  getUserAddress = async (idWishList: number) => {
    const res = await this.connection.sqlQuery(`SELECT ua.* FROM  user_address as ua 
    JOIN wish_list as wl ON ua.id = wl."idUserAddress" WHERE wl.id = ${idWishList}`);
    return res[0] as IUserAddress;
  };

  getUserExchanges = async (idExchangeList: number) => {
    const res = await this.getByFields('user_exchange_list', { idExchangeList });
    return res as IUserExchangeList[];
  };
}
